using VTCLBD.API.Common.Exceptions;
using VTCLBD.API.Configs;
using VTCLBD.API.DTOs.Lesson;
using VTCLBD.API.DTOs.Module;
using VTCLBD.API.Interfaces;
using VTCLBD.API.Models;
using Microsoft.EntityFrameworkCore;

namespace VTCLBD.API.Services
{
    public class CourseModuleService : ICourseModuleService
    {
        private readonly AppDbContext _context;

        public CourseModuleService(AppDbContext context)
        {
            _context = context;
        }

        // ── Modules ──────────────────────────────────────────────────────────────

        public async Task<IEnumerable<ModuleResponseDto>> GetModulesByCourseAsync(Guid courseId)
        {
            return await _context.CourseModules
                .Where(m => m.CourseId == courseId)
                .OrderBy(m => m.Order)
                .Include(m => m.VideoLessons)
                .Include(m => m.ResourceLinks)
                .Select(m => MapModuleToDto(m))
                .ToListAsync();
        }

        public async Task<ModuleResponseDto> GetModuleByIdAsync(Guid id)
        {
            var module = await _context.CourseModules
                .Include(m => m.VideoLessons)
                .Include(m => m.ResourceLinks)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (module == null) throw new NotFoundException("Module not found.");
            return MapModuleToDto(module);
        }

        public async Task<ModuleResponseDto> CreateModuleAsync(CreateModuleDto request)
        {
            var course = await _context.Courses.FindAsync(request.CourseId);
            if (course == null) throw new NotFoundException("Course not found.");

            var module = new CourseModule
            {
                CourseId = request.CourseId,
                Title = request.Title,
                Description = request.Description,
                Order = request.Order,
                IsPublished = request.IsPublished,
                CreatedAt = DateTime.UtcNow
            };

            _context.CourseModules.Add(module);
            await _context.SaveChangesAsync();

            return MapModuleToDto(module);
        }

        public async Task<ModuleResponseDto> UpdateModuleAsync(Guid id, UpdateModuleDto request)
        {
            var module = await _context.CourseModules
                .Include(m => m.VideoLessons)
                .Include(m => m.ResourceLinks)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (module == null) throw new NotFoundException("Module not found.");

            if (request.Title != null) module.Title = request.Title;
            if (request.Description != null) module.Description = request.Description;
            if (request.Order.HasValue) module.Order = request.Order.Value;
            if (request.IsPublished.HasValue) module.IsPublished = request.IsPublished.Value;

            module.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapModuleToDto(module);
        }

        public async Task<bool> DeleteModuleAsync(Guid id)
        {
            var module = await _context.CourseModules.FindAsync(id);
            if (module == null) throw new NotFoundException("Module not found.");

            _context.CourseModules.Remove(module);
            await _context.SaveChangesAsync();
            return true;
        }

        // ── Lessons ──────────────────────────────────────────────────────────────

        public async Task<LessonResponseDto> AddLessonAsync(CreateLessonDto request)
        {
            var module = await _context.CourseModules.FindAsync(request.ModuleId);
            if (module == null) throw new NotFoundException("Module not found.");

            var lesson = new VideoLesson
            {
                ModuleId = request.ModuleId,
                Title = request.Title,
                VideoUrl = request.VideoUrl,
                VideoPublicId = request.VideoPublicId,
                DurationInSeconds = request.DurationInSeconds,
                Order = request.Order,
                IsPublished = request.IsPublished,
                CreatedAt = DateTime.UtcNow
            };

            _context.VideoLessons.Add(lesson);
            await _context.SaveChangesAsync();

            return MapLessonToDto(lesson);
        }

        public async Task<LessonResponseDto> UpdateLessonAsync(Guid id, UpdateLessonDto request)
        {
            var lesson = await _context.VideoLessons.FindAsync(id);
            if (lesson == null) throw new NotFoundException("Lesson not found.");

            if (request.Title != null) lesson.Title = request.Title;
            if (request.VideoUrl != null) lesson.VideoUrl = request.VideoUrl;
            if (request.VideoPublicId != null) lesson.VideoPublicId = request.VideoPublicId;
            if (request.DurationInSeconds.HasValue) lesson.DurationInSeconds = request.DurationInSeconds.Value;
            if (request.Order.HasValue) lesson.Order = request.Order.Value;
            if (request.IsPublished.HasValue) lesson.IsPublished = request.IsPublished.Value;

            lesson.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapLessonToDto(lesson);
        }

        public async Task<bool> DeleteLessonAsync(Guid id)
        {
            var lesson = await _context.VideoLessons.FindAsync(id);
            if (lesson == null) throw new NotFoundException("Lesson not found.");

            _context.VideoLessons.Remove(lesson);
            await _context.SaveChangesAsync();
            return true;
        }

        // ── Resource Links ────────────────────────────────────────────────────────

        public async Task<bool> AddResourceLinkAsync(CreateResourceLinkDto request)
        {
            var module = await _context.CourseModules.FindAsync(request.ModuleId);
            if (module == null) throw new NotFoundException("Module not found.");

            var resource = new ResourceLink
            {
                ModuleId = request.ModuleId,
                Title = request.Title,
                Url = request.Url,
                Type = request.Type,
                CreatedAt = DateTime.UtcNow
            };

            _context.ResourceLinks.Add(resource);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteResourceLinkAsync(Guid id)
        {
            var resource = await _context.ResourceLinks.FindAsync(id);
            if (resource == null) throw new NotFoundException("Resource link not found.");

            _context.ResourceLinks.Remove(resource);
            await _context.SaveChangesAsync();
            return true;
        }

        // ── Helpers ───────────────────────────────────────────────────────────────

        private static ModuleResponseDto MapModuleToDto(CourseModule m) => new()
        {
            Id = m.Id,
            CourseId = m.CourseId,
            Title = m.Title,
            Description = m.Description,
            Order = m.Order,
            IsPublished = m.IsPublished,
            CreatedAt = m.CreatedAt,
            UpdatedAt = m.UpdatedAt,
            VideoLessons = m.VideoLessons.OrderBy(v => v.Order).Select(v => new DTOs.Module.VideoLessonSummaryDto
            {
                Id = v.Id,
                Title = v.Title,
                Order = v.Order,
                DurationInSeconds = v.DurationInSeconds,
                IsPublished = v.IsPublished
            }).ToList(),
            ResourceLinks = m.ResourceLinks.Select(r => new DTOs.Module.ResourceLinkDto
            {
                Id = r.Id,
                Title = r.Title,
                Url = r.Url,
                Type = r.Type
            }).ToList()
        };

        private static LessonResponseDto MapLessonToDto(VideoLesson v) => new()
        {
            Id = v.Id,
            ModuleId = v.ModuleId,
            Title = v.Title,
            VideoUrl = v.VideoUrl,
            DurationInSeconds = v.DurationInSeconds,
            Order = v.Order,
            IsPublished = v.IsPublished,
            CreatedAt = v.CreatedAt,
            UpdatedAt = v.UpdatedAt
        };
    }
}
