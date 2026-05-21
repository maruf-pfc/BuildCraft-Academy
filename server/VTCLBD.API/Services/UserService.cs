using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VTCLBD.API.Common.Exceptions;
using VTCLBD.API.Configs;
using VTCLBD.API.DTOs.User;
using VTCLBD.API.Interfaces;
using VTCLBD.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace VTCLBD.API.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserService(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<IEnumerable<UserDetailDto>> GetAllUsersAsync()
        {
            var users = await _context.Users.ToListAsync();
            var enrollments = await _context.Enrollments
                .Include(e => e.Course)
                .ToListAsync();

            var result = new List<UserDetailDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var role = roles.FirstOrDefault() ?? user.Role;

                var userEnrollments = enrollments
                    .Where(e => e.UserId == user.Id)
                    .Select(e => new UserEnrollmentDto
                    {
                        CourseId = e.CourseId,
                        CourseTitle = e.Course?.Title ?? "Unknown Course",
                        EnrolledAt = e.EnrolledAt
                    }).ToList();

                result.Add(new UserDetailDto
                {
                    Id = user.Id,
                    Email = user.Email ?? string.Empty,
                    FullName = user.FullName,
                    Role = role,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,
                    EnrolledCourses = userEnrollments
                });
            }

            return result.OrderByDescending(u => u.CreatedAt);
        }

        public async Task<bool> UpdateUserRoleAsync(string userId, string newRole)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User not found.");

            // Avoid demoting the last Admin
            if (user.Role == "Admin" && newRole != "Admin")
            {
                var admins = await _userManager.GetUsersInRoleAsync("Admin");
                if (admins.Count <= 1)
                {
                    throw new ApiException("Cannot demote the last remaining Administrator.", 400);
                }
            }

            // Remove current roles
            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);

            // Add new role
            var result = await _userManager.AddToRoleAsync(user, newRole);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new ApiException($"Failed to update role: {errors}", 400);
            }

            user.Role = newRole;
            await _userManager.UpdateAsync(user);

            return true;
        }

        public async Task<bool> ToggleUserStatusAsync(string userId, bool isActive)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User not found.");

            // Prevent self-deactivation of Admin
            if (user.Role == "Admin" && !isActive)
            {
                var activeAdmins = (await _userManager.GetUsersInRoleAsync("Admin"))
                    .Where(u => u.IsActive)
                    .ToList();

                if (activeAdmins.Count <= 1 && activeAdmins.Any(a => a.Id == userId))
                {
                    throw new ApiException("Cannot deactivate the last active Administrator.", 400);
                }
            }

            user.IsActive = isActive;
            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> ManuallyEnrollUserAsync(string userId, Guid courseId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User not found.");

            var course = await _context.Courses.FindAsync(courseId);
            if (course == null)
                throw new NotFoundException("Course not found.");

            var existingEnrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);

            if (existingEnrollment != null)
            {
                if (existingEnrollment.IsActive)
                    throw new ApiException("User is already actively enrolled in this course.", 400);
                
                existingEnrollment.IsActive = true;
                existingEnrollment.EnrolledAt = DateTime.UtcNow;
            }
            else
            {
                var enrollment = new Enrollment
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    CourseId = courseId,
                    EnrolledAt = DateTime.UtcNow,
                    IsActive = true
                };
                _context.Enrollments.Add(enrollment);
            }

            // Upgrade role to Student if they are currently just a "User"
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains("User") && !roles.Contains("Student") && !roles.Contains("Admin"))
            {
                user.Role = "Student";
                await _userManager.UpdateAsync(user);
                await _userManager.RemoveFromRoleAsync(user, "User");
                await _userManager.AddToRoleAsync(user, "Student");
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ManuallyUnenrollUserAsync(string userId, Guid courseId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User not found.");

            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);

            if (enrollment == null)
                throw new NotFoundException("Enrollment record not found.");

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();

            // Optional: If user has no more enrollments, we can demote them from Student to User
            var hasOtherEnrollments = await _context.Enrollments
                .AnyAsync(e => e.UserId == userId && e.IsActive);

            if (!hasOtherEnrollments)
            {
                var roles = await _userManager.GetRolesAsync(user);
                if (roles.Contains("Student") && !roles.Contains("Admin"))
                {
                    user.Role = "User";
                    await _userManager.UpdateAsync(user);
                    await _userManager.RemoveFromRoleAsync(user, "Student");
                    await _userManager.AddToRoleAsync(user, "User");
                }
            }

            return true;
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new NotFoundException("User not found.");

            // Prevent deleting the last admin
            if (user.Role == "Admin")
            {
                var admins = await _userManager.GetUsersInRoleAsync("Admin");
                if (admins.Count <= 1)
                    throw new ApiException("Cannot delete the last remaining Administrator.", 400);
            }

            // Remove related data
            var enrollments = _context.Enrollments.Where(e => e.UserId == userId);
            _context.Enrollments.RemoveRange(enrollments);

            var payments = _context.Payments.Where(p => p.UserId == userId);
            _context.Payments.RemoveRange(payments);

            var progress = _context.LessonProgresses.Where(p => p.UserId == userId);
            _context.LessonProgresses.RemoveRange(progress);

            var certificates = _context.Certificates.Where(c => c.UserId == userId);
            _context.Certificates.RemoveRange(certificates);

            await _context.SaveChangesAsync();

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }
    }
}
