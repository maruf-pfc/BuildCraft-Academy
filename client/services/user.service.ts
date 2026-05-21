import api from "@/lib/api";
import type { ApiResponse, CourseResponseDto } from "@/types";

export interface UserEnrollmentDto {
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
}

export interface UserDetailDto {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  enrolledCourses: UserEnrollmentDto[];
}

export const userService = {
  getAll: () =>
    api.get<ApiResponse<UserDetailDto[]>>("/user").then((r) => r.data),

  updateRole: (userId: string, role: string) =>
    api.put<ApiResponse<boolean>>(`/user/${userId}/role`, { role }).then((r) => r.data),

  toggleStatus: (userId: string, isActive: boolean) =>
    api.patch<ApiResponse<boolean>>(`/user/${userId}/status`, { isActive }).then((r) => r.data),

  enroll: (userId: string, courseId: string) =>
    api.post<ApiResponse<boolean>>(`/user/${userId}/enroll`, { courseId }).then((r) => r.data),

  unenroll: (userId: string, courseId: string) =>
    api.post<ApiResponse<boolean>>(`/user/${userId}/unenroll`, { courseId }).then((r) => r.data),

  delete: (userId: string) =>
    api.delete<ApiResponse<boolean>>(`/user/${userId}`).then((r) => r.data),
};
