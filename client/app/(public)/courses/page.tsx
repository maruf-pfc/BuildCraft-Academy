"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useQuery } from "@tanstack/react-query";
import {
  RiArrowRightLine,
  RiGraduationCapLine,
  RiSearchLine,
  RiTimeLine,
  RiUserLine,
} from "react-icons/ri";
import { courseService } from "@/services/course.service";
import type { CourseResponseDto } from "@/types";

export const metadata = { title: "Courses" };

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const headerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: () => courseService.getAll(true),
  });

  const courses: CourseResponseDto[] = data?.data ?? [];
  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      (c.instructorName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    if (!isLoading && filtered.length > 0) {
      gsap.fromTo(
        ".course-card",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [isLoading, filtered.length]);

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div
        ref={headerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
            All Courses
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Build Skills That Matter
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Expert-crafted courses in construction, interior design, and
            structural engineering — learn at your own pace with certificate
            on completion.
          </p>
        </div>

        {/* Search */}
        <div className="mt-8 relative max-w-md">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-4/5" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <RiGraduationCapLine className="text-6xl text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search query.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing{" "}
              <span className="font-medium text-foreground">
                {filtered.length}
              </span>{" "}
              course{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="course-card group rounded-2xl border border-border bg-background overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="h-44 bg-gradient-to-br from-primary/20 via-primary/5 to-cyan-500/10 flex items-center justify-center relative overflow-hidden">
                    <RiGraduationCapLine className="text-6xl text-primary/30 group-hover:text-primary/50 group-hover:scale-110 transition-all duration-500" />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                        {formatPrice(course.price)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <RiUserLine className="shrink-0" />
                      <span>{course.instructorName ?? "BuildCraft Team"}</span>
                    </div>

                    <h3 className="font-semibold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="font-bold text-primary text-base">
                        {formatPrice(course.price)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                        View Course <RiArrowRightLine />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
