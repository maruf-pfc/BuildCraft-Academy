using VTCLBD.API.Common.Exceptions;
using VTCLBD.API.Configs;
using VTCLBD.API.DTOs.Project;
using VTCLBD.API.Interfaces;
using VTCLBD.API.Models;
using Microsoft.EntityFrameworkCore;

namespace VTCLBD.API.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _context;

        public ProjectService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjectResponseDto>> GetAllProjectsAsync(bool publishedOnly = false)
        {
            var query = _context.Projects.AsQueryable();

            if (publishedOnly)
            {
                query = query.Where(p => p.IsPublished);
            }

            var projects = await query.Select(p => new ProjectResponseDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                ImageUrl = p.ImageUrl,
                Category = p.Category,
                ClientName = p.ClientName,
                Location = p.Location,
                CompletionDate = p.CompletionDate,
                Status = p.Status,
                VideoUrl = p.VideoUrl,
                ClientReview = p.ClientReview,
                ClientReviewerName = p.ClientReviewerName,
                SecondaryImages = p.SecondaryImages,
                IsPublished = p.IsPublished,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            }).ToListAsync();

            return projects;
        }

        public async Task<ProjectResponseDto> GetProjectByIdAsync(Guid id)
        {
            var p = await _context.Projects.FindAsync(id);

            if (p == null)
                throw new NotFoundException("Project not found.");

            return new ProjectResponseDto
            {
                Id = p.Id,
                Title = p.Title,
                Description = p.Description,
                ImageUrl = p.ImageUrl,
                Category = p.Category,
                ClientName = p.ClientName,
                Location = p.Location,
                CompletionDate = p.CompletionDate,
                Status = p.Status,
                VideoUrl = p.VideoUrl,
                ClientReview = p.ClientReview,
                ClientReviewerName = p.ClientReviewerName,
                SecondaryImages = p.SecondaryImages,
                IsPublished = p.IsPublished,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            };
        }

        public async Task<ProjectResponseDto> CreateProjectAsync(CreateProjectDto request)
        {
            var project = new Project
            {
                Title = request.Title,
                Description = request.Description,
                ImageUrl = request.ImageUrl,
                ImagePublicId = request.ImagePublicId,
                Category = request.Category,
                ClientName = request.ClientName,
                Location = request.Location,
                CompletionDate = request.CompletionDate,
                Status = request.Status,
                VideoUrl = request.VideoUrl,
                ClientReview = request.ClientReview,
                ClientReviewerName = request.ClientReviewerName,
                SecondaryImages = request.SecondaryImages,
                IsPublished = request.IsPublished,
                CreatedAt = DateTime.UtcNow
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return new ProjectResponseDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                ImageUrl = project.ImageUrl,
                Category = project.Category,
                ClientName = project.ClientName,
                Location = project.Location,
                CompletionDate = project.CompletionDate,
                Status = project.Status,
                VideoUrl = project.VideoUrl,
                ClientReview = project.ClientReview,
                ClientReviewerName = project.ClientReviewerName,
                SecondaryImages = project.SecondaryImages,
                IsPublished = project.IsPublished,
                CreatedAt = project.CreatedAt
            };
        }

        public async Task<ProjectResponseDto> UpdateProjectAsync(Guid id, UpdateProjectDto request)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
                throw new NotFoundException("Project not found.");

            if (request.Title != null) project.Title = request.Title;
            if (request.Description != null) project.Description = request.Description;
            if (request.ImageUrl != null) project.ImageUrl = request.ImageUrl;
            if (request.ImagePublicId != null) project.ImagePublicId = request.ImagePublicId;
            if (request.Category != null) project.Category = request.Category;
            if (request.ClientName != null) project.ClientName = request.ClientName;
            if (request.Location != null) project.Location = request.Location;
            if (request.CompletionDate.HasValue) project.CompletionDate = request.CompletionDate;
            if (request.Status != null) project.Status = request.Status;
            if (request.VideoUrl != null) project.VideoUrl = request.VideoUrl;
            if (request.ClientReview != null) project.ClientReview = request.ClientReview;
            if (request.ClientReviewerName != null) project.ClientReviewerName = request.ClientReviewerName;
            if (request.SecondaryImages != null) project.SecondaryImages = request.SecondaryImages;
            if (request.IsPublished.HasValue) project.IsPublished = request.IsPublished.Value;

            project.UpdatedAt = DateTime.UtcNow;

            _context.Projects.Update(project);
            await _context.SaveChangesAsync();

            return new ProjectResponseDto
            {
                Id = project.Id,
                Title = project.Title,
                Description = project.Description,
                ImageUrl = project.ImageUrl,
                Category = project.Category,
                ClientName = project.ClientName,
                Location = project.Location,
                CompletionDate = project.CompletionDate,
                Status = project.Status,
                VideoUrl = project.VideoUrl,
                ClientReview = project.ClientReview,
                ClientReviewerName = project.ClientReviewerName,
                SecondaryImages = project.SecondaryImages,
                IsPublished = project.IsPublished,
                CreatedAt = project.CreatedAt,
                UpdatedAt = project.UpdatedAt
            };
        }

        public async Task<bool> DeleteProjectAsync(Guid id)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
                throw new NotFoundException("Project not found.");

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
