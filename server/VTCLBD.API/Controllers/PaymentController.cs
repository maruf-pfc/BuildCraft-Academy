using System.Security.Claims;
using VTCLBD.API.Common;
using VTCLBD.API.DTOs.Payment;
using VTCLBD.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VTCLBD.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("enroll-request")]
        public async Task<ActionResult<ApiResponse<PaymentResponseDto>>> RequestEnrollment([FromBody] InitiatePaymentDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(ApiResponse<object>.FailureResponse("User ID not found in token."));

            var result = await _paymentService.RequestEnrollmentAsync(userId, request);
            return Ok(ApiResponse<PaymentResponseDto>.SuccessResponse(result, "Enrollment request submitted successfully."));
        }

        [HttpPost("sslcommerz/initiate")]
        public async Task<ActionResult<ApiResponse<PaymentResponseDto>>> InitiateSSLCommerzPayment([FromBody] InitiateSSLCommerzPaymentDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(ApiResponse<object>.FailureResponse("User ID not found in token."));

            // Construct backend base URL dynamically from current request host
            var backendBaseUrl = $"{Request.Scheme}://{Request.Host}";

            var result = await _paymentService.InitiateSSLCommerzPaymentAsync(userId, request.CourseId, backendBaseUrl);
            return Ok(ApiResponse<PaymentResponseDto>.SuccessResponse(result, "SSLCommerz session initiated."));
        }

        [HttpPost("sslcommerz/callback")]
        [AllowAnonymous]
        [Consumes("application/x-www-form-urlencoded")]
        public async Task<IActionResult> SSLCommerzCallback([FromForm] IFormCollection form, [FromQuery] string status)
        {
            var tranId = form["tran_id"].ToString();
            var valId = form["val_id"].ToString();

            var redirectUrl = await _paymentService.HandleSSLCommerzCallbackAsync(tranId, valId, status);
            return Redirect(redirectUrl);
        }

        [HttpPost("sslcommerz/ipn")]
        [AllowAnonymous]
        [Consumes("application/x-www-form-urlencoded")]
        public async Task<IActionResult> SSLCommerzIPN([FromForm] IFormCollection form)
        {
            var tranId = form["tran_id"].ToString();
            var valId = form["val_id"].ToString();
            var status = form["status"].ToString().ToLower();

            await _paymentService.HandleSSLCommerzCallbackAsync(tranId, valId, status);
            return Ok();
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<List<PaymentRecordDetailDto>>>> GetAllPayments()
        {
            var result = await _paymentService.GetAllPaymentsAsync();
            return Ok(ApiResponse<List<PaymentRecordDetailDto>>.SuccessResponse(result, "Payments retrieved."));
        }

        [HttpPost("approve/{paymentId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<bool>>> ApprovePayment(Guid paymentId)
        {
            var result = await _paymentService.ApprovePaymentAsync(paymentId);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "Payment approved and student enrolled successfully."));
        }
    }
}
