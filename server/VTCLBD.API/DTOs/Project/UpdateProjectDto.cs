namespace VTCLBD.API.DTOs.Project
{
    public class UpdateProjectDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public string? ImagePublicId { get; set; }
        public string? Category { get; set; }
        public string? ClientName { get; set; }
        public string? Location { get; set; }
        public DateTime? CompletionDate { get; set; }
        public string? Status { get; set; }
        public string? VideoUrl { get; set; }
        public string? ClientReview { get; set; }
        public string? ClientReviewerName { get; set; }
        public string? SecondaryImages { get; set; }
        public bool? IsPublished { get; set; }
    }
}
