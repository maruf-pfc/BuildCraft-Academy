using VTCLBD.API.Common.Exceptions;
using VTCLBD.API.Configs;
using VTCLBD.API.DTOs.Cms;
using VTCLBD.API.Interfaces;
using VTCLBD.API.Models;
using Microsoft.EntityFrameworkCore;

namespace VTCLBD.API.Services
{
    public class CmsService : ICmsService
    {
        private readonly AppDbContext _context;

        public CmsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ContentBlockResponseDto>> GetAllContentBlocksAsync(bool activeOnly = false)
        {
            var query = _context.ContentBlocks.AsQueryable();

            if (activeOnly)
            {
                query = query.Where(c => c.IsActive);
            }

            return await query.Select(c => new ContentBlockResponseDto
            {
                Id = c.Id,
                Identifier = c.Identifier,
                Content = c.Content,
                Type = c.Type,
                IsActive = c.IsActive,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            }).ToListAsync();
        }

        public async Task<ContentBlockResponseDto> GetContentBlockByIdentifierAsync(string identifier)
        {
            var block = await _context.ContentBlocks.FirstOrDefaultAsync(c => c.Identifier == identifier);

            if (block == null)
                throw new NotFoundException($"Content block with identifier '{identifier}' not found.");

            return new ContentBlockResponseDto
            {
                Id = block.Id,
                Identifier = block.Identifier,
                Content = block.Content,
                Type = block.Type,
                IsActive = block.IsActive,
                CreatedAt = block.CreatedAt,
                UpdatedAt = block.UpdatedAt
            };
        }

        public async Task<ContentBlockResponseDto> CreateContentBlockAsync(CreateContentBlockDto request)
        {
            var existing = await _context.ContentBlocks.FirstOrDefaultAsync(c => c.Identifier == request.Identifier);
            if (existing != null)
                throw new ApiException($"Content block with identifier '{request.Identifier}' already exists.", 400);

            var block = new ContentBlock
            {
                Identifier = request.Identifier,
                Content = request.Content,
                Type = request.Type,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.ContentBlocks.Add(block);
            await _context.SaveChangesAsync();

            return new ContentBlockResponseDto
            {
                Id = block.Id,
                Identifier = block.Identifier,
                Content = block.Content,
                Type = block.Type,
                IsActive = block.IsActive,
                CreatedAt = block.CreatedAt
            };
        }

        public async Task<ContentBlockResponseDto> UpdateContentBlockAsync(string identifier, UpdateContentBlockDto request)
        {
            var block = await _context.ContentBlocks.FirstOrDefaultAsync(c => c.Identifier == identifier);

            if (block == null)
                throw new NotFoundException($"Content block with identifier '{identifier}' not found.");

            if (request.Content != null) block.Content = request.Content;
            if (request.Type != null) block.Type = request.Type;
            if (request.IsActive.HasValue) block.IsActive = request.IsActive.Value;

            block.UpdatedAt = DateTime.UtcNow;

            _context.ContentBlocks.Update(block);
            await _context.SaveChangesAsync();

            return new ContentBlockResponseDto
            {
                Id = block.Id,
                Identifier = block.Identifier,
                Content = block.Content,
                Type = block.Type,
                IsActive = block.IsActive,
                CreatedAt = block.CreatedAt,
                UpdatedAt = block.UpdatedAt
            };
        }

        public async Task<bool> DeleteContentBlockAsync(string identifier)
        {
            var block = await _context.ContentBlocks.FirstOrDefaultAsync(c => c.Identifier == identifier);

            if (block == null)
                throw new NotFoundException($"Content block with identifier '{identifier}' not found.");

            _context.ContentBlocks.Remove(block);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
