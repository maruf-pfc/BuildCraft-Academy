using VTCLBD.API.Common.Exceptions;
using VTCLBD.API.Configs;
using VTCLBD.API.DTOs.Payment;
using VTCLBD.API.Interfaces;
using VTCLBD.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace VTCLBD.API.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public PaymentService(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
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
    }
}
