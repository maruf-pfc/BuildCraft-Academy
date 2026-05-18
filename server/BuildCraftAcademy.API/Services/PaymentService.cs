using BuildCraftAcademy.API.Common.Exceptions;
using BuildCraftAcademy.API.Configs;
using BuildCraftAcademy.API.DTOs.Payment;
using BuildCraftAcademy.API.Interfaces;
using BuildCraftAcademy.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BuildCraftAcademy.API.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _context;

        public PaymentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PaymentResponseDto> ProcessDummyPaymentAsync(string userId, InitiatePaymentDto request)
        {
            var course = await _context.Courses.FindAsync(request.CourseId);
            if (course == null)
                throw new NotFoundException("Course not found.");

            // Check if already enrolled
            var existingEnrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == request.CourseId);

            if (existingEnrollment != null)
                throw new ApiException("You are already enrolled in this course.", 400);

            var transactionId = "DUMMY_" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper();

            // 1. Create Payment Record (Simulating Success)
            var payment = new PaymentRecord
            {
                UserId = userId,
                CourseId = request.CourseId,
                Amount = course.Price,
                Status = "Success",
                TransactionId = transactionId,
                CreatedAt = DateTime.UtcNow
            };
            _context.Payments.Add(payment);

            // 2. Create Enrollment
            var enrollment = new Enrollment
            {
                UserId = userId,
                CourseId = request.CourseId,
                EnrolledAt = DateTime.UtcNow,
                IsActive = true
            };
            _context.Enrollments.Add(enrollment);

            await _context.SaveChangesAsync();

            return new PaymentResponseDto
            {
                TransactionId = transactionId,
                Status = "Success",
                Message = "Payment successful. You are now enrolled in the course.",
                IsEnrolled = true
            };
        }
    }
}
