"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { gsap } from "gsap";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import {
  RiArrowLeftLine,
  RiGraduationCapLine,
  RiPlayCircleLine,
  RiTimeLine,
  RiUserLine,
  RiCheckboxCircleLine,
  RiLinkM,
  RiFileTextLine,
  RiLockLine,
  RiCloseLine,
  RiShieldCheckLine
} from "react-icons/ri";
import { courseService } from "@/services/course.service";
import { paymentService } from "@/services/progress.service";
import { useAuthStore } from "@/stores/auth.store";

const enrollmentSchema = zod.object({
  paymentMethod: zod.enum(["bKash", "Nagad", "Bank Transfer"]),
  phoneNumber: zod.string().min(10, "Please enter a valid account or phone number (min 10 chars)."),
  transactionId: zod.string().min(6, "Please enter a valid Transaction ID (min 6 chars).")
});

type EnrollmentFormData = zod.infer<typeof enrollmentSchema>;

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
  const { isAuthenticated, user } = useAuthStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      paymentMethod: "bKash",
      phoneNumber: "",
      transactionId: ""
    }
  });

  const selectedPaymentMethod = watch("paymentMethod");

  const enrollMutation = useMutation({
    mutationFn: (formData: EnrollmentFormData) =>
      paymentService.requestEnrollment({
        courseId: id,
        paymentMethod: formData.paymentMethod,
        phoneNumber: formData.phoneNumber,
        transactionId: formData.transactionId,
        amount: course?.price || 0
      }),
    onSuccess: (res) => {
      toast.success(res.message || "Enrollment request submitted successfully!");
      setIsModalOpen(false);
      reset();
      router.push("/dashboard");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    }
  });

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      toast.info("Please log in to enroll.");
      router.push("/auth/login");
      return;
    }
    setIsModalOpen(true);
  };

  const onSubmit = (data: EnrollmentFormData) => {
    enrollMutation.mutate(data);
  };

  useEffect(() => {
    if (!course) return;
    gsap.fromTo(heroRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
    gsap.fromTo(
      ".module-item",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, stagger: 0.07, duration: 0.4, ease: "power2.out", delay: 0.4 }
    );
  }, [course]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4 bg-[#FAFAFA]">
        <h2 className="text-2xl font-bold mb-2">Training Program Not Found</h2>
        <Link href="/courses" className="inline-flex items-center gap-2 text-primary hover:underline">
          <RiArrowLeftLine /> Back to Trainings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-[#FAFAFA]">
      <div
        ref={heroRef}
        className="border-b border-border"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, hsl(var(--primary)/0.12), transparent)"
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <RiArrowLeftLine /> All Trainings
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-5">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                VTCLBD Professional Training
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-[#1A1A1A]">
                {course.title}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap gap-4 pt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <RiUserLine className="text-primary text-base" />
                  {course.instructorName ?? "VTCLBD Engineering Team"}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <RiPlayCircleLine className="text-primary text-base" />
                  {totalLessons} lessons
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <RiTimeLine className="text-primary text-base" />
                  {Math.round(totalDuration / 60)} min content
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <RiCheckboxCircleLine className="text-primary text-base" />
                  Certificate included
                </span>
              </div>
            </div>
            <div>
              <div className="rounded-2xl border border-border bg-background shadow-xl p-6 space-y-4 sticky top-24">
                <div className="text-xs uppercase font-extrabold tracking-widest text-muted-foreground">
                  Enrollment Fee
                </div>
                <div className="text-4xl font-extrabold text-primary">{formatPrice(course.price)}</div>
                <button
                  onClick={handleEnrollClick}
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-lg shadow-primary/15"
                >
                  Enroll Now
                </button>
                <ul className="space-y-3 text-sm text-muted-foreground pt-2">
                  {[
                    `${totalLessons} video lessons`,
                    `${Math.round(totalDuration / 60)} min content`,
                    "Practical resource templates",
                    "Official Training Certificate",
                    "Lifetime classroom access"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <RiCheckboxCircleLine className="text-primary shrink-0 text-base" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-extrabold text-[#1A1A1A] mb-8">Training Syllabus</h2>
        {modules.length === 0 ? (
          <div className="rounded-xl border border-border/80 bg-background p-12 text-center text-muted-foreground shadow-sm">
            <RiGraduationCapLine className="text-4xl mx-auto mb-3 opacity-30 animate-pulse" />
            <p className="font-semibold text-sm">Curriculum structure is currently being updated.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((module, idx) => (
              <div
                key={module.id}
                className="module-item rounded-2xl border border-border bg-background overflow-hidden shadow-sm"
              >
                <div className="flex items-center justify-between px-6 py-4 bg-muted/40 border-b border-border/60">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary text-xs font-extrabold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{module.title}</h3>
                      {module.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{module.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-semibold shrink-0 ml-4">
                    {module.videoLessons.length} lesson{module.videoLessons.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {module.videoLessons.length > 0 && (
                  <ul className="divide-y divide-border/60">
                    {module.videoLessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className="flex items-center justify-between px-6 py-3 hover:bg-muted/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <RiLockLine className="text-muted-foreground/50 text-sm shrink-0" />
                          <span className="text-sm font-medium text-foreground">{lesson.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium shrink-0 ml-4">
                          {formatDuration(lesson.durationInSeconds)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {module.resourceLinks.length > 0 && (
                  <div className="px-6 py-3.5 border-t border-border bg-muted/10">
                    <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-2.5">
                      Learning Resources
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {module.resourceLinks.map((r) => (
                        <span
                          key={r.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/80 bg-background text-xs text-muted-foreground font-medium"
                        >
                          {r.type === "PDF" ? (
                            <RiFileTextLine className="text-primary" />
                          ) : (
                            <RiLinkM className="text-primary" />
                          )}
                          {r.title}
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

      {/* Manual Payment/Enrollment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-background rounded-3xl border border-border shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <RiCloseLine className="text-xl" />
            </button>

            {/* Modal Header */}
            <div className="mb-6 space-y-2 pr-6">
              <h3 className="text-xl font-bold text-[#1A1A1A]">Request Course Enrollment</h3>
              <p className="text-xs text-muted-foreground">
                To enroll in <span className="font-semibold text-foreground">{course.title}</span>, please pay the course fee manually and submit your details.
              </p>
            </div>

            {/* Payment Guidelines */}
            <div className="p-4 rounded-2xl bg-primary/[0.03] border border-primary/20 space-y-3 mb-6">
              <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                <RiShieldCheckLine className="text-base" />
                Manual Payment Guidelines
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Please send exactly <span className="font-extrabold text-foreground">{formatPrice(course.price)}</span> to any of our official payment accounts below:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border border-border bg-background">
                  <p className="font-bold text-foreground">bKash (Merchant)</p>
                  <p className="text-muted-foreground font-semibold">01712-345678</p>
                </div>
                <div className="p-2.5 rounded-xl border border-border bg-background">
                  <p className="font-bold text-foreground">Nagad (Personal)</p>
                  <p className="text-muted-foreground font-semibold">01912-345678</p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                * For Bank Transfer, please contact our support at contact@vtclbd.com or +880 1700-000000.
              </p>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-sm">
              {/* Prefilled User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.fullName || ""}
                    className="w-full px-3.5 py-2 rounded-xl border border-border/80 bg-muted/30 text-muted-foreground font-medium text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || ""}
                    className="w-full px-3.5 py-2 rounded-xl border border-border/80 bg-muted/30 text-muted-foreground font-medium text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["bKash", "Nagad", "Bank Transfer"].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setValue("paymentMethod", method as any)}
                      className={`py-2 px-3 rounded-xl border text-center font-bold text-xs transition-all ${
                        selectedPaymentMethod === method
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="text-xs text-red-500 mt-1">{errors.paymentMethod.message}</p>
                )}
              </div>

              {/* Phone/Account Number */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Sender Phone / Account Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 017XXXXXXXX"
                  {...register("phoneNumber")}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.phoneNumber.message}</p>
                )}
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Transaction ID (TxnID)
                </label>
                <input
                  type="text"
                  placeholder="Enter the transaction reference"
                  {...register("transactionId")}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border/80 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs uppercase"
                />
                {errors.transactionId && (
                  <p className="text-xs text-red-500 mt-1">{errors.transactionId.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={enrollMutation.isPending}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-md disabled:opacity-60"
                >
                  {enrollMutation.isPending ? "Submitting Request..." : "Submit Enrollment Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
