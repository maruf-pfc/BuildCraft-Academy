import api from "@/lib/api";
import type { ApiResponse, ContentBlockResponseDto } from "@/types";

export const cmsService = {
  getAll: (activeOnly = true) =>
    api.get<ApiResponse<ContentBlockResponseDto[]>>(`/cms?activeOnly=${activeOnly}`).then((r) => r.data),

  getByIdentifier: (identifier: string) =>
    api.get<ApiResponse<ContentBlockResponseDto>>(`/cms/${identifier}`).then((r) => r.data),

  create: (data: Partial<ContentBlockResponseDto>) =>
    api.post<ApiResponse<ContentBlockResponseDto>>("/cms", data).then((r) => r.data),

  update: (id: string, data: Partial<ContentBlockResponseDto>) =>
    api.put<ApiResponse<ContentBlockResponseDto>>(`/cms/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete<ApiResponse<string>>(`/cms/${id}`).then((r) => r.data),
};
