using System.ComponentModel.DataAnnotations;

namespace VTCLBD.API.DTOs.Payment
{
    public class InitiateSSLCommerzPaymentDto
    {
        [Required]
        public Guid CourseId { get; set; }
    }
}
