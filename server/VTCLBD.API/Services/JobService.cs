using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VTCLBD.API.Common.Exceptions;
using VTCLBD.API.Configs;
using VTCLBD.API.DTOs.Job;
using VTCLBD.API.Interfaces;
using VTCLBD.API.Models;

namespace VTCLBD.API.Services
{
    public class JobService : IJobService
    {
        private readonly AppDbContext _context;

        public JobService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<JobResponseDto>> GetAllJobsAsync(bool publishedOnly = false)
        {
            var query = _context.JobPosts.AsQueryable();

            if (publishedOnly)
            {
                query = query.Where(j => j.IsPublished);
            }

            var jobs = await query.Select(j => new JobResponseDto
            {
                Id = j.Id,
                Title = j.Title,
                Department = j.Department,
                Location = j.Location,
                JobType = j.JobType,
                Description = j.Description,
                Requirements = j.Requirements,
                SalaryRange = j.SalaryRange,
                GoogleFormUrl = j.GoogleFormUrl,
                IsPublished = j.IsPublished,
                CreatedAt = j.CreatedAt
            })
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync();

            return jobs;
        }

        public async Task<JobResponseDto> GetJobByIdAsync(Guid id)
        {
            var j = await _context.JobPosts.FindAsync(id);

            if (j == null)
                throw new NotFoundException("Job post not found.");

            return new JobResponseDto
            {
                Id = j.Id,
                Title = j.Title,
                Department = j.Department,
                Location = j.Location,
                JobType = j.JobType,
                Description = j.Description,
                Requirements = j.Requirements,
                SalaryRange = j.SalaryRange,
                GoogleFormUrl = j.GoogleFormUrl,
                IsPublished = j.IsPublished,
                CreatedAt = j.CreatedAt
            };
        }

        public async Task<JobResponseDto> CreateJobAsync(CreateJobDto request)
        {
            var job = new JobPost
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Department = request.Department,
                Location = request.Location,
                JobType = request.JobType,
                Description = request.Description,
                Requirements = request.Requirements,
                SalaryRange = request.SalaryRange,
                GoogleFormUrl = request.GoogleFormUrl,
                IsPublished = request.IsPublished,
                CreatedAt = DateTime.UtcNow
            };

            _context.JobPosts.Add(job);
            await _context.SaveChangesAsync();

            return new JobResponseDto
            {
                Id = job.Id,
                Title = job.Title,
                Department = job.Department,
                Location = job.Location,
                JobType = job.JobType,
                Description = job.Description,
                Requirements = job.Requirements,
                SalaryRange = job.SalaryRange,
                GoogleFormUrl = job.GoogleFormUrl,
                IsPublished = job.IsPublished,
                CreatedAt = job.CreatedAt
            };
        }

        public async Task<JobResponseDto> UpdateJobAsync(Guid id, UpdateJobDto request)
        {
            var job = await _context.JobPosts.FindAsync(id);

            if (job == null)
                throw new NotFoundException("Job post not found.");

            job.Title = request.Title;
            job.Department = request.Department;
            job.Location = request.Location;
            job.JobType = request.JobType;
            job.Description = request.Description;
            job.Requirements = request.Requirements;
            job.SalaryRange = request.SalaryRange;
            job.GoogleFormUrl = request.GoogleFormUrl;
            job.IsPublished = request.IsPublished;

            _context.JobPosts.Update(job);
            await _context.SaveChangesAsync();

            return new JobResponseDto
            {
                Id = job.Id,
                Title = job.Title,
                Department = job.Department,
                Location = job.Location,
                JobType = job.JobType,
                Description = job.Description,
                Requirements = job.Requirements,
                SalaryRange = job.SalaryRange,
                GoogleFormUrl = job.GoogleFormUrl,
                IsPublished = job.IsPublished,
                CreatedAt = job.CreatedAt
            };
        }

        public async Task<bool> DeleteJobAsync(Guid id)
        {
            var job = await _context.JobPosts.FindAsync(id);

            if (job == null)
                throw new NotFoundException("Job post not found.");

            _context.JobPosts.Remove(job);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
