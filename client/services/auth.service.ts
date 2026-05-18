import api from "@/lib/api";
import type { ApiResponse, AuthResponseDto, LoginRequestDto, RegisterRequestDto } from "@/types";

export const authService = {
  register: (data: RegisterRequestDto) =>
    api.post<ApiResponse<AuthResponseDto>>("/auth/register", data).then((r) => r.data),

  login: (data: LoginRequestDto) =>
    api.post<ApiResponse<AuthResponseDto>>("/auth/login", data).then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post<ApiResponse<string>>("/auth/forgot-password", { email }).then((r) => r.data),
};
