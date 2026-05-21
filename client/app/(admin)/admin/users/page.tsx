"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  RiUserLine,
  RiShieldUserLine,
  RiGraduationCapLine,
  RiCheckLine,
  RiCloseLine,
  RiAddCircleLine,
  RiSubtractLine,
  RiBookOpenLine,
  RiMailLine,
  RiTimeLine,
  RiCloseCircleLine,
  RiDeleteBinLine,
} from "react-icons/ri";
import { userService, type UserDetailDto } from "@/services/user.service";
import { courseService } from "@/services/course.service";
import type { CourseResponseDto } from "@/types";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<UserDetailDto | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  // Queries
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => userService.getAll(),
  });

  const { data: coursesData } = useQuery({
    queryKey: ["admin-all-courses"],
    queryFn: () => courseService.getAll(false), // Fetch all courses (published and drafts)
  });

  const users: UserDetailDto[] = usersData?.data ?? [];
  const courses: CourseResponseDto[] = coursesData?.data ?? [];

  // Mutations
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      userService.updateRole(userId, role),
    onSuccess: (res) => {
      toast.success(res.message || "Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      // Update selectedUser if open
      if (selectedUser) {
        setSelectedUser((prev) => (prev ? { ...prev, role: res.data ? "Student" : prev.role } : null));
      }
    },
    onError: (err: any) => toast.error(err.response?.data?.message || err.message || "Failed to update role"),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      userService.toggleStatus(userId, isActive),
    onSuccess: (res) => {
      toast.success(res.message || "Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || err.message || "Failed to update status"),
  });

  const enrollMutation = useMutation({
    mutationFn: ({ userId, courseId }: { userId: string; courseId: string }) =>
      userService.enroll(userId, courseId),
    onSuccess: (res) => {
      toast.success("User enrolled successfully 🎉");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      // Refresh the modal state
      userService.getAll().then((freshRes) => {
        const freshUsers = freshRes.data;
        if (freshUsers && selectedUser) {
          const updated = freshUsers.find((u) => u.id === selectedUser.id);
          if (updated) setSelectedUser(updated);
        }
      });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || err.message || "Failed to enroll user"),
  });

  const unenrollMutation = useMutation({
    mutationFn: ({ userId, courseId }: { userId: string; courseId: string }) =>
      userService.unenroll(userId, courseId),
    onSuccess: (res) => {
      toast.success("User unenrolled successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      // Refresh the modal state
      userService.getAll().then((freshRes) => {
        const freshUsers = freshRes.data;
        if (freshUsers && selectedUser) {
          const updated = freshUsers.find((u) => u.id === selectedUser.id);
          if (updated) setSelectedUser(updated);
        }
      });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || err.message || "Failed to unenroll user"),
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => userService.delete(userId),
    onSuccess: () => {
      toast.success("User deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || err.message || "Failed to delete user"),
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  const handleStatusToggle = (userId: string, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ userId, isActive: !currentStatus });
  };

  const openEnrollmentModal = (user: UserDetailDto) => {
    setSelectedUser(user);
    setShowEnrollModal(true);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Title Block */}
      <div>
        <h1 className="text-2xl font-bold">User & Student Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review registrants, assign Student or Administrator roles, manage manual course enrollments, and toggle user active states.
        </p>
      </div>

      {loadingUsers ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-border p-6 flex gap-4 animate-pulse bg-background">
              <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-background max-w-lg mx-auto">
          <RiUserLine className="text-5xl text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No Users Found</h3>
          <p className="text-sm text-muted-foreground">Register new users to display them here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <th className="p-4">User Details</th>
                <th className="p-4">Role Assignment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Enrolled Trainings</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {users.map((user) => {
                const isStudent = user.role === "Student";
                const isAdmin = user.role === "Admin";

                return (
                  <tr key={user.id} className="hover:bg-muted/5 transition-all">
                    {/* User Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${isAdmin ? "bg-red-500/10 border-red-500/20 text-red-500" : isStudent ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {isAdmin ? <RiShieldUserLine className="text-xl" /> : isStudent ? <RiGraduationCapLine className="text-xl" /> : <RiUserLine className="text-lg" />}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{user.fullName || "Unnamed User"}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <RiMailLine /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Dropdown */}
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updateRoleMutation.isPending}
                        className="px-2.5 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                      >
                        <option value="User">User</option>
                        <option value="Student">Student</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>

                    {/* Active/Inactive Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleStatusToggle(user.id, user.isActive)}
                        disabled={toggleStatusMutation.isPending}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${user.isActive ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"}`}
                      >
                        {user.isActive ? (
                          <>
                            <RiCheckLine className="text-sm" /> Active
                          </>
                        ) : (
                          <>
                            <RiCloseLine className="text-sm" /> Inactive
                          </>
                        )}
                      </button>
                    </td>

                    {/* Enrollments Info */}
                    <td className="p-4">
                      {user.enrolledCourses.length === 0 ? (
                        <span className="text-xs text-muted-foreground">No active enrollments</span>
                      ) : (
                        <div className="flex flex-col gap-1 max-w-[200px]">
                          {user.enrolledCourses.map((c) => (
                            <span key={c.courseId} className="inline-block truncate bg-muted px-2 py-0.5 rounded text-[11px] font-medium border border-border/40 text-muted-foreground" title={c.courseTitle}>
                              📘 {c.courseTitle}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Manage Enrollment Action */}
                    <td className="p-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEnrollmentModal(user)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold hover:bg-muted transition-all"
                        >
                          <RiBookOpenLine /> Manage Courses
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to permanently delete ${user.fullName || user.email}? This action cannot be undone.`)) {
                              deleteMutation.mutate(user.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 border border-border hover:border-destructive/20 rounded-xl transition-all"
                          title="Delete User"
                        >
                          <RiDeleteBinLine className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Manual Course Enrollment Modal */}
      {showEnrollModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-background p-6 space-y-6 shadow-2xl animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-bold text-lg text-foreground">Manage Enrollments</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update courses for <span className="font-bold text-primary">{selectedUser.fullName}</span> ({selectedUser.email})
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEnrollModal(false);
                  setSelectedUser(null);
                }}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                <RiCloseCircleLine className="text-2xl" />
              </button>
            </div>

            {/* Modal Content - List of Courses with Enroll/Unenroll buttons */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {courses.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-6">No courses available in system.</p>
              ) : (
                courses.map((course) => {
                  const isEnrolled = selectedUser.enrolledCourses.some((c) => c.courseId === course.id);
                  const isPendingEnroll = enrollMutation.isPending;
                  const isPendingUnenroll = unenrollMutation.isPending;

                  return (
                    <div key={course.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10 hover:border-primary/20 transition-all">
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-foreground truncate">{course.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Instructor: {course.instructorName}</p>
                      </div>
                      <div className="shrink-0 ml-4">
                        {isEnrolled ? (
                          <button
                            onClick={() => unenrollMutation.mutate({ userId: selectedUser.id, courseId: course.id })}
                            disabled={isPendingUnenroll}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 text-xs font-semibold border border-red-500/20 transition-all"
                          >
                            <RiSubtractLine /> Remove Course
                          </button>
                        ) : (
                          <button
                            onClick={() => enrollMutation.mutate({ userId: selectedUser.id, courseId: course.id })}
                            disabled={isPendingEnroll}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold border border-primary/20 transition-all"
                          >
                            <RiAddCircleLine /> Assign Course
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-4 border-t border-border">
              <button
                onClick={() => {
                  setShowEnrollModal(false);
                  setSelectedUser(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-muted transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
