using System;

namespace VTCLBD.API.DTOs.Job
{
    public class JobResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Requirements { get; set; } = string.Empty;
        public string SalaryRange { get; set; } = string.Empty;
        public string GoogleFormUrl { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
