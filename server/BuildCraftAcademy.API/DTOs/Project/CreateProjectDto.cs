using System.ComponentModel.DataAnnotations;

namespace BuildCraftAcademy.API.DTOs.Project
{
    public class CreateProjectDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }
        public string? ImagePublicId { get; set; }

        public string? Category { get; set; }
        public string? ClientName { get; set; }
        public string? Location { get; set; }
        public DateTime? CompletionDate { get; set; }
        
        public bool IsPublished { get; set; } = true;
    }
}
