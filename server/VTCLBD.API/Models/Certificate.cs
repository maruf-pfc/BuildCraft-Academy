using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace VTCLBD.API.Models
{
    public class Certificate
    {
        public Guid Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        [ForeignKey("UserId")]
        public ApplicationUser? User { get; set; }

        [Required]
        public Guid CourseId { get; set; }

        [ForeignKey("CourseId")]
        public Course? Course { get; set; }

        [Required]
        public string CertificateNumber { get; set; } = string.Empty; // e.g., CERT-2026-ABCD1234

        public DateTime IssuedAt { get; set; } = DateTime.UtcNow;

        // URL to the generated PDF/image stored on Cloudinary or local path
        public string? CertificateUrl { get; set; }
    }
}
