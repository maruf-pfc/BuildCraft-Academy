using BuildCraftAcademy.API.Common.Exceptions;
using BuildCraftAcademy.API.Configs;
using BuildCraftAcademy.API.DTOs.Course;
using BuildCraftAcademy.API.Interfaces;
using BuildCraftAcademy.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BuildCraftAcademy.API.Services
{
    public class CourseService : ICourseService
    {
        private readonly AppDbContext _context;

        public CourseService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CourseResponseDto>> GetAllCoursesAsync(bool publishedOnly = false)
        {
            var query = _context.Courses.AsQueryable();

            if (publishedOnly)
            {
                query = query.Where(c => c.IsPublished);
            }

            var courses = await query.Select(c => new CourseResponseDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                Price = c.Price,
                VideoUrl = c.VideoUrl,
                InstructorName = c.InstructorName,
                IsPublished = c.IsPublished,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            }).ToListAsync();

            return courses;
        }

        public async Task<CourseResponseDto> GetCourseByIdAsync(Guid id)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
                throw new NotFoundException("Course not found.");

            return new CourseResponseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Price = course.Price,
                VideoUrl = course.VideoUrl,
                InstructorName = course.InstructorName,
                IsPublished = course.IsPublished,
                CreatedAt = course.CreatedAt,
                UpdatedAt = course.UpdatedAt
            };
        }

        public async Task<CourseResponseDto> CreateCourseAsync(CreateCourseDto request)
        {
            var course = new Course
            {
                Title = request.Title,
                Description = request.Description,
                Price = request.Price,
                VideoUrl = request.VideoUrl,
                VideoPublicId = request.VideoPublicId,
                InstructorName = request.InstructorName,
                IsPublished = request.IsPublished,
                CreatedAt = DateTime.UtcNow
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return new CourseResponseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Price = course.Price,
                VideoUrl = course.VideoUrl,
                InstructorName = course.InstructorName,
                IsPublished = course.IsPublished,
                CreatedAt = course.CreatedAt
            };
        }

        public async Task<CourseResponseDto> UpdateCourseAsync(Guid id, UpdateCourseDto request)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
                throw new NotFoundException("Course not found.");

            if (request.Title != null) course.Title = request.Title;
            if (request.Description != null) course.Description = request.Description;
            if (request.Price.HasValue) course.Price = request.Price.Value;
            if (request.VideoUrl != null) course.VideoUrl = request.VideoUrl;
            if (request.VideoPublicId != null) course.VideoPublicId = request.VideoPublicId;
            if (request.InstructorName != null) course.InstructorName = request.InstructorName;
            if (request.IsPublished.HasValue) course.IsPublished = request.IsPublished.Value;

            course.UpdatedAt = DateTime.UtcNow;

            _context.Courses.Update(course);
            await _context.SaveChangesAsync();

            return new CourseResponseDto
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                Price = course.Price,
                VideoUrl = course.VideoUrl,
                InstructorName = course.InstructorName,
                IsPublished = course.IsPublished,
                CreatedAt = course.CreatedAt,
                UpdatedAt = course.UpdatedAt
            };
        }

        public async Task<bool> DeleteCourseAsync(Guid id)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
                throw new NotFoundException("Course not found.");

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
