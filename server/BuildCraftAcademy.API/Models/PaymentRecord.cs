using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BuildCraftAcademy.API.Models
{
    public class PaymentRecord
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

        public decimal Amount { get; set; }
        public string Currency { get; set; } = "BDT";
        
        public string Status { get; set; } = "Pending"; // Pending, Success, Failed
        public string? TransactionId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
