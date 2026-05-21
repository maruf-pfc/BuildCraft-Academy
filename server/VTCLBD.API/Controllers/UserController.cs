using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VTCLBD.API.Common;
using VTCLBD.API.DTOs.User;
using VTCLBD.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VTCLBD.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserDetailDto>>>> GetAllUsers()
        {
            var result = await _userService.GetAllUsersAsync();
            return Ok(ApiResponse<IEnumerable<UserDetailDto>>.SuccessResponse(result));
        }

        [HttpPut("{id}/role")]
        public async Task<ActionResult<ApiResponse<bool>>> UpdateUserRole(string id, [FromBody] UpdateRoleDto dto)
        {
            var result = await _userService.UpdateUserRoleAsync(id, dto.Role);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "User role updated successfully."));
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ApiResponse<bool>>> ToggleUserStatus(string id, [FromBody] UpdateStatusDto dto)
        {
            var result = await _userService.ToggleUserStatusAsync(id, dto.IsActive);
            return Ok(ApiResponse<bool>.SuccessResponse(result, $"User status updated to {(dto.IsActive ? "Active" : "Inactive")}."));
        }

        [HttpPost("{id}/enroll")]
        public async Task<ActionResult<ApiResponse<bool>>> ManuallyEnroll(string id, [FromBody] ManualEnrollDto dto)
        {
            var result = await _userService.ManuallyEnrollUserAsync(id, dto.CourseId);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "User enrolled manually successfully."));
        }

        [HttpPost("{id}/unenroll")]
        public async Task<ActionResult<ApiResponse<bool>>> ManuallyUnenroll(string id, [FromBody] ManualEnrollDto dto)
        {
            var result = await _userService.ManuallyUnenrollUserAsync(id, dto.CourseId);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "User unenrolled manually successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteUser(string id)
        {
            var result = await _userService.DeleteUserAsync(id);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "User deleted successfully."));
        }
    }
}
