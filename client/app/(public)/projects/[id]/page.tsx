"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { gsap } from "gsap";
import {
  RiArrowLeftLine,
  RiBuildingLine,
  RiCalendarLine,
  RiMapPinLine,
  RiUserLine,
  RiFlagLine,
  RiDoubleQuotesL,
  RiPlayFill,
  RiPauseFill,
  RiVolumeUpLine,
  RiVolumeMuteLine
} from "react-icons/ri";
import { projectService } from "@/services/project.service";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeImage, setActiveImage] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectService.getById(id),
    enabled: !!id,
  });

  const project = data?.data;

  useEffect(() => {
    if (project) {
      setActiveImage(project.imageUrl || "");
      gsap.fromTo(contentRef.current, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    }
  }, [project]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-[#FAFAFA]">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
        <p className="text-muted-foreground text-sm font-semibold">Loading project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4 bg-[#FAFAFA]">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <RiBuildingLine className="text-red-500 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Project Not Found</h2>
        <p className="text-muted-foreground text-sm max-w-sm mb-6">
          The project you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm"
        >
          <RiArrowLeftLine /> Back to Projects
        </Link>
      </div>
    );
  }

  // Handle secondary images list
  const galleryImages = project.secondaryImages
    ? [project.imageUrl, ...project.secondaryImages.split(",").map(img => img.trim())].filter(Boolean) as string[]
    : project.imageUrl
    ? [project.imageUrl]
    : [];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log("Video play failed:", err));
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "ongoing":
      case "running":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "upcoming":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-[#FAFAFA]">
      {/* Back Button Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
          Back to Projects Portfolio
        </Link>
      </div>

      {/* Hero Showcase (Interactive Gallery + Description) */}
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Images Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative h-[450px] rounded-3xl border border-border/80 overflow-hidden bg-muted shadow-sm">
              {activeImage ? (
                <div
                  className="w-full h-full bg-cover bg-center transition-all duration-500"
                  style={{ backgroundImage: `url(${activeImage})` }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <RiBuildingLine className="text-8xl text-primary/30" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1 rounded-md bg-primary/95 text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {project.category}
                </span>
              </div>
            </div>

            {/* Gallery Thumbs */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1 shrink-0">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === img ? "border-primary shadow-sm scale-95" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Title, Status, and Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${getStatusColor(project.status)}`}>
                {project.status || "Completed"}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
                {project.title}
              </h1>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-background space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Project Quick Facts</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: RiUserLine, label: "Client Partner", value: project.clientName },
                  { icon: RiMapPinLine, label: "Site Location", value: project.location },
                  { icon: RiBuildingLine, label: "Practice Area", value: project.category },
                  {
                    icon: RiCalendarLine,
                    label: "Completion",
                    value: project.completionDate
                      ? new Date(project.completionDate).toLocaleDateString("en-BD", { year: "numeric", month: "long" })
                      : null
                  },
                  { icon: RiFlagLine, label: "Project Status", value: project.status }
                ].map(({ icon: Icon, label, value }) =>
                  value ? (
                    <div key={label} className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="text-primary text-sm" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{label}</p>
                        <p className="text-xs font-semibold text-foreground truncate">{value}</p>
                      </div>
                    </div>
                  ) : null
                )}
              </div>

              <div className="pt-4 border-t border-border/80">
                <Link
                  href="/contact"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all shadow-sm"
                >
                  Consult Us on This Project
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Description & Video Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* About Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#1A1A1A]">Project Profile</h2>
              <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Client Testimonial / Review */}
            {project.clientReview && (
              <div className="relative p-6 rounded-2xl border border-primary/20 bg-primary/[0.02] space-y-4 overflow-hidden">
                <RiDoubleQuotesL className="absolute right-4 top-4 text-primary/10 text-7xl pointer-events-none" />
                <div className="space-y-2 relative">
                  <p className="text-sm font-medium text-foreground/90 italic leading-relaxed">
                    &ldquo;{project.clientReview}&rdquo;
                  </p>
                  {project.clientReviewerName && (
                    <div className="pt-2">
                      <h4 className="font-bold text-xs text-primary">{project.clientReviewerName}</h4>
                      <p className="text-[10px] text-muted-foreground">Client Representative</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Premium Video Showcase */}
          {project.videoUrl && (
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-2xl font-extrabold text-[#1A1A1A]">Video Walkthrough</h2>
              
              <div className="relative rounded-2xl border border-border/80 overflow-hidden bg-black shadow-md aspect-video group">
                <video
                  ref={videoRef}
                  src={project.videoUrl}
                  preload="metadata"
                  controlsList="nodownload"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  onClick={togglePlay}
                  className="w-full h-full object-cover cursor-pointer"
                />

                {/* Overlay Play/Pause Button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10 group-hover:bg-black/30 transition-all">
                  {!isPlaying && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay();
                      }}
                      className="w-14 h-14 rounded-full bg-primary/95 text-primary-foreground flex items-center justify-center shadow-lg transition-transform hover:scale-110 pointer-events-auto"
                    >
                      <RiPlayFill className="text-3xl pl-1" />
                    </button>
                  )}
                </div>

                {/* Custom Video Controls Panel (Styled, prevents downloading) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-3">
                    <button onClick={togglePlay} className="hover:text-primary transition-colors">
                      {isPlaying ? <RiPauseFill className="text-xl" /> : <RiPlayFill className="text-xl" />}
                    </button>
                    <button onClick={toggleMute} className="hover:text-primary transition-colors">
                      {isMuted ? <RiVolumeMuteLine className="text-xl" /> : <RiVolumeUpLine className="text-xl" />}
                    </button>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-black/60 px-2.5 py-1 rounded border border-primary/30">
                    VTCLBD Player
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                * Note: Video download has been disabled to protect copyright and media licensing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
