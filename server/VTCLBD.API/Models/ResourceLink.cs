using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VTCLBD.API.Models
{
    public class ResourceLink
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
        public string Url { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Type { get; set; } = "Link"; // Link, PDF, Doc, etc.

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
