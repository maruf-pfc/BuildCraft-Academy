using System.ComponentModel.DataAnnotations;

namespace VTCLBD.API.DTOs.Payment
{
    public class InitiatePaymentDto
    {
        [Required]
        public Guid CourseId { get; set; }

        [Required]
        public string PaymentMethod { get; set; } = string.Empty;

        [Required]
        public string TransactionId { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        public decimal Amount { get; set; }
    }
}
