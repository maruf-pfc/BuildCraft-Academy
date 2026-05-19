"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  RiArrowLeftLine,
  RiPlayCircleLine,
  RiCheckboxCircleLine,
  RiCheckboxBlankCircleLine,
  RiLinkM,
  RiFileTextLine,
  RiMedalLine,
  RiArrowRightLine,
} from "react-icons/ri";
import { courseService } from "@/services/course.service";
import { progressService } from "@/services/progress.service";

export default function LearnPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Fetch Course details
  const { data: courseRes, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseService.getById(courseId),
    enabled: !!courseId,
  });

  // Fetch Modules + Lessons
  const { data: modulesRes, isLoading: modulesLoading } = useQuery({
    queryKey: ["course-modules", courseId],
    queryFn: () => courseService.getModules(courseId),
    enabled: !!courseId,
  });

  // Fetch Live Progress
  const { data: progressRes, isLoading: progressLoading } = useQuery({
    queryKey: ["progress", courseId],
    queryFn: () => progressService.getCourseProgress(courseId),
    enabled: !!courseId,
  });

  const course = courseRes?.data;
  const modules = modulesRes?.data ?? [];
  const progress = progressRes?.data;

  // Flatten lessons for navigation
  const allLessons = modules.flatMap((m) => m.videoLessons);
  const activeLesson = allLessons.find((l) => l.id === activeLessonId) || allLessons[0];

  // Set initial active lesson
  useEffect(() => {
    if (allLessons.length > 0 && !activeLessonId) {
      setActiveLessonId(allLessons[0].id);
    }
  }, [allLessons, activeLessonId]);

  // Mutation to mark lesson completed
  const completeMutation = useMutation({
    mutationFn: (lessonId: string) => progressService.markComplete(lessonId),
    onSuccess: (res) => {
      toast.success("Progress saved!");
      queryClient.invalidateQueries({ queryKey: ["progress", courseId] });
      queryClient.invalidateQueries({ queryKey: ["certificate", courseId] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to save progress");
    },
  });

  if (courseLoading || modulesLoading || progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading classrooms...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
        <h2 className="text-2xl font-bold mb-2">Classroom Not Found</h2>
        <Link href="/dashboard" className="text-primary hover:underline flex items-center gap-2">
          <RiArrowLeftLine /> Back to Dashboard
        </Link>
      </div>
    );
  }

  // Find if active lesson is completed
  const completedLessonIds = progress?.completedLessonIds || [];
  const isLessonCompleted = activeLessonId ? completedLessonIds.includes(activeLessonId) : false;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header Bar */}
      <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between z-30 shrink-0 sticky top-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <RiArrowLeftLine className="text-xl" />
          </Link>
          <div className="min-w-0">
            <h1 className="font-bold text-sm sm:text-base truncate">{course.title}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Learning Dashboard</p>
          </div>
        </div>

        {/* Progress Bar & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end gap-1">
            <span className="text-xs font-semibold">{Math.round(progress?.progressPercentage ?? 0)}% Complete</span>
            <div className="w-36 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress?.progressPercentage ?? 0}%` }}
              />
            </div>
          </div>

          {progress?.isCourseCompleted ? (
            <Link
              href="/dashboard/certificates"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-all shadow-md shadow-amber-500/10 animate-bounce"
            >
              <RiMedalLine className="text-sm" /> Claim Certificate
            </Link>
          ) : (
            <div className="text-xs text-muted-foreground border border-border px-3 py-1.5 rounded-lg bg-muted/40 font-medium">
              {progress?.completedLessons}/{progress?.totalLessons} Completed
            </div>
          )}
        </div>
      </header>

      {/* Main split dashboard layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        
        {/* Left: Video Player & Details */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeLesson ? (
            <>
              {/* Premium Video Embed */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-border shadow-xl">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                  title={activeLesson.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Title & mark complete button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                <div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-widest">Lesson {activeLesson.order}</span>
                  <h2 className="text-xl sm:text-2xl font-bold mt-1">{activeLesson.title}</h2>
                </div>
                <button
                  disabled={isLessonCompleted || completeMutation.isPending}
                  onClick={() => completeMutation.mutate(activeLesson.id)}
                  className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    isLessonCompleted
                      ? "bg-green-500/10 text-green-600 border border-green-500/20 cursor-default"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10 hover:shadow-primary/20"
                  }`}
                >
                  {isLessonCompleted ? (
                    <>
                      <RiCheckboxCircleLine className="text-base" /> Completed
                    </>
                  ) : completeMutation.isPending ? (
                    "Saving..."
                  ) : (
                    <>
                      Mark as Complete
                    </>
                  )}
                </button>
              </div>

              {/* Description & Resources */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-bold text-lg">About this lesson</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Welcome to this module. In this section, we study core workflows, expert blueprints, and practical execution checklists for the topic.
                  </p>
                </div>

                {/* Resource Materials list */}
                <div className="rounded-2xl border border-border p-5 bg-muted/20 space-y-4 h-fit">
                  <h4 className="font-semibold text-sm">Downloadable Resources</h4>
                  <div className="space-y-2">
                    {[
                      { title: "Course Blueprint.pdf", type: "PDF" },
                      { title: "Reference Blueprint.dwg", type: "CAD" },
                    ].map((res, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-2 min-w-0">
                          {res.type === "PDF" ? <RiFileTextLine className="text-primary shrink-0" /> : <RiLinkM className="text-primary shrink-0" />}
                          <span className="text-xs font-medium truncate group-hover:text-primary transition-colors">{res.title}</span>
                        </div>
                        <RiArrowRightLine className="text-muted-foreground text-sm shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Please select a lesson to start learning.
            </div>
          )}
        </div>

        {/* Right: Curriculum Navigation Sidebar */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border bg-muted/10 overflow-y-auto shrink-0 flex flex-col h-[50vh] lg:h-auto">
          <div className="p-4 border-b border-border bg-background shrink-0">
            <h3 className="font-bold text-sm">Course Curriculum</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{allLessons.length} lessons inside modules</p>
          </div>

          <div className="flex-1 divide-y divide-border/60">
            {modules.map((module, mIdx) => (
              <div key={module.id} className="p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {mIdx + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs leading-tight">{module.title}</h4>
                    {module.description && <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">{module.description}</p>}
                  </div>
                </div>

                <ul className="space-y-1.5 pl-7">
                  {module.videoLessons.map((lesson) => {
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const isActive = lesson.id === activeLessonId;

                    return (
                      <li key={lesson.id}>
                        <button
                          onClick={() => setActiveLessonId(lesson.id)}
                          className={`w-full text-left p-2.5 rounded-lg text-xs font-medium flex items-center justify-between gap-3 border transition-all ${
                            isActive
                              ? "bg-background border-primary text-primary shadow-sm"
                              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-background/40"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <RiPlayCircleLine className="text-sm shrink-0" />
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          {isCompleted ? (
                            <RiCheckboxCircleLine className="text-green-500 text-sm shrink-0" />
                          ) : (
                            <RiCheckboxBlankCircleLine className="text-muted-foreground/30 text-sm shrink-0" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
