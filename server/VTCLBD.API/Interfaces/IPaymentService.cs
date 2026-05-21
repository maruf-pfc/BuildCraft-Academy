using VTCLBD.API.DTOs.Payment;

namespace VTCLBD.API.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> ProcessDummyPaymentAsync(string userId, InitiatePaymentDto request);
    }
}
