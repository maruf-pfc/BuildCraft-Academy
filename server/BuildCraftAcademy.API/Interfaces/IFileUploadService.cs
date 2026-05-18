using BuildCraftAcademy.API.DTOs.Common;

namespace BuildCraftAcademy.API.Interfaces
{
    public interface IFileUploadService
    {
        Task<FileUploadResponseDto> UploadFileAsync(IFormFile file, string folder = "buildcraft");
        Task<bool> DeleteFileAsync(string publicId, bool isVideo = false);
    }
}
