// ─────────────────────────────────────────────────────────────────────────────
// Global API Response wrapper (matches backend ApiResponse<T>)
// ─────────────────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────────────────────
export interface AuthResponseDto {
  token: string;
  email: string;
  fullName: string;
  role: "Admin" | "Student" | "User";
}

export interface RegisterRequestDto {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Courses
// ─────────────────────────────────────────────────────────────────────────────
export interface CourseResponseDto {
  id: string;
  title: string;
  description: string;
  price: number;
  videoUrl?: string;
  instructorName?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Course Modules & Lessons
// ─────────────────────────────────────────────────────────────────────────────
export interface VideoLessonSummaryDto {
  id: string;
  title: string;
  order: number;
  durationInSeconds: number;
  isPublished: boolean;
}

export interface ResourceLinkDto {
  id: string;
  title: string;
  url: string;
  type: string;
}

export interface ModuleResponseDto {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
  videoLessons: VideoLessonSummaryDto[];
  resourceLinks: ResourceLinkDto[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress & Certificates
// ─────────────────────────────────────────────────────────────────────────────
export interface ModuleProgressDto {
  moduleId: string;
  moduleTitle: string;
  totalLessons: number;
  completedLessons: number;
  isModuleCompleted: boolean;
}

export interface CourseProgressResponseDto {
  courseId: string;
  courseTitle: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  isCourseCompleted: boolean;
  modules: ModuleProgressDto[];
}

export interface CertificateResponseDto {
  id: string;
  certificateNumber: string;
  studentName: string;
  courseTitle: string;
  issuedAt: string;
  certificateUrl?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────────────────────
export interface ProjectResponseDto {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category?: string;
  clientName?: string;
  location?: string;
  completionDate?: string;
  isPublished: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CMS
// ─────────────────────────────────────────────────────────────────────────────
export interface ContentBlockResponseDto {
  id: string;
  identifier: string;
  content: string;
  type: string;
  isActive: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Payment
// ─────────────────────────────────────────────────────────────────────────────
export interface PaymentResponseDto {
  transactionId: string;
  status: string;
  message: string;
  isEnrolled: boolean;
}
