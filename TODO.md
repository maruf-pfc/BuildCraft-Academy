# 📝 VTCLBD Implementation Roadmap & TODO Tracker

This file tracks the completed, ongoing, and pending features of the Victory Technologies and Construction Ltd (VTCLBD) platform.

## 🟩 COMPLETED FEATURES

*   **💳 SSLCommerz Sandbox API Integration**:
    *   Initiation service generating secure gateway session pages redirecting user.
    *   Form-urlencoded callback handling for success/fail/cancel redirect workflows.
    *    validator/api validationserverAPI transaction verification securing enrollment activation and automated student role upgrades.
*   **🔒 Auth System & Session Management**:
    *   JWT-based registration, login, and profile fetching.
    *   Persistent Zustand store (`auth.store.ts`) for auth tokens.
    *   Axios dynamic interceptor invalidating tokens strictly on expiration (preventing false logouts).
*   **📂 Multi-stage Docker Containerization**:
    *   Production-ready frontend and backend Dockerfiles.
    *   `docker-compose.yml` leveraging local `.env` variables to avoid credential leakage.
    *   Root `.gitignore` ignoring `.env` and local caches.
*   **📜 Automated Certificate Issuance**:
    *   Auto-generation of certificate records once progress hits 100%.
    *   High-resolution fallback mock template for visual elegance.
    *   Exclusively enrolled course certificate listings.
*   **📦 Backend REST API**:
    *   EF Core schema definitions with seeded Admin (`admin@vtclbd.com` / `Admin@123`) and Student (`student@vtclbd.com` / `Student@123`) accounts.
    *   Dynamic cascading deletion of users (`DeleteUserAsync` in `UserService.cs`) that cleans enrollments, progress, and payment records without violating relational integrity.
*   **💻 Admin CRUD Overlays**:
    *   Unified frosted-glass fullscreen modal setup for Courses, Projects, and CMS blocks to eliminate scrolling.
*   **⛓️ CI/CD Workflows**:
    *   GitHub Actions configuration validating Next.js frontend, dotnet solution builds, and dry-running Docker configurations.

---

## 🟨 ONGOING & ACTIVE IN-DEVELOPMENT FEATURES

*   **🎨 Brand Identity Colors Overhaul**:
    *   Applying `#135c7c` (Primary Blue) and `#39c2e3` (Secondary Cyan) HSL/OKLCH tokens across frontend templates.
    *   Setting up clean Inter/Manrope typography, white cards, soft shadows, and hover glow transitions.
    *   Placing the transparent logo (`logo-transparent.png`) across all major navigation nodes.
*   **🏢 Career Page & Jobs Pipeline**:
    *   *Frontend*: Unified careers dashboard displaying active job posts, roles, requirements, and a prominent "Apply Now" CTA pointing to a custom application Google Form.
    *   *Backend*: Admin panel Job CRUD interface allowing posting, updating, and removing open engineering roles.
*   **🎬 Web Animations & Interactive Elements**:
    *   GSAP integrations on the homepage (sliders, dynamic statistcs ticker, testimonial transitions).
*   **📊 Rich Admin Dashboard Analytics**:
    *   Visualization widgets detailing payments throughput, active enrollment trends, project completions ratios, and student signups.
*   **🎓 Enhanced Course Curriculum Editor**:
    *   Interactive Course Edit mode allowing full nested CRUD controls over Course Modules, Video Lessons, and downloadable PDF/Zip resources without shifting contexts.
*   **🌐 CMS Website Page Overhauls**:
    *   *Home Page*: GSAP Banner Slider, Statistics Counter, Featured Courses, Featured Services cards (with dynamic modals), and Feedbacks/Partners carousels.
    *   *About Page*: Building Modern Spaces... Vision, Mission, Core Values, and Service outlines.
    *   *Contact Page*: Branch details, inquiry form, and responsive map anchors.
*   **☁️ Cloudinary Upload Optimizations**:
    *   Direct client-to-Cloudinary or streamlined API image uploads with loaders, error bounds, and instant previews.

---

## 🟥 INCOMPLETE / PLANNED FEATURES

*   **💳 Live BKash Integration**:
    *   Transitioning bKash manual payment code verification to real-time checkout API.
*   **🔔 Real-time Notification System**:
    *   SignalR backend connection triggering instant browser popups for certificate issuances and course enrollments.
*   **📈 Course Video Completion Telemetry**:
    *   Storing exact video timestamp watch markers to prevent manual checkoffs if the student skipped sections.
