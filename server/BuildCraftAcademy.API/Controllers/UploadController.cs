using BuildCraftAcademy.API.Common;
using BuildCraftAcademy.API.DTOs.Common;
using BuildCraftAcademy.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildCraftAcademy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UploadController : ControllerBase
    {
        private readonly IFileUploadService _fileUploadService;

        public UploadController(IFileUploadService fileUploadService)
        {
            _fileUploadService = fileUploadService;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<FileUploadResponseDto>>> UploadFile(IFormFile file, [FromQuery] string folder = "buildcraft")
        {
            var result = await _fileUploadService.UploadFileAsync(file, folder);
            return Ok(ApiResponse<FileUploadResponseDto>.SuccessResponse(result, "File uploaded successfully."));
        }

        [HttpDelete]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteFile([FromQuery] string publicId, [FromQuery] bool isVideo = false)
        {
            var result = await _fileUploadService.DeleteFileAsync(publicId, isVideo);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "File deleted successfully."));
        }
    }
}
