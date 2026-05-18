using BuildCraftAcademy.API.Common.Exceptions;
using BuildCraftAcademy.API.Configs;
using BuildCraftAcademy.API.DTOs.Common;
using BuildCraftAcademy.API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace BuildCraftAcademy.API.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly Cloudinary _cloudinary;

        public FileUploadService(IOptions<CloudinarySettings> config)
        {
            var acc = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        public async Task<FileUploadResponseDto> UploadFileAsync(IFormFile file, string folder = "buildcraft")
        {
            if (file == null || file.Length == 0)
                throw new ApiException("No file provided.", 400);

            var isVideo = file.ContentType.StartsWith("video/");
            var uploadResult = new RawUploadResult();

            using var stream = file.OpenReadStream();
            
            if (isVideo)
            {
                var uploadParams = new VideoUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = folder,
                    Transformation = new Transformation().Quality("auto")
                };
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }
            else
            {
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = folder,
                    Transformation = new Transformation().Quality("auto").FetchFormat("auto")
                };
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }

            if (uploadResult.Error != null)
                throw new ApiException(uploadResult.Error.Message, 500);

            return new FileUploadResponseDto
            {
                Url = uploadResult.SecureUrl.ToString(),
                PublicId = uploadResult.PublicId,
                Format = uploadResult.Format
            };
        }

        public async Task<bool> DeleteFileAsync(string publicId, bool isVideo = false)
        {
            var deleteParams = new DeletionParams(publicId)
            {
                ResourceType = isVideo ? ResourceType.Video : ResourceType.Image
            };

            var result = await _cloudinary.DestroyAsync(deleteParams);

            if (result.Error != null)
                throw new ApiException(result.Error.Message, 500);

            return result.Result == "ok";
        }
    }
}
