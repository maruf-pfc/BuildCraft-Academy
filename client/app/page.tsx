"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import {
  RiArrowRightLine,
  RiBuildingLine,
  RiGraduationCapLine,
  RiMedalLine,
  RiTeamLine,
  RiPlayCircleLine,
} from "react-icons/ri";
import { courseService } from "@/services/course.service";
import { projectService } from "@/services/project.service";
import type { CourseResponseDto, ProjectResponseDto } from "@/types";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

gsap.registerPlugin(ScrollTrigger);

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);
}

const stats = [
  { label: "Students Trained", value: "2,500+", icon: RiTeamLine },
  { label: "Expert Courses", value: "15+", icon: RiGraduationCapLine },
  { label: "Projects Delivered", value: "50+", icon: RiBuildingLine },
  { label: "Certificates Issued", value: "1,800+", icon: RiMedalLine },
];

export default function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null);

  const { data: coursesData } = useQuery({
    queryKey: ["courses"],
    queryFn: () => courseService.getAll(true),
  });

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getAll(true),
  });

  const courses: CourseResponseDto[] = coursesData?.data?.slice(0, 3) ?? [];
  const projects: ProjectResponseDto[] = projectsData?.data?.slice(0, 3) ?? [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-text > *",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: "power3.out", delay: 0.3 }
      );
      gsap.fromTo(
        ".stat-card",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".animate-card",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: ".cards-section", start: "top 80%" },
        }
      );
    });
    return () => ctx.revert();
  }, [courses, projects]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <section
          className="relative min-h-[92vh] flex items-center pt-16 overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(var(--primary) / 0.15), transparent)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
            style={{
              backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="hero-text max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Bangladesh&apos;s Premier Construction Academy
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                Master The Art of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">
                  Building & Engineering
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Expert-led courses in construction, interior design, and structural
                engineering — learn at your own pace, earn a verified certificate, and
                build your future.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                >
                  Browse Courses <RiArrowRightLine />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-all hover:-translate-y-0.5"
                >
                  <RiPlayCircleLine className="text-primary" /> View Our Work
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ──────────────────────────────────────────────────────────── */}
        <section ref={statsRef} className="py-16 border-y border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="stat-card flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-background hover:border-primary/40 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="text-primary text-2xl" />
                  </div>
                  <div className="text-3xl font-bold">{value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Courses Preview ─────────────────────────────────────────────────── */}
        <section className="cards-section py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Learn</p>
              <h2 className="text-3xl sm:text-4xl font-bold">Featured Courses</h2>
            </div>
            <Link
              href="/courses"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              View all <RiArrowRightLine />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="animate-card group rounded-2xl border border-border bg-background overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-44 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent flex items-center justify-center">
                  <RiGraduationCapLine className="text-5xl text-primary/40 group-hover:text-primary/60 transition-colors" />
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">{course.instructorName}</p>
                  <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-primary">{formatPrice(course.price)}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                      Enroll Now <RiArrowRightLine />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Projects Preview ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-muted/20 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">Portfolio</p>
                <h2 className="text-3xl sm:text-4xl font-bold">Our Featured Projects</h2>
              </div>
              <Link
                href="/projects"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                View all <RiArrowRightLine />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group rounded-2xl border border-border overflow-hidden bg-background hover:border-primary/40 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className="h-52 bg-cover bg-center relative"
                    style={{ backgroundImage: project.imageUrl ? `url(${project.imageUrl})` : undefined }}
                  >
                    {!project.imageUrl && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <RiBuildingLine className="text-5xl text-primary/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-1 rounded-md bg-primary/80 text-primary-foreground text-xs font-medium">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-1.5">
                    <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    <p className="text-xs text-muted-foreground">{project.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────────── */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-3xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-10 sm:p-16 text-center"
          >
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Build Your Career?</h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                Join over 2,500 professionals who have advanced their skills with BuildCraft Academy.
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
              >
                Start Learning Today <RiArrowRightLine />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
