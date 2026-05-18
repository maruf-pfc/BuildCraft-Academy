import api from "@/lib/api";
import type { ApiResponse, CourseProgressResponseDto, CertificateResponseDto } from "@/types";

export const progressService = {
  markComplete: (lessonId: string) =>
    api.post("/progress/mark-complete", { lessonId }).then((r) => r.data),

  getCourseProgress: (courseId: string) =>
    api.get<ApiResponse<CourseProgressResponseDto>>(`/progress/course/${courseId}`).then((r) => r.data),

  getCertificate: (courseId: string) =>
    api.get<ApiResponse<CertificateResponseDto>>(`/progress/certificate/${courseId}`).then((r) => r.data),
};

export const paymentService = {
  payDummy: (courseId: string) =>
    api.post("/payment/pay-dummy", { courseId }).then((r) => r.data),
};
