namespace BuildCraftAcademy.API.DTOs.Cms
{
    public class ContentBlockResponseDto
    {
        public Guid Id { get; set; }
        public string Identifier { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
