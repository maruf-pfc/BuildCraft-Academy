import api from "@/lib/api";
import type { ApiResponse, ProjectResponseDto } from "@/types";

export const projectService = {
  getAll: (publishedOnly = true) =>
    api.get<ApiResponse<ProjectResponseDto[]>>(`/project?publishedOnly=${publishedOnly}`).then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<ProjectResponseDto>>(`/project/${id}`).then((r) => r.data),
};
