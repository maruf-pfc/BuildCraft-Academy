using VTCLBD.API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace VTCLBD.API.Configs
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Course> Courses { get; set; }
        public DbSet<CourseModule> CourseModules { get; set; }
        public DbSet<VideoLesson> VideoLessons { get; set; }
        public DbSet<ResourceLink> ResourceLinks { get; set; }
        public DbSet<LessonProgress> LessonProgresses { get; set; }
        public DbSet<Certificate> Certificates { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<PaymentRecord> Payments { get; set; }
        public DbSet<ContentBlock> ContentBlocks { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Prevent duplicate progress entries per user per lesson
            builder.Entity<LessonProgress>()
                .HasIndex(lp => new { lp.UserId, lp.LessonId })
                .IsUnique();

            // Prevent duplicate certificates per user per course
            builder.Entity<Certificate>()
                .HasIndex(c => new { c.UserId, c.CourseId })
                .IsUnique();
        }
    }
}
