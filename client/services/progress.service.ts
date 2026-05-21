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
  requestEnrollment: (data: {
    courseId: string;
    paymentMethod: string;
    transactionId: string;
    phoneNumber: string;
    amount: number;
  }) => api.post<ApiResponse<any>>("/payment/enroll-request", data).then((r) => r.data),

  getAllPayments: () =>
    api.get<ApiResponse<any[]>>("/payment").then((r) => r.data),

  approvePayment: (paymentId: string) =>
    api.post<ApiResponse<boolean>>(`/payment/approve/${paymentId}`).then((r) => r.data),
};
