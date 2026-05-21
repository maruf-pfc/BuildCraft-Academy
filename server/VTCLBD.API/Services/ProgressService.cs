using VTCLBD.API.Common.Exceptions;
using VTCLBD.API.Configs;
using VTCLBD.API.DTOs.Progress;
using VTCLBD.API.Interfaces;
using VTCLBD.API.Models;
using Microsoft.EntityFrameworkCore;

namespace VTCLBD.API.Services
{
    public class ProgressService : IProgressService
    {
        private readonly AppDbContext _context;

        public ProgressService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<LessonProgressResponseDto> MarkLessonCompleteAsync(string userId, MarkLessonCompleteDto request)
        {
            var lesson = await _context.VideoLessons
                .Include(v => v.Module)
                .FirstOrDefaultAsync(v => v.Id == request.LessonId);

            if (lesson == null) throw new NotFoundException("Lesson not found.");

            // Ensure student is enrolled in the course
            var enrolled = await _context.Enrollments
                .AnyAsync(e => e.UserId == userId && e.CourseId == lesson.Module!.CourseId);

            if (!enrolled)
                throw new ApiException("You must be enrolled in the course to track progress.", 403);

            var progress = await _context.LessonProgresses
                .FirstOrDefaultAsync(p => p.UserId == userId && p.LessonId == request.LessonId);

            if (progress == null)
            {
                progress = new LessonProgress
                {
                    UserId = userId,
                    LessonId = request.LessonId,
                    IsCompleted = true,
                    CompletedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                };
                _context.LessonProgresses.Add(progress);
            }
            else
            {
                progress.IsCompleted = true;
                progress.CompletedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            // After saving, check if course is now fully complete and issue certificate
            await TryIssueCertificateAsync(userId, lesson.Module!.CourseId);

            return new LessonProgressResponseDto
            {
                LessonId = progress.LessonId,
                IsCompleted = progress.IsCompleted,
                CompletedAt = progress.CompletedAt
            };
        }

        public async Task<CourseProgressResponseDto> GetCourseProgressAsync(string userId, Guid courseId)
        {
            var course = await _context.Courses
                .Include(c => c.Modules)
                    .ThenInclude(m => m.VideoLessons)
                .FirstOrDefaultAsync(c => c.Id == courseId);

            if (course == null) throw new NotFoundException("Course not found.");

            var completedLessonIds = await _context.LessonProgresses
                .Where(p => p.UserId == userId && p.IsCompleted)
                .Select(p => p.LessonId)
                .ToListAsync();

            var moduleDtos = course.Modules.OrderBy(m => m.Order).Select(m =>
            {
                var totalInModule = m.VideoLessons.Count(v => v.IsPublished);
                var completedInModule = m.VideoLessons.Count(v => completedLessonIds.Contains(v.Id));
                return new ModuleProgressDto
                {
                    ModuleId = m.Id,
                    ModuleTitle = m.Title,
                    TotalLessons = totalInModule,
                    CompletedLessons = completedInModule,
                    IsModuleCompleted = totalInModule > 0 && completedInModule == totalInModule
                };
            }).ToList();

            var totalLessons = moduleDtos.Sum(m => m.TotalLessons);
            var completedLessons = moduleDtos.Sum(m => m.CompletedLessons);
            var percentage = totalLessons > 0 ? Math.Round((double)completedLessons / totalLessons * 100, 2) : 0;

            return new CourseProgressResponseDto
            {
                CourseId = courseId,
                CourseTitle = course.Title,
                TotalLessons = totalLessons,
                CompletedLessons = completedLessons,
                ProgressPercentage = percentage,
                IsCourseCompleted = totalLessons > 0 && completedLessons == totalLessons,
                CompletedLessonIds = completedLessonIds,
                Modules = moduleDtos
            };
        }

        public async Task<CertificateResponseDto?> GetCertificateAsync(string userId, Guid courseId)
        {
            var cert = await _context.Certificates
                .Include(c => c.User)
                .Include(c => c.Course)
                .FirstOrDefaultAsync(c => c.UserId == userId && c.CourseId == courseId);

            if (cert == null) return null;

            return new CertificateResponseDto
            {
                Id = cert.Id,
                CertificateNumber = cert.CertificateNumber,
                StudentName = cert.User?.FullName ?? string.Empty,
                CourseTitle = cert.Course?.Title ?? string.Empty,
                IssuedAt = cert.IssuedAt,
                CertificateUrl = !string.IsNullOrEmpty(cert.CertificateUrl) 
                    ? cert.CertificateUrl 
                    : $"https://res.cloudinary.com/dniosv5ot/image/upload/v1779370284/certificate_mockup.png"
            };
        }

        // ── Private: Auto-issue Certificate ─────────────────────────────────────

        private async Task TryIssueCertificateAsync(string userId, Guid courseId)
        {
            // Already has a certificate?
            var existing = await _context.Certificates
                .AnyAsync(c => c.UserId == userId && c.CourseId == courseId);
            if (existing) return;

            var progress = await GetCourseProgressAsync(userId, courseId);
            if (!progress.IsCourseCompleted) return;

            var certNumber = $"CERT-{DateTime.UtcNow:yyyy}-{Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper()}";

            var certificate = new Certificate
            {
                UserId = userId,
                CourseId = courseId,
                CertificateNumber = certNumber,
                IssuedAt = DateTime.UtcNow
                // CertificateUrl can be set after PDF generation is implemented
            };

            _context.Certificates.Add(certificate);
            await _context.SaveChangesAsync();
        }
    }
}
