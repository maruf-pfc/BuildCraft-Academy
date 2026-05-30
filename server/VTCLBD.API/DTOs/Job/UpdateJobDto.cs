using System.ComponentModel.DataAnnotations;

namespace VTCLBD.API.DTOs.Job
{
    public class UpdateJobDto
    {
        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Department { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Location { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string JobType { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Requirements { get; set; } = string.Empty;

        [MaxLength(100)]
        public string SalaryRange { get; set; } = "Negotiable";

        [Required]
        [Url]
        public string GoogleFormUrl { get; set; } = string.Empty;

        public bool IsPublished { get; set; } = true;
    }
}
