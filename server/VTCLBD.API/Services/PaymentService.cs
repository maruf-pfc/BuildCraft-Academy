using VTCLBD.API.Common.Exceptions;
using VTCLBD.API.Configs;
using VTCLBD.API.DTOs.Payment;
using VTCLBD.API.Interfaces;
using VTCLBD.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Net.Http;

namespace VTCLBD.API.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;

        public PaymentService(
            AppDbContext context, 
            UserManager<ApplicationUser> userManager,
            IConfiguration configuration,
            IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _userManager = userManager;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<PaymentResponseDto> RequestEnrollmentAsync(string userId, InitiatePaymentDto request)
        {
            var course = await _context.Courses.FindAsync(request.CourseId);
            if (course == null)
                throw new NotFoundException("Course/Training not found.");

            // Check if already enrolled
            var existingEnrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == request.CourseId);

            if (existingEnrollment != null)
                throw new ApiException("You are already enrolled in this training.", 400);

            // Check if there is an active pending/success payment with this transaction ID
            var existingPayment = await _context.Payments
                .FirstOrDefaultAsync(p => p.TransactionId == request.TransactionId);
            if (existingPayment != null)
                throw new ApiException("This Transaction ID has already been submitted.", 400);

            // Create Payment Record (Status: Pending)
            var payment = new PaymentRecord
            {
                UserId = userId,
                CourseId = request.CourseId,
                Amount = request.Amount,
                Status = "Pending",
                TransactionId = request.TransactionId,
                PaymentMethod = request.PaymentMethod,
                PhoneNumber = request.PhoneNumber,
                CreatedAt = DateTime.UtcNow
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return new PaymentResponseDto
            {
                TransactionId = request.TransactionId,
                Status = "Pending",
                Message = "Your enrollment request has been submitted. An administrator will verify your payment shortly.",
                IsEnrolled = false
            };
        }

        public async Task<List<PaymentRecordDetailDto>> GetAllPaymentsAsync()
        {
            var payments = await _context.Payments
                .Include(p => p.User)
                .Include(p => p.Course)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return payments.Select(p => new PaymentRecordDetailDto
            {
                Id = p.Id,
                UserId = p.UserId,
                UserEmail = p.User?.Email ?? string.Empty,
                UserFullName = p.User?.FullName ?? string.Empty,
                CourseId = p.CourseId,
                CourseTitle = p.Course?.Title ?? string.Empty,
                Amount = p.Amount,
                Currency = p.Currency,
                Status = p.Status,
                TransactionId = p.TransactionId,
                PaymentMethod = p.PaymentMethod,
                PhoneNumber = p.PhoneNumber,
                CreatedAt = p.CreatedAt
            }).ToList();
        }

        public async Task<bool> ApprovePaymentAsync(Guid paymentId)
        {
            var payment = await _context.Payments
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == paymentId);

            if (payment == null)
                throw new NotFoundException("Payment record not found.");

            if (payment.Status == "Success")
                throw new ApiException("Payment is already approved.", 400);

            // 1. Update Payment Status
            payment.Status = "Success";

            // 2. Create Enrollment
            var enrollment = new Enrollment
            {
                UserId = payment.UserId,
                CourseId = payment.CourseId,
                EnrolledAt = DateTime.UtcNow,
                IsActive = true
            };
            _context.Enrollments.Add(enrollment);

            // 3. Upgrade user role to Student if they are currently just a "User"
            var user = payment.User;
            if (user != null)
            {
                var roles = await _userManager.GetRolesAsync(user);
                if (roles.Contains("User") && !roles.Contains("Student") && !roles.Contains("Admin"))
                {
                    // Update user model property
                    user.Role = "Student";
                    await _userManager.UpdateAsync(user);

                    // Update ASP.NET Identity roles
                    await _userManager.RemoveFromRoleAsync(user, "User");
                    await _userManager.AddToRoleAsync(user, "Student");
                }
                else if (!roles.Contains("Student") && !roles.Contains("Admin"))
                {
                    // Just in case they had no role assigned
                    user.Role = "Student";
                    await _userManager.UpdateAsync(user);
                    await _userManager.AddToRoleAsync(user, "Student");
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PaymentResponseDto> InitiateSSLCommerzPaymentAsync(string userId, Guid courseId, string backendBaseUrl)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User not found.");

            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
                throw new NotFoundException("Course/Training not found.");

            // Check if already enrolled
            var existingEnrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);

            if (existingEnrollment != null)
                throw new ApiException("You are already enrolled in this training.", 400);

            // Generate unique transaction ID
            var tranId = $"VTCLBD_{Guid.NewGuid().ToString("N").Substring(0, 12)}".ToUpper();

            // Create pending payment record
            var payment = new PaymentRecord
            {
                UserId = userId,
                CourseId = courseId,
                Amount = course.Price,
                Currency = "BDT",
                Status = "Pending",
                TransactionId = tranId,
                PaymentMethod = "SSLCommerz",
                PhoneNumber = user.PhoneNumber ?? "",
                CreatedAt = DateTime.UtcNow
            };
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            // Load SSLCommerz settings from configuration
            var sslSection = _configuration.GetSection("SSLCommerz");
            var storeId = sslSection["StoreId"];
            if (string.IsNullOrEmpty(storeId)) storeId = "testbox"; // default sandbox store ID
            
            var storePassword = sslSection["StorePassword"];
            if (string.IsNullOrEmpty(storePassword)) storePassword = "qwerty"; // default sandbox password
            
            var baseUrl = sslSection["BaseUrl"];
            if (string.IsNullOrEmpty(baseUrl)) baseUrl = "https://sandbox.sslcommerz.com";

            // Define callback URLs targeting the backend controller endpoints
            var successUrl = $"{backendBaseUrl}/api/payment/sslcommerz/callback?status=success";
            var failUrl = $"{backendBaseUrl}/api/payment/sslcommerz/callback?status=fail";
            var cancelUrl = $"{backendBaseUrl}/api/payment/sslcommerz/callback?status=cancel";
            var ipnUrl = $"{backendBaseUrl}/api/payment/sslcommerz/ipn";

            // Prepare HTTP request to SSLCommerz Session API
            var values = new Dictionary<string, string>
            {
                { "store_id", storeId },
                { "store_passwd", storePassword },
                { "total_amount", course.Price.ToString("F2") },
                { "currency", "BDT" },
                { "tran_id", tranId },
                { "success_url", successUrl },
                { "fail_url", failUrl },
                { "cancel_url", cancelUrl },
                { "ipn_url", ipnUrl },
                { "cus_name", user.FullName ?? "Student" },
                { "cus_email", user.Email ?? "student@vtclbd.com" },
                { "cus_add1", "Dhaka" },
                { "cus_city", "Dhaka" },
                { "cus_state", "Dhaka" },
                { "cus_postcode", "1000" },
                { "cus_country", "Bangladesh" },
                { "cus_phone", user.PhoneNumber ?? "01700000000" },
                { "shipping_method", "NO" },
                { "product_name", course.Title },
                { "product_category", "Education" },
                { "product_profile", "non-physical-goods" }
            };

            var client = _httpClientFactory.CreateClient();
            var content = new FormUrlEncodedContent(values);
            
            var response = await client.PostAsync($"{baseUrl}/gwprocess/v4/api.php", content);
            if (!response.IsSuccessStatusCode)
            {
                throw new ApiException("Failed to communicate with SSLCommerz gateway.", 502);
            }

            var responseString = await response.Content.ReadAsStringAsync();
            var sslRes = System.Text.Json.JsonSerializer.Deserialize<SSLCommerzSessionResponse>(responseString, new System.Text.Json.JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (sslRes == null || sslRes.Status != "SUCCESS" || string.IsNullOrEmpty(sslRes.GatewayPageURL))
            {
                var errorMsg = sslRes?.Failedreason ?? "Session creation failed.";
                throw new ApiException($"SSLCommerz integration error: {errorMsg}", 400);
            }

            return new PaymentResponseDto
            {
                TransactionId = tranId,
                Status = "Pending",
                Message = "Redirecting to payment gateway...",
                IsEnrolled = false,
                GatewayPageURL = sslRes.GatewayPageURL
            };
        }

        public async Task<string> HandleSSLCommerzCallbackAsync(string tranId, string valId, string status)
        {
            var sslSection = _configuration.GetSection("SSLCommerz");
            var frontendSection = _configuration.GetSection("Frontend");
            var frontendUrl = frontendSection["BaseUrl"] ?? "http://localhost:3000";

            var payment = await _context.Payments
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.TransactionId == tranId);

            if (payment == null)
            {
                return $"{frontendUrl}/payment/failed?reason=Transaction not found.";
            }

            if (status == "fail" || status == "cancel")
            {
                payment.Status = status == "fail" ? "Failed" : "Cancelled";
                await _context.SaveChangesAsync();
                return $"{frontendUrl}/payment/failed?reason=Payment was {status}ed.";
            }

            // Success callback: validate the transaction using order validation API
            var storeId = sslSection["StoreId"];
            if (string.IsNullOrEmpty(storeId)) storeId = "testbox";
            
            var storePassword = sslSection["StorePassword"];
            if (string.IsNullOrEmpty(storePassword)) storePassword = "qwerty";
            
            var baseUrl = sslSection["BaseUrl"];
            if (string.IsNullOrEmpty(baseUrl)) baseUrl = "https://sandbox.sslcommerz.com";

            var validationUrl = $"{baseUrl}/validator/api/validationserverAPI.php?val_id={valId}&store_id={storeId}&store_passwd={storePassword}&format=json";

            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync(validationUrl);
            if (!response.IsSuccessStatusCode)
            {
                return $"{frontendUrl}/payment/failed?reason=Failed to validate payment with gateway.";
            }

            var responseString = await response.Content.ReadAsStringAsync();
            var valRes = System.Text.Json.JsonSerializer.Deserialize<SSLCommerzValidationResponse>(responseString, new System.Text.Json.JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (valRes == null || (valRes.Status != "VALID" && valRes.Status != "VALIDATED"))
            {
                payment.Status = "Failed";
                await _context.SaveChangesAsync();
                return $"{frontendUrl}/payment/failed?reason=Gateway marked payment as invalid.";
            }

            // Payment is valid! Let's enroll the student!
            if (payment.Status != "Success")
            {
                payment.Status = "Success";
                
                // Set payment method details
                payment.PaymentMethod = "SSLCommerz";

                // Create Enrollment
                var enrollment = new Enrollment
                {
                    UserId = payment.UserId,
                    CourseId = payment.CourseId,
                    EnrolledAt = DateTime.UtcNow,
                    IsActive = true
                };
                _context.Enrollments.Add(enrollment);

                // Upgrade role to Student
                var user = payment.User;
                if (user != null)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    if (roles.Contains("User") && !roles.Contains("Student") && !roles.Contains("Admin"))
                    {
                        user.Role = "Student";
                        await _userManager.UpdateAsync(user);
                        await _userManager.RemoveFromRoleAsync(user, "User");
                        await _userManager.AddToRoleAsync(user, "Student");
                    }
                    else if (!roles.Contains("Student") && !roles.Contains("Admin"))
                    {
                        user.Role = "Student";
                        await _userManager.UpdateAsync(user);
                        await _userManager.AddToRoleAsync(user, "Student");
                    }
                }

                await _context.SaveChangesAsync();
            }

            return $"{frontendUrl}/dashboard?payment=success&tranId={tranId}";
        }
    }
}
