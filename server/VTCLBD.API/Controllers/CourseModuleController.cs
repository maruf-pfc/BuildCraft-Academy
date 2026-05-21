using VTCLBD.API.Common;
using VTCLBD.API.DTOs.Lesson;
using VTCLBD.API.DTOs.Module;
using VTCLBD.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VTCLBD.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseModuleController : ControllerBase
    {
        private readonly ICourseModuleService _moduleService;

        public CourseModuleController(ICourseModuleService moduleService)
        {
            _moduleService = moduleService;
        }

        // ── Modules ──────────────────────────────────────────────────────────────

        [HttpGet("by-course/{courseId}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ModuleResponseDto>>>> GetModulesByCourse(Guid courseId)
        {
            var result = await _moduleService.GetModulesByCourseAsync(courseId);
            return Ok(ApiResponse<IEnumerable<ModuleResponseDto>>.SuccessResponse(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ModuleResponseDto>>> GetModuleById(Guid id)
        {
            var result = await _moduleService.GetModuleByIdAsync(id);
            return Ok(ApiResponse<ModuleResponseDto>.SuccessResponse(result));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<ModuleResponseDto>>> CreateModule([FromBody] CreateModuleDto request)
        {
            var result = await _moduleService.CreateModuleAsync(request);
            var response = ApiResponse<ModuleResponseDto>.SuccessResponse(result, "Module created successfully.");
            return CreatedAtAction(nameof(GetModuleById), new { id = result.Id }, response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<ModuleResponseDto>>> UpdateModule(Guid id, [FromBody] UpdateModuleDto request)
        {
            var result = await _moduleService.UpdateModuleAsync(id, request);
            return Ok(ApiResponse<ModuleResponseDto>.SuccessResponse(result, "Module updated successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteModule(Guid id)
        {
            var result = await _moduleService.DeleteModuleAsync(id);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "Module deleted successfully."));
        }

        // ── Lessons ──────────────────────────────────────────────────────────────

        [Authorize(Roles = "Admin")]
        [HttpPost("lessons")]
        public async Task<ActionResult<ApiResponse<LessonResponseDto>>> AddLesson([FromBody] CreateLessonDto request)
        {
            var result = await _moduleService.AddLessonAsync(request);
            return Ok(ApiResponse<LessonResponseDto>.SuccessResponse(result, "Lesson added successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("lessons/{id}")]
        public async Task<ActionResult<ApiResponse<LessonResponseDto>>> UpdateLesson(Guid id, [FromBody] UpdateLessonDto request)
        {
            var result = await _moduleService.UpdateLessonAsync(id, request);
            return Ok(ApiResponse<LessonResponseDto>.SuccessResponse(result, "Lesson updated successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("lessons/{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteLesson(Guid id)
        {
            var result = await _moduleService.DeleteLessonAsync(id);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "Lesson deleted successfully."));
        }

        // ── Resources ─────────────────────────────────────────────────────────────

        [Authorize(Roles = "Admin")]
        [HttpPost("resources")]
        public async Task<ActionResult<ApiResponse<bool>>> AddResourceLink([FromBody] CreateResourceLinkDto request)
        {
            var result = await _moduleService.AddResourceLinkAsync(request);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "Resource link added successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("resources/{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteResourceLink(Guid id)
        {
            var result = await _moduleService.DeleteResourceLinkAsync(id);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "Resource link deleted successfully."));
        }
    }
}
