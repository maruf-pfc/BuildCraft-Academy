using BuildCraftAcademy.API.Common;
using BuildCraftAcademy.API.DTOs.Auth;
using BuildCraftAcademy.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BuildCraftAcademy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Invalid payload."));

            var response = await _authService.RegisterAsync(request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Invalid payload."));

            var response = await _authService.LoginAsync(request);
            if (!response.Success)
                return Unauthorized(response);

            return Ok(response);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Invalid payload."));

            var response = await _authService.ForgotPasswordAsync(request);
            return Ok(response);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<object>.FailureResponse("Invalid payload."));

            var response = await _authService.ResetPasswordAsync(request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
    }
}
