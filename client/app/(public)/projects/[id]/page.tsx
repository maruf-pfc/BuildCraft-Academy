"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { gsap } from "gsap";
import { RiArrowLeftLine, RiBuildingLine, RiCalendarLine, RiMapPinLine, RiUserLine } from "react-icons/ri";
import { projectService } from "@/services/project.service";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const contentRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectService.getById(id),
    enabled: !!id,
  });

  const project = data?.data;

  useEffect(() => {
    if (!project) return;
    gsap.fromTo(contentRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
  }, [project]);

  if (isLoading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
      <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:underline"><RiArrowLeftLine />Back to Projects</Link>
    </div>
  );

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Image */}
      <div className="relative h-[50vh] bg-muted overflow-hidden">
        {project.imageUrl ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${project.imageUrl})` }}>
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <RiBuildingLine className="text-8xl text-primary/30" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-primary/80 backdrop-blur text-primary-foreground text-xs font-medium">
            {project.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 drop-shadow-lg">
            {project.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <RiArrowLeftLine />All Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About This Project</h2>
            <p className="text-muted-foreground leading-relaxed text-base">{project.description}</p>
          </div>

          {/* Meta Card */}
          <div className="rounded-2xl border border-border bg-background p-6 space-y-5 h-fit">
            <h3 className="font-semibold">Project Details</h3>
            {[
              { icon: RiUserLine, label: "Client", value: project.clientName },
              { icon: RiMapPinLine, label: "Location", value: project.location },
              { icon: RiBuildingLine, label: "Category", value: project.category },
              {
                icon: RiCalendarLine, label: "Completed",
                value: project.completionDate ? new Date(project.completionDate).toLocaleDateString("en-BD", { year: "numeric", month: "long" }) : null,
              },
            ].map(({ icon: Icon, label, value }) =>
              value ? (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="text-primary text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                </div>
              ) : null
            )}

            <div className="pt-4 border-t border-border">
              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
              >
                Enquire About This Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
