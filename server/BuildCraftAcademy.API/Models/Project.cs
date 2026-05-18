using System.ComponentModel.DataAnnotations;

namespace BuildCraftAcademy.API.Models
{
    public class Project
    {
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }
        public string? ImagePublicId { get; set; }

        public string? Category { get; set; } // e.g., Consultancy, Interior Design, Construction
        
        public string? ClientName { get; set; }
        public string? Location { get; set; }
        public DateTime? CompletionDate { get; set; }

        public bool IsPublished { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
