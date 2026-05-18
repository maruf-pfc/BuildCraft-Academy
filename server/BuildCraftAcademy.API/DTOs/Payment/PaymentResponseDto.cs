namespace BuildCraftAcademy.API.DTOs.Payment
{
    public class PaymentResponseDto
    {
        public string TransactionId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsEnrolled { get; set; }
    }
}
