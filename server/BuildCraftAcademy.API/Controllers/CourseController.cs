using BuildCraftAcademy.API.Common;
using BuildCraftAcademy.API.DTOs.Course;
using BuildCraftAcademy.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildCraftAcademy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<CourseResponseDto>>>> GetAllCourses([FromQuery] bool publishedOnly = false)
        {
            var result = await _courseService.GetAllCoursesAsync(publishedOnly);
            return Ok(ApiResponse<IEnumerable<CourseResponseDto>>.SuccessResponse(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CourseResponseDto>>> GetCourseById(Guid id)
        {
            var result = await _courseService.GetCourseByIdAsync(id);
            return Ok(ApiResponse<CourseResponseDto>.SuccessResponse(result));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<CourseResponseDto>>> CreateCourse([FromBody] CreateCourseDto request)
        {
            var result = await _courseService.CreateCourseAsync(request);
            var response = ApiResponse<CourseResponseDto>.SuccessResponse(result, "Course created successfully.");
            return CreatedAtAction(nameof(GetCourseById), new { id = result.Id }, response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<CourseResponseDto>>> UpdateCourse(Guid id, [FromBody] UpdateCourseDto request)
        {
            var result = await _courseService.UpdateCourseAsync(id, request);
            return Ok(ApiResponse<CourseResponseDto>.SuccessResponse(result, "Course updated successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteCourse(Guid id)
        {
            var result = await _courseService.DeleteCourseAsync(id);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "Course deleted successfully."));
        }
    }
}
