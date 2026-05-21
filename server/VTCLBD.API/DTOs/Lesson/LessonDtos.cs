using System.ComponentModel.DataAnnotations;
using VTCLBD.API.DTOs.Module;

namespace VTCLBD.API.DTOs.Lesson
{
    public class CreateLessonDto
    {
        [Required]
        public Guid ModuleId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string VideoUrl { get; set; } = string.Empty;

        public string? VideoPublicId { get; set; }
        public int DurationInSeconds { get; set; } = 0;
        public int Order { get; set; } = 1;
        public bool IsPublished { get; set; } = true;
    }

    public class UpdateLessonDto
    {
        public string? Title { get; set; }
        public string? VideoUrl { get; set; }
        public string? VideoPublicId { get; set; }
        public int? DurationInSeconds { get; set; }
        public int? Order { get; set; }
        public bool? IsPublished { get; set; }
    }

    public class LessonResponseDto
    {
        public Guid Id { get; set; }
        public Guid ModuleId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string VideoUrl { get; set; } = string.Empty;
        public int DurationInSeconds { get; set; }
        public int Order { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateResourceLinkDto
    {
        [Required]
        public Guid ModuleId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Url { get; set; } = string.Empty;

        public string Type { get; set; } = "Link";
    }
}
