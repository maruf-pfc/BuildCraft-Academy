using System.ComponentModel.DataAnnotations;

namespace BuildCraftAcademy.API.Models
{
    public class ContentBlock
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Identifier { get; set; } = string.Empty; // e.g., "home-hero-title", "about-us-text"

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Type { get; set; } = "Text"; // Text, Html, Json, ImageUrl

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
