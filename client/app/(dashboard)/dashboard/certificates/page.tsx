"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/course.service";
import { progressService } from "@/services/progress.service";
import { RiMedalLine, RiAwardLine, RiLockLine, RiExternalLinkLine, RiArrowRightLine } from "react-icons/ri";
import type { CourseResponseDto } from "@/types";

function CertificateRow({ course }: { course: CourseResponseDto }) {
  // Query completion progress
  const { data: progressRes } = useQuery({
    queryKey: ["progress", course.id],
    queryFn: () => progressService.getCourseProgress(course.id),
  });

  const progress = progressRes?.data;
  const isCompleted = progress?.isCourseCompleted;

  // Query certificate if completed
  const { data: certRes } = useQuery({
    queryKey: ["certificate", course.id],
    queryFn: () => progressService.getCertificate(course.id),
    enabled: !!isCompleted,
  });

  const cert = certRes?.data;

  return (
    <div className="rounded-2xl border border-border bg-background p-6 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between hover:border-primary/40 hover:shadow-md transition-all group">
      <div className="flex gap-4 items-center">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? "bg-amber-500/10 text-amber-500" : "bg-muted/80 text-muted-foreground/50"}`}>
          {isCompleted ? <RiAwardLine className="text-2xl animate-pulse" /> : <RiLockLine className="text-xl" />}
        </div>
        <div className="min-w-0 space-y-1">
          <h3 className="font-semibold text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {isCompleted ? `Issued on: ${cert ? new Date(cert.issuedAt).toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" }) : "Generating..."}` : `Course is ${Math.round(progress?.progressPercentage ?? 0)}% complete`}
          </p>
          {cert && (
            <p className="text-[11px] font-mono bg-muted/60 px-2 py-0.5 rounded text-muted-foreground w-fit">
              ID: {cert.certificateNumber}
            </p>
          )}
        </div>
      </div>

      <div>
        {isCompleted ? (
          cert?.certificateUrl ? (
            <a
              href={cert.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
            >
              <RiExternalLinkLine className="text-base" /> View Certificate
            </a>
          ) : (
            <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-600 text-sm font-semibold flex items-center gap-1.5 border border-amber-500/20">
              <RiAwardLine className="text-base" /> Certificate Issued ✓
            </div>
          )
        ) : (
          <Link
            href={`/learn/${course.id}`}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 text-sm font-semibold transition-all flex items-center justify-center gap-1"
          >
            Complete Course <RiArrowRightLine />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  // Only fetch ENROLLED courses, not all courses
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: () => courseService.getEnrolled(),
  });

  const courses: CourseResponseDto[] = coursesData?.data ?? [];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My Certificates</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and download your official BuildCraft Academy credentials.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="rounded-2xl border border-border p-6 flex gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center max-w-lg mx-auto mt-10">
          <RiMedalLine className="text-5xl text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-1">No certificates yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Enroll in a course and complete all lessons to earn your certificate.</p>
          <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
            Browse Courses <RiArrowRightLine />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map(course => <CertificateRow key={course.id} course={course} />)}
        </div>
      )}
    </div>
  );
}
