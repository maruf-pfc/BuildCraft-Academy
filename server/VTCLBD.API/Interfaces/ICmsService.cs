using VTCLBD.API.DTOs.Cms;

namespace VTCLBD.API.Interfaces
{
    public interface ICmsService
    {
        Task<IEnumerable<ContentBlockResponseDto>> GetAllContentBlocksAsync(bool activeOnly = false);
        Task<ContentBlockResponseDto> GetContentBlockByIdentifierAsync(string identifier);
        Task<ContentBlockResponseDto> CreateContentBlockAsync(CreateContentBlockDto request);
        Task<ContentBlockResponseDto> UpdateContentBlockAsync(string identifier, UpdateContentBlockDto request);
        Task<bool> DeleteContentBlockAsync(string identifier);
    }
}
