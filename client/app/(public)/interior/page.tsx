"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useQuery } from "@tanstack/react-query";
import { RiArrowRightLine, RiBuildingLine, RiSearchLine, RiMapPinLine, RiPaletteLine } from "react-icons/ri";
import { projectService } from "@/services/project.service";
import type { ProjectResponseDto } from "@/types";

export default function InteriorPage() {
  const [search, setSearch] = useState("");
  const headerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getAll(true),
  });

  const projects: ProjectResponseDto[] = data?.data ?? [];

  // Filter projects Strictly by Category === "Design" and search query
  const filtered = projects.filter((p) => {
    const isDesign = p.category?.toLowerCase() === "design";
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.location ?? "").toLowerCase().includes(search.toLowerCase());
    return isDesign && matchesSearch;
  });

  useEffect(() => {
    gsap.fromTo(headerRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" });
  }, []);

  useEffect(() => {
    if (!isLoading && filtered.length > 0) {
      gsap.fromTo(
        ".interior-card",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [isLoading, filtered.length, search]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200/60";
      case "ongoing":
      case "running":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "upcoming":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-[#FAFAFA]">
      {/* Header section */}
      <div ref={headerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <RiPaletteLine className="text-sm" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Premium Interior Studio</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1A1A1A] leading-tight">
            Sophisticated Interior Architecture
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Explore our custom spatial planning, interior styling, and luxury renovations. We turn blank canvases into award-winning spaces.
          </p>
        </div>

        {/* Search controls */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center border-b border-border/60 pb-6">
          <h2 className="text-lg font-bold text-[#1A1A1A]">Featured Spaces Portfolio</h2>
          <div className="relative w-full sm:max-w-sm">
            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80 text-base" />
            <input
              type="text"
              placeholder="Search interior designs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/80 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>

      {/* Projects list */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border overflow-hidden bg-background animate-pulse">
                <div className="h-56 bg-muted" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-background rounded-3xl border border-border/50 shadow-sm max-w-3xl mx-auto px-6">
            <RiBuildingLine className="text-6xl text-muted-foreground/30 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-foreground mb-2">No interior projects found</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              We couldn&apos;t find any interior spaces matching your search query. Check back later or try another term!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-sm text-muted-foreground font-medium">
                Showcasing <span className="font-bold text-foreground">{filtered.length}</span> signature space{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="interior-card group rounded-2xl border border-border/80 overflow-hidden bg-background hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col shadow-sm"
                >
                  {/* Project Image */}
                  <div className="h-56 bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: project.imageUrl ? `url(${project.imageUrl})` : undefined }}>
                    {!project.imageUrl && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <RiBuildingLine className="text-5xl text-primary/30" />
                      </div>
                    )}
                    {project.imageUrl && <div className="absolute inset-0 group-hover:bg-primary/5 transition-colors duration-300" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full border text-xs font-bold shadow-sm ${getStatusColor(project.status)}`}>
                        {project.status || "Completed"}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="px-2.5 py-1 rounded-md bg-primary/95 text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                        Interior Architecture
                      </span>
                      <h3 className="font-bold text-white text-lg mt-2 drop-shadow-md group-hover:text-primary transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-grow">
                      {project.description}
                    </p>

                    {project.location && (
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <RiMapPinLine className="text-primary text-sm shrink-0" />
                        {project.location}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border/80">
                      {project.clientName && (
                        <div className="text-xs">
                          <span className="text-muted-foreground">Client Partner: </span>
                          <span className="font-semibold text-foreground line-clamp-1 inline-block">{project.clientName}</span>
                        </div>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary ml-auto group-hover:gap-2.5 transition-all">
                        View Details <RiArrowRightLine />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
