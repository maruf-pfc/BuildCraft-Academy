"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  RiBuildingLine,
  RiAddLine,
  RiDeleteBinLine,
  RiCheckDoubleLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import { projectService } from "@/services/project.service";
import type { ProjectResponseDto } from "@/types";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  category: z.string().min(2, "Category must be specified"),
  clientName: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
  isPublished: z.boolean(),
});

type ProjectForm = z.infer<typeof schema>;

export default function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectForm>({
    resolver: zodResolver(schema),
    defaultValues: { isPublished: false }
  });

  // Fetch all projects (including draft/unpublished)
  const { data, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => projectService.getAll(false),
  });

  const projects: ProjectResponseDto[] = data?.data ?? [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: ProjectForm) => projectService.create(data),
    onSuccess: () => {
      toast.success("Project blueprint created!");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      reset();
      setShowAddForm(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Showcase Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Publish site showcase projects, manage descriptions, clients, and specifications.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
        >
          <RiAddLine /> Create Project
        </button>
      </div>

      {/* Create form */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit((d) => createMutation.mutate(d))}
          className="rounded-2xl border border-border bg-background p-6 space-y-4 shadow-sm max-w-2xl"
        >
          <h3 className="font-bold text-base border-b border-border pb-2">New Portfolio Project</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Project Title</label>
              <input
                type="text"
                {...register("title")}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Category</label>
              <input
                type="text"
                placeholder="e.g. Commercial Construction"
                {...register("category")}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Location</label>
              <input
                type="text"
                placeholder="e.g. Dhaka, Bangladesh"
                {...register("location")}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Client Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Client Name</label>
              <input
                type="text"
                placeholder="e.g. Ananta Group"
                {...register("clientName")}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Image URL</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                {...register("imageUrl")}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
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
              {createMutation.isPending ? "Creating..." : "Save Project"}
            </button>
          </div>
        </form>
      )}

      {/* Projects list */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-border p-6 flex gap-4 animate-pulse bg-background">
              <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-background max-w-lg mx-auto">
          <RiBuildingLine className="text-5xl text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold text-lg">No showcase projects</h3>
          <p className="text-sm text-muted-foreground">Populate showcase project portfolios for visitors to view.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-border bg-background p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/30 transition-all"
            >
              <div className="flex gap-4 items-center min-w-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${project.isPublished ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-muted/80 border-border text-muted-foreground/50"}`}>
                  {project.isPublished ? <RiCheckDoubleLine className="text-xl animate-pulse" /> : <RiErrorWarningLine className="text-lg" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-foreground truncate">{project.title}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase shrink-0 ${project.isPublished ? "bg-green-500/10 border-green-500/25 text-green-500" : "bg-muted border-border text-muted-foreground"}`}>
                      {project.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{project.category} {project.location ? `• ${project.location}` : ""}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this project?")) {
                      deleteMutation.mutate(project.id);
                    }
                  }}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 border border-border hover:border-destructive/20 rounded-xl transition-all"
                  title="Delete Project"
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
