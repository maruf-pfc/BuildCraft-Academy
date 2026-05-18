using System.Security.Claims;
using BuildCraftAcademy.API.Common;
using BuildCraftAcademy.API.DTOs.Payment;
using BuildCraftAcademy.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildCraftAcademy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Any logged-in user can pay and enroll
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("pay-dummy")]
        public async Task<ActionResult<ApiResponse<PaymentResponseDto>>> ProcessDummyPayment([FromBody] InitiatePaymentDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(ApiResponse<object>.FailureResponse("User ID not found in token."));

            var result = await _paymentService.ProcessDummyPaymentAsync(userId, request);
            return Ok(ApiResponse<PaymentResponseDto>.SuccessResponse(result, "Transaction completed."));
        }
    }
}
