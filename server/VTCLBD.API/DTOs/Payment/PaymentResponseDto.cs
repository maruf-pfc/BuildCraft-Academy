namespace VTCLBD.API.DTOs.Payment
{
    public class PaymentResponseDto
    {
        public string TransactionId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsEnrolled { get; set; }
    }

    public class PaymentRecordDetailDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string UserFullName { get; set; } = string.Empty;
        public Guid CourseId { get; set; }
        public string CourseTitle { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "BDT";
        public string Status { get; set; } = string.Empty;
        public string? TransactionId { get; set; }
        public string? PaymentMethod { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
