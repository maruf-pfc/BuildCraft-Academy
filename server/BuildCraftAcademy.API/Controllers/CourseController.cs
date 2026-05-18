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
        public async Task<IActionResult> GetAllCourses([FromQuery] bool publishedOnly = false)
        {
            var response = await _courseService.GetAllCoursesAsync(publishedOnly);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourseById(Guid id)
        {
            var response = await _courseService.GetCourseByIdAsync(id);
            if (!response.Success)
                return NotFound(response);

            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Invalid payload."));

            var response = await _courseService.CreateCourseAsync(request);
            if (!response.Success)
                return BadRequest(response);

            return CreatedAtAction(nameof(GetCourseById), new { id = response.Data?.Id }, response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(Guid id, [FromBody] UpdateCourseDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Invalid payload."));

            var response = await _courseService.UpdateCourseAsync(id, request);
            if (!response.Success)
                return NotFound(response);

            return Ok(response);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(Guid id)
        {
            var response = await _courseService.DeleteCourseAsync(id);
            if (!response.Success)
                return NotFound(response);

            return Ok(response);
        }
    }
}
