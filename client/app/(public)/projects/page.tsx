"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useQuery } from "@tanstack/react-query";
import { RiArrowRightLine, RiBuildingLine, RiSearchLine, RiMapPinLine } from "react-icons/ri";
import { projectService } from "@/services/project.service";
import type { ProjectResponseDto } from "@/types";

const categories = ["All", "Commercial Construction", "Residential Construction", "Interior Design", "Industrial Construction"];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const headerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getAll(true),
  });

  const projects: ProjectResponseDto[] = data?.data ?? [];

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.location ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  useEffect(() => {
    gsap.fromTo(headerRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" });
  }, []);

  useEffect(() => {
    if (!isLoading && filtered.length > 0) {
      gsap.fromTo(".project-card", { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" });
    }
  }, [isLoading, filtered.length, activeCategory, search]);

  return (
    <div className="min-h-screen pt-24">
      <div ref={headerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Our Portfolio</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Projects We&apos;ve Built</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            From landmark commercial towers to luxury residences — explore our consultancy and construction portfolio across Bangladesh.
          </p>
        </div>
        <div className="mt-8 relative max-w-md">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border overflow-hidden animate-pulse">
                <div className="h-52 bg-muted" />
                <div className="p-5 space-y-3"><div className="h-4 bg-muted rounded w-3/4" /><div className="h-3 bg-muted rounded w-full" /></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <RiBuildingLine className="text-6xl text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground text-sm">Try a different search or category.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> project{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="project-card group rounded-2xl border border-border overflow-hidden bg-background hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="h-52 bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: project.imageUrl ? `url(${project.imageUrl})` : undefined }}>
                    {!project.imageUrl && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <RiBuildingLine className="text-5xl text-primary/40" />
                      </div>
                    )}
                    {project.imageUrl && <div className="absolute inset-0 group-hover:bg-primary/10 transition-colors duration-300" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-md bg-primary/80 backdrop-blur-sm text-primary-foreground text-xs font-medium">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 space-y-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{project.description}</p>
                    {project.location && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                        <RiMapPinLine className="text-primary shrink-0" />{project.location}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      {project.clientName && <span className="text-xs text-muted-foreground">{project.clientName}</span>}
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary ml-auto group-hover:gap-2 transition-all">
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
