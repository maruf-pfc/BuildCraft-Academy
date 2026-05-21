using System.Security.Claims;
using VTCLBD.API.Common;
using VTCLBD.API.DTOs.Progress;
using VTCLBD.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VTCLBD.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProgressController : ControllerBase
    {
        private readonly IProgressService _progressService;

        public ProgressController(IProgressService progressService)
        {
            _progressService = progressService;
        }

        [HttpPost("mark-complete")]
        public async Task<ActionResult<ApiResponse<LessonProgressResponseDto>>> MarkLessonComplete([FromBody] MarkLessonCompleteDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var result = await _progressService.MarkLessonCompleteAsync(userId, request);
            return Ok(ApiResponse<LessonProgressResponseDto>.SuccessResponse(result, "Lesson marked as complete."));
        }

        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<ApiResponse<CourseProgressResponseDto>>> GetCourseProgress(Guid courseId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var result = await _progressService.GetCourseProgressAsync(userId, courseId);
            return Ok(ApiResponse<CourseProgressResponseDto>.SuccessResponse(result));
        }

        [HttpGet("certificate/{courseId}")]
        public async Task<ActionResult<ApiResponse<CertificateResponseDto?>>> GetCertificate(Guid courseId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var result = await _progressService.GetCertificateAsync(userId, courseId);

            if (result == null)
                return Ok(ApiResponse<CertificateResponseDto?>.FailureResponse(
                    "Certificate not yet issued. Complete all modules to earn your certificate."));

            return Ok(ApiResponse<CertificateResponseDto?>.SuccessResponse(result, "Certificate retrieved successfully."));
        }
    }
}
