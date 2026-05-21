using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VTCLBD.API.Models
{
    public class VideoLesson
    {
        public Guid Id { get; set; }

        [Required]
        public Guid ModuleId { get; set; }

        [ForeignKey("ModuleId")]
        public CourseModule? Module { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string VideoUrl { get; set; } = string.Empty;

        public string? VideoPublicId { get; set; }

        public int DurationInSeconds { get; set; } = 0;

        public int Order { get; set; } = 1;

        public bool IsPublished { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
