using BuildCraftAcademy.API.Configs;
using BuildCraftAcademy.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BuildCraftAcademy.API.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var context = serviceProvider.GetRequiredService<AppDbContext>();

            // ── Roles ─────────────────────────────────────────────────────────────
            string[] roles = { "Admin", "Student", "User" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            // ── Admin User ────────────────────────────────────────────────────────
            const string adminEmail = "admin@buildcraft.com";
            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var admin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = "System Administrator",
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                };
                var r = await userManager.CreateAsync(admin, "Admin@123!");
                if (r.Succeeded) await userManager.AddToRoleAsync(admin, "Admin");
            }

            // ── Demo Student ──────────────────────────────────────────────────────
            const string studentEmail = "student@buildcraft.com";
            ApplicationUser? studentUser = null;
            if (await userManager.FindByEmailAsync(studentEmail) == null)
            {
                studentUser = new ApplicationUser
                {
                    UserName = studentEmail,
                    Email = studentEmail,
                    FullName = "Demo Student",
                    Role = "Student",
                    CreatedAt = DateTime.UtcNow
                };
                var r = await userManager.CreateAsync(studentUser, "Student@123!");
                if (r.Succeeded) await userManager.AddToRoleAsync(studentUser, "Student");
            }
            else
            {
                studentUser = await userManager.FindByEmailAsync(studentEmail);
            }

            // ── Skip rest if already seeded ───────────────────────────────────────
            if (await context.Courses.AnyAsync()) return;

            // ── Courses ───────────────────────────────────────────────────────────
            var course1Id = Guid.NewGuid();
            var course2Id = Guid.NewGuid();
            var course3Id = Guid.NewGuid();

            var courses = new List<Course>
            {
                new()
                {
                    Id = course1Id,
                    Title = "Modern Interior Design Mastery",
                    Description = "A comprehensive course covering all aspects of modern interior design — from space planning and color theory to furniture selection and lighting design. Ideal for aspiring designers and home renovation enthusiasts.",
                    Price = 4999,
                    VideoUrl = "https://res.cloudinary.com/demo/video/upload/dog.mp4",
                    InstructorName = "Sarah Mitchell",
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-60)
                },
                new()
                {
                    Id = course2Id,
                    Title = "Structural Engineering Fundamentals",
                    Description = "Master the core principles of structural engineering — load calculations, material science, beam and column design, and foundation types. Designed for civil engineering students and construction professionals.",
                    Price = 5999,
                    VideoUrl = "https://res.cloudinary.com/demo/video/upload/dog.mp4",
                    InstructorName = "Dr. James Patel",
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-45)
                },
                new()
                {
                    Id = course3Id,
                    Title = "AutoCAD for Construction Professionals",
                    Description = "From zero to production-ready 2D and 3D drawings. Learn AutoCAD tools, layers, blocks, annotation, and printing workflows tailored for construction and architectural projects.",
                    Price = 3499,
                    VideoUrl = "https://res.cloudinary.com/demo/video/upload/dog.mp4",
                    InstructorName = "Mark Johnson",
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow.AddDays(-30)
                }
            };

            context.Courses.AddRange(courses);

            // ── Course 1 Modules ──────────────────────────────────────────────────
            var m1 = Guid.NewGuid(); var m2 = Guid.NewGuid(); var m3 = Guid.NewGuid();
            var modules = new List<CourseModule>
            {
                new() { Id = m1, CourseId = course1Id, Title = "Design Principles & Color Theory", Description = "Understand the foundational principles that drive great interior design.", Order = 1, IsPublished = true, CreatedAt = DateTime.UtcNow },
                new() { Id = m2, CourseId = course1Id, Title = "Space Planning & Furniture Layout", Description = "Learn how to plan spaces efficiently and choose the right furniture.", Order = 2, IsPublished = true, CreatedAt = DateTime.UtcNow },
                new() { Id = m3, CourseId = course1Id, Title = "Lighting Design & Finishing", Description = "Master ambient, task, and accent lighting along with surface finishes.", Order = 3, IsPublished = true, CreatedAt = DateTime.UtcNow },

                // Course 2 modules
                new() { Id = Guid.NewGuid(), CourseId = course2Id, Title = "Introduction to Structural Systems", Description = "Overview of load paths and structural systems.", Order = 1, IsPublished = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), CourseId = course2Id, Title = "Beam & Column Design", Description = "Calculations and design principles for beams and columns.", Order = 2, IsPublished = true, CreatedAt = DateTime.UtcNow },

                // Course 3 modules
                new() { Id = Guid.NewGuid(), CourseId = course3Id, Title = "AutoCAD Interface & Setup", Description = "Navigate the AutoCAD workspace and configure it for construction work.", Order = 1, IsPublished = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), CourseId = course3Id, Title = "2D Drafting Essentials", Description = "Lines, circles, arcs, annotations, and dimensions.", Order = 2, IsPublished = true, CreatedAt = DateTime.UtcNow },
            };

            context.CourseModules.AddRange(modules);

            // ── Video Lessons for Course 1 Module 1 ───────────────────────────────
            var l1 = Guid.NewGuid(); var l2 = Guid.NewGuid(); var l3 = Guid.NewGuid();
            var lessons = new List<VideoLesson>
            {
                // Module 1
                new() { Id = l1, ModuleId = m1, Title = "Welcome to Interior Design", VideoUrl = "https://res.cloudinary.com/demo/video/upload/dog.mp4", DurationInSeconds = 420, Order = 1, IsPublished = true, CreatedAt = DateTime.UtcNow },
                new() { Id = l2, ModuleId = m1, Title = "Understanding the Color Wheel", VideoUrl = "https://res.cloudinary.com/demo/video/upload/dog.mp4", DurationInSeconds = 750, Order = 2, IsPublished = true, CreatedAt = DateTime.UtcNow },
                new() { Id = l3, ModuleId = m1, Title = "Creating Mood Boards", VideoUrl = "https://res.cloudinary.com/demo/video/upload/dog.mp4", DurationInSeconds = 600, Order = 3, IsPublished = true, CreatedAt = DateTime.UtcNow },
                // Module 2
                new() { Id = Guid.NewGuid(), ModuleId = m2, Title = "Reading Floor Plans", VideoUrl = "https://res.cloudinary.com/demo/video/upload/dog.mp4", DurationInSeconds = 900, Order = 1, IsPublished = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), ModuleId = m2, Title = "Furniture Placement Rules", VideoUrl = "https://res.cloudinary.com/demo/video/upload/dog.mp4", DurationInSeconds = 660, Order = 2, IsPublished = true, CreatedAt = DateTime.UtcNow },
                // Module 3
                new() { Id = Guid.NewGuid(), ModuleId = m3, Title = "Types of Lighting in Design", VideoUrl = "https://res.cloudinary.com/demo/video/upload/dog.mp4", DurationInSeconds = 540, Order = 1, IsPublished = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), ModuleId = m3, Title = "Choosing Finishes & Textures", VideoUrl = "https://res.cloudinary.com/demo/video/upload/dog.mp4", DurationInSeconds = 480, Order = 2, IsPublished = true, CreatedAt = DateTime.UtcNow },
            };

            context.VideoLessons.AddRange(lessons);

            // ── Resource Links ────────────────────────────────────────────────────
            context.ResourceLinks.AddRange(new List<ResourceLink>
            {
                new() { Id = Guid.NewGuid(), ModuleId = m1, Title = "Color Theory Cheat Sheet", Url = "https://www.canva.com/colors/color-wheel/", Type = "Link", CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), ModuleId = m1, Title = "Module 1 Slide Deck (PDF)", Url = "https://example.com/slides/module1.pdf", Type = "PDF", CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), ModuleId = m2, Title = "Space Planning Worksheet", Url = "https://example.com/worksheets/space.pdf", Type = "PDF", CreatedAt = DateTime.UtcNow },
            });

            // ── Projects (Portfolio Showcase) ─────────────────────────────────────
            context.Projects.AddRange(new List<Project>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    Title = "Skyline Corporate Tower",
                    Description = "A 22-story mixed-use skyscraper in Dhaka's commercial district featuring earthquake-resistant structural systems, green-certified mechanical systems, and a distinctive glass curtain wall facade.",
                    ImageUrl = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
                    Category = "Commercial Construction",
                    ClientName = "Skyline Holdings Ltd.",
                    Location = "Gulshan, Dhaka",
                    CompletionDate = DateTime.UtcNow.AddMonths(-6),
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow.AddYears(-1)
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Title = "The Riverside Luxury Residences",
                    Description = "A 120-unit premium residential complex along the Buriganga riverbank. Features bespoke interior design packages, rooftop gardens, and a state-of-the-art community center.",
                    ImageUrl = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
                    Category = "Residential Construction",
                    ClientName = "Riverside Developers",
                    Location = "Keraniganj, Dhaka",
                    CompletionDate = DateTime.UtcNow.AddMonths(-3),
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow.AddMonths(-18)
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Title = "Heritage Hotel Interior Renovation",
                    Description = "Full interior redesign of a 5-star heritage hotel — 200 guest rooms, 3 restaurants, and the grand ballroom. Blended colonial-era architecture with contemporary comfort and smart room technology.",
                    ImageUrl = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
                    Category = "Interior Design",
                    ClientName = "Grand Heritage Hotels Group",
                    Location = "Old Dhaka, Dhaka",
                    CompletionDate = DateTime.UtcNow.AddMonths(-9),
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow.AddYears(-1).AddMonths(-3)
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    Title = "Green Industrial Warehouse Complex",
                    Description = "A 40,000 sq ft industrial logistics hub built with solar panels, rainwater harvesting, and efficient spatial zoning to reduce energy consumption by 35%.",
                    ImageUrl = "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800",
                    Category = "Industrial Construction",
                    ClientName = "EcoLogix Bangladesh",
                    Location = "Gazipur Industrial Zone",
                    CompletionDate = DateTime.UtcNow.AddMonths(-1),
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow.AddYears(-1).AddMonths(-6)
                },
            });

            // ── CMS Content Blocks ────────────────────────────────────────────────
            context.ContentBlocks.AddRange(new List<ContentBlock>
            {
                new() { Id = Guid.NewGuid(), Identifier = "home-hero-title", Content = "Master The Art of Building & Engineering", Type = "Text", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), Identifier = "home-hero-subtitle", Content = "Expert-led courses in construction, interior design, and structural engineering — learn online, build with confidence.", Type = "Text", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), Identifier = "home-hero-cta", Content = "Browse Courses", Type = "Text", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), Identifier = "about-us-text", Content = "BuildCraft Academy is Bangladesh's premier training and consultancy platform for construction and design professionals. Founded in 2020, we have trained over 2,000 students and delivered more than 50 landmark projects across the country.", Type = "Html", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), Identifier = "footer-tagline", Content = "Build Knowledge. Build Futures.", Type = "Text", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), Identifier = "contact-email", Content = "contact@buildcraftacademy.com", Type = "Text", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), Identifier = "contact-phone", Content = "+880 1700-000000", Type = "Text", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), Identifier = "contact-address", Content = "House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh", Type = "Text", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), Identifier = "stats-students", Content = "2500+", Type = "Text", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), Identifier = "stats-courses", Content = "15+", Type = "Text", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), Identifier = "stats-projects", Content = "50+", Type = "Text", IsActive = true, CreatedAt = DateTime.UtcNow },
                new() { Id = Guid.NewGuid(), Identifier = "stats-instructors", Content = "10+", Type = "Text", IsActive = true, CreatedAt = DateTime.UtcNow },
            });

            await context.SaveChangesAsync();

            // ── Enrollment & Progress for Demo Student ────────────────────────────
            if (studentUser != null)
            {
                // Enroll student in course 1
                var alreadyEnrolled = await context.Enrollments
                    .AnyAsync(e => e.UserId == studentUser.Id && e.CourseId == course1Id);

                if (!alreadyEnrolled)
                {
                    context.Enrollments.Add(new Enrollment
                    {
                        Id = Guid.NewGuid(),
                        UserId = studentUser.Id,
                        CourseId = course1Id,
                        EnrolledAt = DateTime.UtcNow.AddDays(-20),
                        IsActive = true
                    });

                    context.Payments.Add(new PaymentRecord
                    {
                        Id = Guid.NewGuid(),
                        UserId = studentUser.Id,
                        CourseId = course1Id,
                        Amount = 4999,
                        Status = "Success",
                        TransactionId = "DUMMY_SEED001",
                        CreatedAt = DateTime.UtcNow.AddDays(-20)
                    });

                    // Mark first 2 lessons as complete for demo progress
                    context.LessonProgresses.AddRange(new[]
                    {
                        new LessonProgress { Id = Guid.NewGuid(), UserId = studentUser.Id, LessonId = l1, IsCompleted = true, CompletedAt = DateTime.UtcNow.AddDays(-18), CreatedAt = DateTime.UtcNow.AddDays(-18) },
                        new LessonProgress { Id = Guid.NewGuid(), UserId = studentUser.Id, LessonId = l2, IsCompleted = true, CompletedAt = DateTime.UtcNow.AddDays(-17), CreatedAt = DateTime.UtcNow.AddDays(-17) },
                    });

                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
