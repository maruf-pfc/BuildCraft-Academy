using System.ComponentModel.DataAnnotations;

namespace VTCLBD.API.DTOs.Module
{
    public class CreateModuleDto
    {
        [Required]
        public Guid CourseId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }
        public int Order { get; set; } = 1;
        public bool IsPublished { get; set; } = true;
    }

    public class UpdateModuleDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? Order { get; set; }
        public bool? IsPublished { get; set; }
    }

    public class ResourceLinkDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }

    public class VideoLessonSummaryDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public int Order { get; set; }
        public int DurationInSeconds { get; set; }
        public bool IsPublished { get; set; }
    }

    public class ModuleResponseDto
    {
        public Guid Id { get; set; }
        public Guid CourseId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Order { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<VideoLessonSummaryDto> VideoLessons { get; set; } = new();
        public List<ResourceLinkDto> ResourceLinks { get; set; } = new();
    }
}
