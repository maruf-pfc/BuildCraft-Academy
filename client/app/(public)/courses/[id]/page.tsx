"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { gsap } from "gsap";
import { toast } from "sonner";
import {
  RiArrowLeftLine, RiGraduationCapLine, RiPlayCircleLine,
  RiTimeLine, RiUserLine, RiCheckboxCircleLine,
  RiLinkM, RiFileTextLine, RiLockLine,
} from "react-icons/ri";
import { courseService } from "@/services/course.service";
import { paymentService } from "@/services/progress.service";
import { useAuthStore } from "@/stores/auth.store";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m${s > 0 ? ` ${s}s` : ""}` : `${s}s`;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(price);
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const heroRef = useRef<HTMLDivElement>(null);

  const { data: courseData, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => courseService.getById(id),
    enabled: !!id,
  });

  const { data: modulesData } = useQuery({
    queryKey: ["course-modules", id],
    queryFn: () => courseService.getModules(id),
    enabled: !!id,
  });

  const course = courseData?.data;
  const modules = modulesData?.data ?? [];
  const totalLessons = modules.reduce((s, m) => s + m.videoLessons.length, 0);
  const totalDuration = modules.reduce((s, m) => s + m.videoLessons.reduce((a, v) => a + v.durationInSeconds, 0), 0);

  const enroll = useMutation({
    mutationFn: () => paymentService.payDummy(id),
    onSuccess: () => { toast.success("Enrolled successfully!"); router.push("/dashboard"); },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleEnroll = () => {
    if (!isAuthenticated) { toast.info("Please log in first."); router.push("/auth/login"); return; }
    enroll.mutate();
  };

  useEffect(() => {
    if (!course) return;
    gsap.fromTo(heroRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
    gsap.fromTo(".module-item", { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.07, duration: 0.4, ease: "power2.out", delay: 0.4 });
  }, [course]);

  if (isLoading) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
  if (!course) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
      <Link href="/courses" className="inline-flex items-center gap-2 text-primary hover:underline"><RiArrowLeftLine />Back to Courses</Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-20">
      <div ref={heroRef} className="border-b border-border" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, hsl(var(--primary)/0.12), transparent)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"><RiArrowLeftLine />All Courses</Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{course.title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><RiUserLine className="text-primary" />{course.instructorName ?? "BuildCraft Team"}</span>
                <span className="flex items-center gap-1.5"><RiPlayCircleLine className="text-primary" />{totalLessons} lessons</span>
                <span className="flex items-center gap-1.5"><RiTimeLine className="text-primary" />{Math.round(totalDuration / 60)} min total</span>
                <span className="flex items-center gap-1.5"><RiCheckboxCircleLine className="text-primary" />Certificate included</span>
              </div>
            </div>
            <div>
              <div className="rounded-2xl border border-border bg-background shadow-xl p-6 space-y-4 sticky top-24">
                <div className="text-3xl font-bold text-primary">{formatPrice(course.price)}</div>
                <button onClick={handleEnroll} disabled={enroll.isPending} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-60 transition-all shadow-lg shadow-primary/20">
                  {enroll.isPending ? "Processing..." : "Enroll Now"}
                </button>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[`${totalLessons} video lessons`, `${Math.round(totalDuration / 60)} min content`, "Resources & materials", "Certificate of Completion", "Lifetime access"].map(item => (
                    <li key={item} className="flex items-center gap-2"><RiCheckboxCircleLine className="text-primary shrink-0" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8">Course Curriculum</h2>
        {modules.length === 0 ? (
          <div className="rounded-xl border border-border p-10 text-center text-muted-foreground">
            <RiGraduationCapLine className="text-4xl mx-auto mb-3 opacity-30" /><p>Curriculum coming soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((module, idx) => (
              <div key={module.id} className="module-item rounded-xl border border-border bg-background overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{idx + 1}</div>
                    <div><h3 className="font-semibold text-sm">{module.title}</h3>{module.description && <p className="text-xs text-muted-foreground">{module.description}</p>}</div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 ml-4">{module.videoLessons.length} lessons</span>
                </div>
                {module.videoLessons.length > 0 && (
                  <ul className="divide-y divide-border">
                    {module.videoLessons.map(lesson => (
                      <li key={lesson.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-3"><RiLockLine className="text-muted-foreground/40 text-sm shrink-0" /><span className="text-sm">{lesson.title}</span></div>
                        <span className="text-xs text-muted-foreground shrink-0 ml-4">{formatDuration(lesson.durationInSeconds)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {module.resourceLinks.length > 0 && (
                  <div className="px-5 py-3 border-t border-border bg-muted/10">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Resources</p>
                    <div className="flex flex-wrap gap-2">
                      {module.resourceLinks.map(r => (
                        <span key={r.id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground">
                          {r.type === "PDF" ? <RiFileTextLine /> : <RiLinkM />}{r.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
