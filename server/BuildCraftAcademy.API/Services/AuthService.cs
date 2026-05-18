using BuildCraftAcademy.API.Common;
using BuildCraftAcademy.API.DTOs.Auth;
using BuildCraftAcademy.API.Helpers;
using BuildCraftAcademy.API.Interfaces;
using BuildCraftAcademy.API.Models;
using Microsoft.AspNetCore.Identity;

namespace BuildCraftAcademy.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly JwtHelper _jwtHelper;
        private readonly ILogger<AuthService> _logger;

        public AuthService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, JwtHelper jwtHelper, ILogger<AuthService> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtHelper = jwtHelper;
            _logger = logger;
        }

        public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterRequestDto request)
        {
            var userExists = await _userManager.FindByEmailAsync(request.Email);
            if (userExists != null)
                return ApiResponse<AuthResponseDto>.FailureResponse("User already exists.");

            var user = new ApplicationUser
            {
                Email = request.Email,
                UserName = request.Email,
                FullName = request.FullName,
                Role = "User"
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return ApiResponse<AuthResponseDto>.FailureResponse("User creation failed.", result.Errors.Select(e => e.Description));

            if (!await _roleManager.RoleExistsAsync("User"))
                await _roleManager.CreateAsync(new IdentityRole("User"));

            await _userManager.AddToRoleAsync(user, "User");

            var token = _jwtHelper.GenerateToken(user, "User");

            return ApiResponse<AuthResponseDto>.SuccessResponse(new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                FullName = user.FullName,
                Role = "User"
            }, "User registered successfully.");
        }

        public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginRequestDto request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
                return ApiResponse<AuthResponseDto>.FailureResponse("Invalid email or password.");

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "User";

            var token = _jwtHelper.GenerateToken(user, role);

            return ApiResponse<AuthResponseDto>.SuccessResponse(new AuthResponseDto
            {
                Token = token,
                Email = user.Email!,
                FullName = user.FullName,
                Role = role
            }, "Logged in successfully.");
        }

        public async Task<ApiResponse<string>> ForgotPasswordAsync(ForgotPasswordRequestDto request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                // To prevent email enumeration, return success even if user not found.
                return ApiResponse<string>.SuccessResponse(string.Empty, "If your email is registered, you will receive a reset link.");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            
            // TODO: In a real scenario, send this token via email using an EmailService.
            _logger.LogInformation("Password reset token for {Email}: {Token}", request.Email, token);

            return ApiResponse<string>.SuccessResponse(token, "If your email is registered, you will receive a reset link.");
        }

        public async Task<ApiResponse<string>> ResetPasswordAsync(ResetPasswordRequestDto request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
                return ApiResponse<string>.FailureResponse("Invalid email or token.");

            var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
            if (!result.Succeeded)
                return ApiResponse<string>.FailureResponse("Password reset failed.", result.Errors.Select(e => e.Description));

            return ApiResponse<string>.SuccessResponse(string.Empty, "Password has been reset successfully.");
        }
    }
}
