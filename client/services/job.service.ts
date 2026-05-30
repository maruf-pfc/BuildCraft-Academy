import api from "@/lib/api";
import type { ApiResponse, JobResponseDto } from "@/types";

export const jobService = {
  getAll: (publishedOnly = true) =>
    api.get<ApiResponse<JobResponseDto[]>>(`/jobpost?publishedOnly=${publishedOnly}`).then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<JobResponseDto>>(`/jobpost/${id}`).then((r) => r.data),

  create: (data: Partial<JobResponseDto>) =>
    api.post<ApiResponse<JobResponseDto>>("/jobpost", data).then((r) => r.data),

  update: (id: string, data: Partial<JobResponseDto>) =>
    api.put<ApiResponse<JobResponseDto>>(`/jobpost/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete<ApiResponse<boolean>>(`/jobpost/${id}`).then((r) => r.data),
};
