using BuildCraftAcademy.API.DTOs.Payment;

namespace BuildCraftAcademy.API.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> ProcessDummyPaymentAsync(string userId, InitiatePaymentDto request);
    }
}
