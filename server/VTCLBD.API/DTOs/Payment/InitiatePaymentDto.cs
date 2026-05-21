using System.ComponentModel.DataAnnotations;

namespace VTCLBD.API.DTOs.Payment
{
    public class InitiatePaymentDto
    {
        [Required]
        public Guid CourseId { get; set; }
    }
}
