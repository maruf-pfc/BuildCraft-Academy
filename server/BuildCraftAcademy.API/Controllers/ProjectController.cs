using BuildCraftAcademy.API.Common;
using BuildCraftAcademy.API.DTOs.Project;
using BuildCraftAcademy.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildCraftAcademy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<ProjectResponseDto>>>> GetAllProjects([FromQuery] bool publishedOnly = false)
        {
            var result = await _projectService.GetAllProjectsAsync(publishedOnly);
            return Ok(ApiResponse<IEnumerable<ProjectResponseDto>>.SuccessResponse(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProjectResponseDto>>> GetProjectById(Guid id)
        {
            var result = await _projectService.GetProjectByIdAsync(id);
            return Ok(ApiResponse<ProjectResponseDto>.SuccessResponse(result));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<ProjectResponseDto>>> CreateProject([FromBody] CreateProjectDto request)
        {
            var result = await _projectService.CreateProjectAsync(request);
            var response = ApiResponse<ProjectResponseDto>.SuccessResponse(result, "Project created successfully.");
            return CreatedAtAction(nameof(GetProjectById), new { id = result.Id }, response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<ProjectResponseDto>>> UpdateProject(Guid id, [FromBody] UpdateProjectDto request)
        {
            var result = await _projectService.UpdateProjectAsync(id, request);
            return Ok(ApiResponse<ProjectResponseDto>.SuccessResponse(result, "Project updated successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteProject(Guid id)
        {
            var result = await _projectService.DeleteProjectAsync(id);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "Project deleted successfully."));
        }
    }
}
