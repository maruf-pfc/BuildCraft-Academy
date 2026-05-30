"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gsap } from "gsap";
import { jobService } from "@/services/job.service";
import type { JobResponseDto } from "@/types";
import {
  RiBriefcaseLine,
  RiMapPin2Line,
  RiMoneyDollarCircleLine,
  RiSearchLine,
  RiCloseLine,
  RiArrowRightUpLine,
  RiCheckDoubleLine,
  RiShieldUserLine,
} from "react-icons/ri";

export default function CareerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [activeJob, setActiveJob] = useState<JobResponseDto | null>(null);

  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ["publicJobs"],
    queryFn: () => jobService.getAll(true),
  });

  const jobs: JobResponseDto[] = apiResponse?.data || [];

  // Filter logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "All" || job.department === selectedDept;
    const matchesType = selectedType === "All" || job.jobType === selectedType;
    return matchesSearch && matchesDept && matchesType;
  });

  // Extract unique departments and types for filters
  const departments = ["All", ...Array.from(new Set(jobs.map((j) => j.department)))];
  const jobTypes = ["All", ...Array.from(new Set(jobs.map((j) => j.jobType)))];

  // GSAP animations when jobs are loaded
  useEffect(() => {
    if (!isLoading && filteredJobs.length > 0) {
      gsap.fromTo(
        ".job-card-anim",
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, [isLoading, filteredJobs.length]);

  return (
    <div className="space-y-16 py-16 min-h-screen bg-background">
      {/* ── Hero section ──────────────────────────────────────────────────── */}
      <section
        className="relative pt-24 pb-8 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, hsl(var(--primary) / 0.12), transparent)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider">
            We Are Hiring
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-heading">
            Join Our Team &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Build the Future
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
            Explore open opportunities in architecture, structural engineering, site management, and interior planning. Be part of Bangladesh’s rising construction consultant firm.
          </p>
        </div>
      </section>

      {/* ── Search & Filter Controls ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground pointer-events-none">
                <RiSearchLine className="text-lg" />
              </span>
              <input
                type="text"
                placeholder="Search open roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground transition-all"
              />
            </div>

            {/* Department Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all"
              >
                <option value="All">All Departments</option>
                {departments.filter(d => d !== "All").map((dept, i) => (
                  <option key={i} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* JobType Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground transition-all"
              >
                <option value="All">All Job Types</option>
                {jobTypes.filter(t => t !== "All").map((type, i) => (
                  <option key={i} value={type}>{type}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* ── Careers Grid / Loader ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl border border-border p-6 bg-card space-y-4 animate-pulse">
                <div className="h-5 w-2/3 bg-muted rounded" />
                <div className="h-4 w-1/3 bg-muted rounded" />
                <div className="space-y-2 py-4">
                  <div className="h-3 w-full bg-muted rounded" />
                  <div className="h-3 w-5/6 bg-muted rounded" />
                </div>
                <div className="h-10 w-full bg-muted rounded-xl" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center max-w-xl mx-auto space-y-4">
            <h3 className="font-bold text-lg text-red-500">Failed to fetch careers</h3>
            <p className="text-sm text-muted-foreground">There was an unexpected error retrieving active jobs listings. Please refresh the page or try again later.</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center max-w-xl mx-auto space-y-4">
            <RiBriefcaseLine className="text-5xl text-muted-foreground/60 mx-auto" />
            <h3 className="font-bold text-lg text-heading">No open positions found</h3>
            <p className="text-sm text-muted-foreground">We couldn&apos;t find any roles matching your current search parameters. Browse our other categories or check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="job-card-anim rounded-2xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/40 hover:shadow-lg transition-all group duration-300 relative overflow-hidden"
              >
                {/* Visual glow indicator */}
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-all duration-300" />
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                      {job.department}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                      {job.jobType}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-heading group-hover:text-primary transition-colors duration-200 line-clamp-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <RiMapPin2Line /> <span>{job.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {job.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-border mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-semibold text-heading">
                    <RiMoneyDollarCircleLine className="text-base text-secondary" />
                    <span>{job.salaryRange}</span>
                  </div>

                  <button
                    onClick={() => setActiveJob(job)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-secondary transition-colors duration-200"
                  >
                    <span>View Details</span>
                    <RiArrowRightUpLine className="text-base group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Details modal dialog ────────────────────────────────────────────── */}
      {activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <div
            onClick={() => setActiveJob(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Card */}
          <div className="relative bg-card rounded-3xl border border-border w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] z-10 animate-in fade-in-50 zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5 relative">
              <button
                onClick={() => setActiveJob(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-card border border-border hover:border-primary/20 text-muted-foreground hover:text-primary transition-all shadow-sm"
              >
                <RiCloseLine className="text-xl" />
              </button>

              <div className="space-y-3 pr-10">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    {activeJob.department}
                  </span>
                  <span className="px-3 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                    {activeJob.jobType}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-heading">
                  {activeJob.title}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <RiMapPin2Line /> <span>{activeJob.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <RiMoneyDollarCircleLine className="text-base text-secondary" /> <span>{activeJob.salaryRange}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Body (Scrollable) */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-grow">
              
              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-heading uppercase tracking-widest flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Job Description
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {activeJob.description}
                </p>
              </div>

              {/* Requirements */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-heading uppercase tracking-widest flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> Job Requirements
                </h4>
                <div className="rounded-2xl border border-border bg-muted/30 p-5">
                  <ul className="space-y-2.5">
                    {activeJob.requirements.split("\n").filter((r) => r.trim().length > 0).map((req, i) => (
                      <li key={i} className="flex gap-2.5 items-start text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        <RiCheckDoubleLine className="text-secondary shrink-0 text-lg mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Footer Apply CTA */}
            <div className="p-6 border-t border-border bg-muted/20 flex flex-wrap gap-4 items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RiShieldUserLine className="text-lg text-primary" />
                <span>Your privacy is protected under our recruiting policy.</span>
              </div>

              <a
                href={activeJob.googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-xl bg-primary hover:opacity-95 text-primary-foreground font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-200"
              >
                <span>Apply Now</span>
                <RiArrowRightUpLine className="text-base" />
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
