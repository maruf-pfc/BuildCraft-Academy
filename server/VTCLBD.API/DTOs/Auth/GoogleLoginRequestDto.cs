namespace VTCLBD.API.DTOs.Auth
{
    public class GoogleLoginRequestDto
    {
        public required string Email { get; set; }
        public required string FullName { get; set; }
        public required string IdToken { get; set; }
    }
}
