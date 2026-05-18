using BuildCraftAcademy.API.Common;
using BuildCraftAcademy.API.DTOs.Cms;
using BuildCraftAcademy.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildCraftAcademy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CmsController : ControllerBase
    {
        private readonly ICmsService _cmsService;

        public CmsController(ICmsService cmsService)
        {
            _cmsService = cmsService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<ContentBlockResponseDto>>>> GetAll([FromQuery] bool activeOnly = true)
        {
            var result = await _cmsService.GetAllContentBlocksAsync(activeOnly);
            return Ok(ApiResponse<IEnumerable<ContentBlockResponseDto>>.SuccessResponse(result));
        }

        [HttpGet("{identifier}")]
        public async Task<ActionResult<ApiResponse<ContentBlockResponseDto>>> GetByIdentifier(string identifier)
        {
            var result = await _cmsService.GetContentBlockByIdentifierAsync(identifier);
            return Ok(ApiResponse<ContentBlockResponseDto>.SuccessResponse(result));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ApiResponse<ContentBlockResponseDto>>> Create([FromBody] CreateContentBlockDto request)
        {
            var result = await _cmsService.CreateContentBlockAsync(request);
            var response = ApiResponse<ContentBlockResponseDto>.SuccessResponse(result, "Content block created successfully.");
            return CreatedAtAction(nameof(GetByIdentifier), new { identifier = result.Identifier }, response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{identifier}")]
        public async Task<ActionResult<ApiResponse<ContentBlockResponseDto>>> Update(string identifier, [FromBody] UpdateContentBlockDto request)
        {
            var result = await _cmsService.UpdateContentBlockAsync(identifier, request);
            return Ok(ApiResponse<ContentBlockResponseDto>.SuccessResponse(result, "Content block updated successfully."));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{identifier}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(string identifier)
        {
            var result = await _cmsService.DeleteContentBlockAsync(identifier);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "Content block deleted successfully."));
        }
    }
}
