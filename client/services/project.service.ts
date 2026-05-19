import api from "@/lib/api";
import type { ApiResponse, ProjectResponseDto } from "@/types";

export const projectService = {
  getAll: (publishedOnly = true) =>
    api.get<ApiResponse<ProjectResponseDto[]>>(`/project?publishedOnly=${publishedOnly}`).then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<ProjectResponseDto>>(`/project/${id}`).then((r) => r.data),

  create: (data: Partial<ProjectResponseDto>) =>
    api.post<ApiResponse<ProjectResponseDto>>("/project", data).then((r) => r.data),

  update: (id: string, data: Partial<ProjectResponseDto>) =>
    api.put<ApiResponse<ProjectResponseDto>>(`/project/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete<ApiResponse<string>>(`/project/${id}`).then((r) => r.data),
};
