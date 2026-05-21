using Microsoft.AspNetCore.Identity;

namespace VTCLBD.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public string? ProfilePictureUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // This role property helps in easy tracking or mapping, though Identity handles roles via UserRoles.
        public string Role { get; set; } = "User";
    }
}
