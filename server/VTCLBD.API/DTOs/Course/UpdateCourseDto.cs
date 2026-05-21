namespace VTCLBD.API.DTOs.Course
{
    public class UpdateCourseDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public string? VideoUrl { get; set; }
        public string? VideoPublicId { get; set; }
        public string? InstructorName { get; set; }
        public bool? IsPublished { get; set; }
    }
}
