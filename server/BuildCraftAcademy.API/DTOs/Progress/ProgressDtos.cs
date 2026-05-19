namespace BuildCraftAcademy.API.DTOs.Progress
{
    public class MarkLessonCompleteDto
    {
        public Guid LessonId { get; set; }
    }

    public class LessonProgressResponseDto
    {
        public Guid LessonId { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

    public class ModuleProgressDto
    {
        public Guid ModuleId { get; set; }
        public string ModuleTitle { get; set; } = string.Empty;
        public int TotalLessons { get; set; }
        public int CompletedLessons { get; set; }
        public bool IsModuleCompleted { get; set; }
    }

    public class CourseProgressResponseDto
    {
        public Guid CourseId { get; set; }
        public string CourseTitle { get; set; } = string.Empty;
        public int TotalLessons { get; set; }
        public int CompletedLessons { get; set; }
        public double ProgressPercentage { get; set; }
        public bool IsCourseCompleted { get; set; }
        public List<Guid> CompletedLessonIds { get; set; } = new();
        public List<ModuleProgressDto> Modules { get; set; } = new();
    }

    public class CertificateResponseDto
    {
        public Guid Id { get; set; }
        public string CertificateNumber { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string CourseTitle { get; set; } = string.Empty;
        public DateTime IssuedAt { get; set; }
        public string? CertificateUrl { get; set; }
    }
}
