using VTCLBD.API.DTOs.Payment;

namespace VTCLBD.API.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResponseDto> RequestEnrollmentAsync(string userId, InitiatePaymentDto request);
        Task<List<PaymentRecordDetailDto>> GetAllPaymentsAsync();
        Task<bool> ApprovePaymentAsync(Guid paymentId);
    }
}
