using System.ComponentModel.DataAnnotations;

namespace VTCLBD.API.DTOs.Course
{
    public class CreateCourseDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string? VideoUrl { get; set; }
        public string? VideoPublicId { get; set; }

        public string? InstructorName { get; set; }
        public bool IsPublished { get; set; } = true;
    }
}
