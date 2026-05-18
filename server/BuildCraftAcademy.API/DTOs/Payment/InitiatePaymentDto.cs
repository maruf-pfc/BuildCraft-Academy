using System.ComponentModel.DataAnnotations;

namespace BuildCraftAcademy.API.DTOs.Payment
{
    public class InitiatePaymentDto
    {
        [Required]
        public Guid CourseId { get; set; }
    }
}
