import api from "@/lib/api";
import type { ApiResponse, ContentBlockResponseDto } from "@/types";

export const cmsService = {
  getAll: () =>
    api.get<ApiResponse<ContentBlockResponseDto[]>>("/cms?activeOnly=true").then((r) => r.data),

  getByIdentifier: (identifier: string) =>
    api.get<ApiResponse<ContentBlockResponseDto>>(`/cms/${identifier}`).then((r) => r.data),
};
