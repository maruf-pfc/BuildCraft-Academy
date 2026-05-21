using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VTCLBD.API.Models
{
    public class CourseModule
    {
        public Guid Id { get; set; }

        [Required]
        public Guid CourseId { get; set; }

        [ForeignKey("CourseId")]
        public Course? Course { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public int Order { get; set; } = 1;

        public bool IsPublished { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public ICollection<VideoLesson> VideoLessons { get; set; } = new List<VideoLesson>();
        public ICollection<ResourceLink> ResourceLinks { get; set; } = new List<ResourceLink>();
    }
}
