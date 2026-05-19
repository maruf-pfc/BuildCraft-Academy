"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  RiBookOpenLine,
  RiAddLine,
  RiDeleteBinLine,
  RiCheckDoubleLine,
  RiCheckLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import { courseService } from "@/services/course.service";
import type { CourseResponseDto } from "@/types";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  instructorName: z.string().min(2, "Instructor name must be at least 2 characters"),
  isPublished: z.boolean(),
});

type CourseForm = z.infer<typeof schema>;

export default function AdminCoursesPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CourseForm>({
    resolver: zodResolver(schema),
    defaultValues: { isPublished: false }
  });

  // Query Courses (Admin gets both published and draft courses)
  const { data, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: () => courseService.getAll(false),
  });

  const courses: CourseResponseDto[] = data?.data ?? [];

  // Create Course Mutation
  const createMutation = useMutation({
    mutationFn: (data: CourseForm) => courseService.create(data),
    onSuccess: () => {
      toast.success("Course created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      reset();
      setShowAddForm(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Delete Course Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseService.delete(id),
    onSuccess: () => {
      toast.success("Course deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Courses</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create courses, toggle publish state, or remove records.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
        >
          <RiAddLine /> Create Course
        </button>
      </div>

      {/* Add Form Container */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit((d) => createMutation.mutate(d))}
          className="rounded-2xl border border-border bg-background p-6 space-y-4 shadow-sm max-w-2xl"
        >
          <h3 className="font-bold text-base border-b border-border pb-2">New Course Blueprint</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Title</label>
              <input
                type="text"
                {...register("title")}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            {/* Instructor Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Instructor Name</label>
              <input
                type="text"
                {...register("instructorName")}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {errors.instructorName && <p className="text-xs text-destructive">{errors.instructorName.message}</p>}
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Price (BDT)</label>
              <input
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center gap-2 pt-6">
              <input
                id="isPublished"
                type="checkbox"
                {...register("isPublished")}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
              />
              <label htmlFor="isPublished" className="text-xs font-semibold text-muted-foreground cursor-pointer">
                Publish immediately
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Description</label>
            <textarea
              rows={3}
              {...register("description")}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="flex gap-2 pt-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-muted transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/15"
            >
              {createMutation.isPending ? "Creating..." : "Save Course"}
            </button>
          </div>
        </form>
      )}

      {/* Courses List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-border p-6 flex gap-4 animate-pulse bg-background">
              <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-background max-w-lg mx-auto">
          <RiBookOpenLine className="text-5xl text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No courses exist</h3>
          <p className="text-sm text-muted-foreground">Get started by creating your very first course.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl border border-border bg-background p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/30 transition-all"
            >
              <div className="flex gap-4 items-center min-w-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${course.isPublished ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-muted/80 border-border text-muted-foreground/50"}`}>
                  {course.isPublished ? <RiCheckDoubleLine className="text-xl animate-pulse" /> : <RiErrorWarningLine className="text-lg" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-foreground truncate">{course.title}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase shrink-0 ${course.isPublished ? "bg-green-500/10 border-green-500/25 text-green-500" : "bg-muted border-border text-muted-foreground"}`}>
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{course.instructorName}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this course?")) {
                      deleteMutation.mutate(course.id);
                    }
                  }}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 border border-border hover:border-destructive/20 rounded-xl transition-all"
                  title="Delete Course"
                >
                  <RiDeleteBinLine className="text-base" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
