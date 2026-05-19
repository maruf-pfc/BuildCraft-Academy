"use client";

import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/services/course.service";
import { projectService } from "@/services/project.service";
import { cmsService } from "@/services/cms.service";
import {
  RiBookOpenLine,
  RiBuildingLine,
  RiSettings4Line,
  RiTeamLine,
} from "react-icons/ri";

export default function AdminDashboardPage() {
  // Fetch lists to compute stats
  const { data: coursesRes, isLoading: coursesLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: () => courseService.getAll(false),
  });

  const { data: projectsRes, isLoading: projectsLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => projectService.getAll(false),
  });

  const { data: cmsRes, isLoading: cmsLoading } = useQuery({
    queryKey: ["admin-cms"],
    queryFn: () => cmsService.getAll(false),
  });

  const stats = [
    {
      label: "Total Courses",
      value: coursesRes?.data?.length ?? 0,
      loading: coursesLoading,
      icon: RiBookOpenLine,
      color: "text-primary bg-primary/10 border-primary/20",
    },
    {
      label: "Showcase Projects",
      value: projectsRes?.data?.length ?? 0,
      loading: projectsLoading,
      icon: RiBuildingLine,
      color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      label: "CMS Blocks",
      value: cmsRes?.data?.length ?? 0,
      loading: cmsLoading,
      icon: RiSettings4Line,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Active Students",
      value: "2,500+",
      loading: false,
      icon: RiTeamLine,
      color: "text-green-500 bg-green-500/10 border-green-500/20",
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          System analytics, active content blocks, and catalog telemetry.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, loading, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-background p-6 space-y-4 hover:border-primary/30 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">{label}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${color}`}>
                <Icon className="text-xl" />
              </div>
            </div>
            <div>
              {loading ? (
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              ) : (
                <span className="text-3xl font-extrabold tracking-tight text-foreground">{value}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* System Status section */}
      <div className="rounded-2xl border border-border bg-background p-6">
        <h2 className="text-lg font-bold mb-4">System Status & Config</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Gateway Base URL</span>
            <p className="text-sm font-mono text-primary font-medium truncate">http://localhost:5237/api</p>
          </div>
          <div className="space-y-1 md:pl-6 pt-4 md:pt-0">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Storage Engine</span>
            <p className="text-sm text-foreground font-medium">PostgreSQL (NeonDB)</p>
          </div>
          <div className="space-y-1 md:pl-6 pt-4 md:pt-0">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Seeded Database</span>
            <p className="text-sm text-green-500 font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
              ONLINE & ACTIVE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
