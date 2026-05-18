using BuildCraftAcademy.API.Common;
using BuildCraftAcademy.API.DTOs.Auth;

namespace BuildCraftAcademy.API.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterRequestDto request);
        Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginRequestDto request);
        Task<ApiResponse<string>> ForgotPasswordAsync(ForgotPasswordRequestDto request);
        Task<ApiResponse<string>> ResetPasswordAsync(ResetPasswordRequestDto request);
    }
}
