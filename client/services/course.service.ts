import api from "@/lib/api";
import type { ApiResponse, CourseResponseDto, ModuleResponseDto } from "@/types";

export const courseService = {
  getAll: (publishedOnly = true) =>
    api.get<ApiResponse<CourseResponseDto[]>>(`/course?publishedOnly=${publishedOnly}`).then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<CourseResponseDto>>(`/course/${id}`).then((r) => r.data),

  getModules: (courseId: string) =>
    api.get<ApiResponse<ModuleResponseDto[]>>(`/coursemodule/by-course/${courseId}`).then((r) => r.data),
};
