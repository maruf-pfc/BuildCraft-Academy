"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  RiArrowRightLine,
  RiArrowLeftLine,
  RiBuildingLine,
  RiGraduationCapLine,
  RiMedalLine,
  RiTeamLine,
  RiPlayCircleLine,
  RiServiceLine,
  RiDoubleQuotesL,
  RiCloseLine,
} from "react-icons/ri";
import { courseService } from "@/services/course.service";
import { projectService } from "@/services/project.service";
import type { CourseResponseDto, ProjectResponseDto } from "@/types";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CmsContent } from "@/components/cms-content";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(price);
}

const stats = [
  { label: "Completed Projects", value: "50+", icon: RiBuildingLine },
  { label: "Running Projects", value: "12+", icon: RiServiceLine },
  { label: "Students Trained", value: "2,500+", icon: RiTeamLine },
  { label: "Professional Instructors", value: "10+", icon: RiGraduationCapLine },
  { label: "Technical Courses", value: "15+", icon: RiMedalLine },
];

const services = [
  {
    title: "Architectural Design",
    description: "Modern space planning, 2D/3D visualization, and aesthetic layouts tailored for residential and commercial landmarks.",
    details: "Our architectural layouts prioritize natural daylight, efficient zoning, and sustainable materials. We handle everything from concept design and zoning permissions to final construction drawings."
  },
  {
    title: "Structural Design",
    description: "Detailed safety analysis, BNBC-compliant designs, ETABS modeling, and cost-efficient reinforcement drafting.",
    details: "Using state-of-the-art software like ETABS, SAFE, and Revit, we deliver high-performance structural systems optimized for seismic loads, wind resistance, and optimal steel-to-concrete ratios."
  },
  {
    title: "Interior Design",
    description: "Modern styling, custom furniture designs, ceiling decoration, and bespoke residential/commercial space revamping.",
    details: "We transform standard spaces into inspiring environments. Our interior division handles corporate workspace designs, retail outlets, residential flats, lighting design, acoustics, and full execution."
  },
  {
    title: "Construction Management",
    description: "On-site quality controls, material supervision, labor scheduling, and timely phase-by-phase execution reports.",
    details: "Our project managers ensure structures are built exactly to technical drawings. We control material waste, enforce safety measures, and maintain strict delivery schedules."
  },
  {
    title: "Engineering Consultancy",
    description: "Structural safety audits, soil testing reports, building extension advice, and expert legal engineering opinions.",
    details: "We provide comprehensive building assessments, load verification audits, retrofitting design consultancy, and building approval advice for commercial and industrial facilities."
  },
  {
    title: "Project Supervision",
    description: "Regular expert checks, design compliance checking, checklist approvals, and contractor work audits.",
    details: "Eliminate contractor errors by having our senior designers and structural engineers run routine checks and inspect reinforcement placements during key milestones."
  }
];

const partners = [
  {
    name: "Bangladesh Highways Authority",
    logo: "/partners/Victory Design.png",
  },
  {
    name: "Dhanmondi Developers Ltd",
    logo: "/partners/Victory Design.png",
  },
  {
    name: "Cumilla Trade Center",
    logo: "/partners/Victory Design.png",
  },
  {
    name: "Dhaka Urban Housing Co",
    logo: "/partners/Victory Design.png",
  },
  {
    name: "Apex Steel & Concrete",
    logo: "/partners/Victory Design.png",
  },
];

const clientFeedbacks = [
  {
    name: "Engr. Zahid Hasan",
    role: "Project Director, BHA",
    text: "Victory Design & Construction delivered our office expansion building ahead of schedule. Their technical precision, transparent reporting, and BNBC compliance were outstanding."
  },
  {
    name: "Mst. Rehana Akter",
    role: "Managing Director, Dhanmondi Devs",
    text: "We hired their interior design team for our flagship head office in Dhanmondi. The glassmorphic partitions, acoustic balance, and customized workspace layout exceeded our expectations!"
  },
  {
    name: "Mr. Kamal Uddin",
    role: "Commercial Landlord",
    text: "Their structural safety audit and consultancy saved us millions in retrofitting. Honest, professional, and extremely knowledgeable team."
  }
];

const studentFeedbacks = [
  {
    name: "Mahbubur Rahman",
    role: "Junior Structural Engineer",
    text: "The Revit and ETABS training course completely transformed my career. The lessons are practical, structured, and focus on real building analysis rather than just software features."
  },
  {
    name: "Sumiya Tasnim",
    role: "Interior Design Architect",
    text: "I enrolled in the Modern Interior Design course. It gave me the skills to draft blueprints, render models in 3ds Max, and manage client expectations. Truly professional!"
  },
  {
    name: "Engr. Nafis Imtiaz",
    role: "Site Inspector",
    text: "The Site Engineering and Construction Management course is a must-have for fresh graduates. The field calculations and checklist guidelines are incredibly valuable on site."
  }
];

export default function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [clientFeedbackIdx, setClientFeedbackIdx] = useState(0);
  const [studentFeedbackIdx, setStudentFeedbackIdx] = useState(0);

  const slides = [
    {
      badge: "VTCLBD Consultancy & Academy",
      title: "Master The Art of Building & Engineering",
      subtitle: "Expert-led courses in AutoCAD, Revit, ETABS, and Site Engineering. Learn at your own pace and earn a verified professional certificate.",
      cta: "Explore Courses",
      link: "/courses",
      bgGradient: "from-[#135c7c]/20 via-[#39c2e3]/10 to-transparent",
    },
    {
      badge: "Victory Design & Construction",
      title: "Delivering Architectural Excellence & Trust",
      subtitle: "Victory Design & Construction provides comprehensive structural, architectural, and interior solutions across Bangladesh.",
      cta: "View Our Portfolio",
      link: "/projects",
      bgGradient: "from-cyan-500/10 via-[#135c7c]/15 to-transparent",
    },
    {
      badge: "Innovative Civil & Design Solutions",
      title: "Sustainable Structural Engineering Solutions",
      subtitle: "From initial concept sketches to project completion, our team of dedicated engineers delivers quality with transparency.",
      cta: "Get Consultation",
      link: "/contact",
      bgGradient: "from-[#135c7c]/25 via-emerald-500/5 to-transparent",
    }
  ];

  const banners = [
  {
    image: "/hero_construction.png",
    title: "Master The Art of Building & Engineering",
    subtitle:
      "Expert-led courses in AutoCAD, Revit, ETABS, and Site Engineering.",
  },
  {
    image: "/hero_architecture.png",
    title: "Delivering Architectural Excellence",
    subtitle:
      "Professional structural, architectural, and interior solutions.",
  },
  {
    image: "/hero_structural.png",
    title: "Sustainable Structural Engineering",
    subtitle:
      "From concepts to completion with precision and transparency.",
  },
];

  const { data: coursesData } = useQuery({
    queryKey: ["courses"],
    queryFn: () => courseService.getAll(true),
  });

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getAll(true),
  });

  const courses: CourseResponseDto[] = coursesData?.data?.slice(0, 3) ?? [];
  const projects: ProjectResponseDto[] = projectsData?.data?.slice(0, 3) ?? [];

  // Auto-rotate Hero Slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);



  return (
    <div className="flex flex-col min-h-screen text-foreground bg-background">
      <Navbar />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative py-8 lg:py-18">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="relative overflow-hidden rounded-[32px] border border-border shadow-xl bg-card h-[280px] sm:h-[420px] lg:h-[560px]">

              {banners.map((banner, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    currentBanner === index
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="absolute inset-0 w-full h-full object-cover scale-100"
                  />

                  <div className="absolute inset-0 bg-black/45" />

                  <div className="hero-content relative z-10 h-full flex items-center px-6 sm:px-18">
                    <div className="max-w-2xl text-white space-y-5">
                      <span className="inline-flex px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold">
                        VTCLBD Consultancy & Academy
                      </span>

                      <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
                        {banner.title}
                      </h1>

                      <div className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                        {index === 1 ? (
                          <CmsContent
                            identifier="home-hero-subtitle"
                            fallback={banner.subtitle}
                            as="span"
                          />
                        ) : (
                          banner.subtitle
                        )}
                      </div>

                      <div className="flex gap-3 pt-2 perspective-container">
                        <Link
                          href="/courses"
                          className="btn-3d-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold transition-all"
                        >
                          Explore Courses
                          <RiArrowRightLine />
                        </Link>

                        <Link
                          href="/contact"
                          className="btn-3d-secondary inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white text-sm font-semibold transition-all"
                        >
                          Contact Us
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* arrows */}
              <button
                onClick={() =>
                  setCurrentBanner(
                    (prev) =>
                      (prev - 1 + banners.length) % banners.length
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/25 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/40 transition-all"
              >
                <RiArrowLeftLine className="text-xl" />
              </button>

              <button
                onClick={() =>
                  setCurrentBanner(
                    (prev) => (prev + 1) % banners.length
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/25 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/40 transition-all"
              >
                <RiArrowRightLine className="text-xl" />
              </button>

              {/* dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentBanner(i)}
                    className={`transition-all duration-300 rounded-full ${
                      currentBanner === i
                        ? "w-8 h-2 bg-white"
                        : "w-2 h-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats Section ─────────────────────────────────────────────────── */}
        <section ref={statsRef} className="py-12 border-y border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 perspective-container">
              {stats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="card-3d hover-border-glow stat-card flex flex-col items-center text-center p-5 rounded-2xl border border-border bg-card shadow-sm transition-all duration-300"
                >
                  <div className="card-3d-content w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="text-primary text-xl" />
                  </div>
                  <div className="card-3d-content text-2xl font-bold text-heading">{value}</div>
                  <div className="card-3d-content text-[11px] font-semibold text-muted-foreground mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Services ─────────────────────────────────────────────── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">Our Capabilities</p>
            <h2 className="text-3xl font-bold text-heading">Professional Consultancy Services</h2>
            <p className="text-sm text-muted-foreground mt-2">
              From detailed structural planning to bespoke interior design solutions, we deliver precision-guided engineering designs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-container">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="card-3d hover-border-glow group rounded-3xl border border-border/80 bg-card p-6 shadow-sm relative overflow-hidden transition-all duration-300"
              >
                <div className="card-3d-content w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center mb-4 text-secondary">
                  <RiServiceLine className="text-lg" />
                </div>
                <h3 className="card-3d-content font-bold text-sm text-heading mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="card-3d-content text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{service.description}</p>
                <button
                  onClick={() => setSelectedService(service)}
                  className="card-3d-content text-xs font-semibold text-primary hover:underline flex items-center gap-1 mt-auto"
                >
                  Learn Details <RiArrowRightLine className="text-xs group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Featured Courses ───────────────────────────────────────────────── */}
        <section className="courses-section py-20 bg-slate-50/40 dark:bg-zinc-950/10 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">Build Your Skills</p>
                <h2 className="text-3xl font-bold text-heading">Featured Training Programs</h2>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                View Academy <RiArrowRightLine />
              </Link>
            </div>

            {courses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-card max-w-lg mx-auto">
                <RiGraduationCapLine className="text-4xl text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-xs text-muted-foreground font-semibold">No active training courses found. Please check back later.</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 perspective-container">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="card-3d hover-border-glow group rounded-3xl border border-border bg-card overflow-hidden transition-all duration-300 flex flex-col"
                >
                  <div className="card-3d-content h-44 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent flex items-center justify-center shrink-0">
                    <RiGraduationCapLine className="text-5xl text-primary/30 group-hover:text-primary/50 transition-colors" />
                  </div>
                  <div className="card-3d-content p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase">{course.instructorName}</span>
                      <h3 className="font-bold text-xs sm:text-sm text-heading leading-snug group-hover:text-primary transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{course.description}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-border/60 pt-3">
                      <span className="font-extrabold text-xs text-primary">{formatPrice(course.price)}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-primary font-bold">
                        Get Enrolled <RiArrowRightLine />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            )}
          </div>
        </section>

        {/* ── Client & Partners Carousel ─────────────────────────────────────── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 mb-10">
              Supported & Trusted By
            </p>

            <div className="relative overflow-hidden">
              {/* fade left */}
              <div className="absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent pointer-events-none" />

              {/* fade right */}
              <div className="absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent pointer-events-none" />

              <div className="flex items-center gap-20 animate-marquee whitespace-nowrap">
                {partners.concat(partners).map((partner, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-center shrink-0"
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="
                        h-14 sm:h-16 md:h-20
                        w-auto
                        object-contain
                        opacity-60
                        grayscale
                        transition-all
                        duration-300
                        group-hover:opacity-100
                        group-hover:grayscale-0
                        group-hover:scale-105
                      " 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Double Testimonials Carousel ──────────────────────────────────── */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* 1. Client Feedbacks */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="text-primary text-[10px] font-bold uppercase tracking-wider">Consultancy Reviews</p>
                  <h3 className="text-lg font-bold text-heading">Client Feedbacks</h3>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setClientFeedbackIdx((prev) => (prev - 1 + clientFeedbacks.length) % clientFeedbacks.length)}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs transition-all"
                  >
                    <RiArrowLeftLine />
                  </button>
                  <button
                    onClick={() => setClientFeedbackIdx((prev) => (prev + 1) % clientFeedbacks.length)}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs transition-all"
                  >
                    <RiArrowRightLine />
                  </button>
                </div>
              </div>

              <div className="min-h-[160px] rounded-3xl border border-border bg-card p-6 relative flex flex-col justify-between shadow-sm">
                <RiDoubleQuotesL className="text-3xl text-secondary/30 absolute top-4 left-4" />
                <p className="text-xs text-muted-foreground leading-relaxed italic pt-4 pl-4 relative z-10">
                  {clientFeedbacks[clientFeedbackIdx].text}
                </p>
                <div className="flex items-center gap-3 border-t border-border/60 pt-4 mt-4">
                  <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center font-bold text-secondary text-xs">
                    {clientFeedbacks[clientFeedbackIdx].name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-heading">{clientFeedbacks[clientFeedbackIdx].name}</h5>
                    <p className="text-[10px] text-muted-foreground">{clientFeedbacks[clientFeedbackIdx].role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Student Feedbacks */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="text-primary text-[10px] font-bold uppercase tracking-wider">LMS Academy Reviews</p>
                  <h3 className="text-lg font-bold text-heading">Student Success Stories</h3>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setStudentFeedbackIdx((prev) => (prev - 1 + studentFeedbacks.length) % studentFeedbacks.length)}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs transition-all"
                  >
                    <RiArrowLeftLine />
                  </button>
                  <button
                    onClick={() => setStudentFeedbackIdx((prev) => (prev + 1) % studentFeedbacks.length)}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted text-xs transition-all"
                  >
                    <RiArrowRightLine />
                  </button>
                </div>
              </div>

              <div className="min-h-[160px] rounded-3xl border border-border bg-card p-6 relative flex flex-col justify-between shadow-sm">
                <RiDoubleQuotesL className="text-3xl text-primary/30 absolute top-4 left-4" />
                <p className="text-xs text-muted-foreground leading-relaxed italic pt-4 pl-4 relative z-10">
                  {studentFeedbacks[studentFeedbackIdx].text}
                </p>
                <div className="flex items-center gap-3 border-t border-border/60 pt-4 mt-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                    {studentFeedbacks[studentFeedbackIdx].name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-heading">{studentFeedbacks[studentFeedbackIdx].name}</h5>
                    <p className="text-[10px] text-muted-foreground">{studentFeedbacks[studentFeedbackIdx].role}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Call to Action Section ─────────────────────────────────────────── */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-[40px] overflow-hidden border border-primary/25 bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent p-8 sm:p-16 text-center shadow-xl"
          >
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 max-w-xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-heading">Start Your Next Design or Course With Confidence</h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Victory Design & Construction (VTCLBD) is committed to delivering state-of-the-art engineering plans, structural validations, and professional career courses.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/95 transition-all shadow-md shadow-primary/15"
                >
                  Join Academy Now <RiArrowRightLine />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card text-foreground font-semibold text-xs hover:bg-muted transition-all"
                >
                  Contact Main Branch
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      
      {/* ── Details Modals for Services ────────────────────────────────────── */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-4 shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200 relative text-foreground">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-all"
            >
              <RiCloseLine className="text-xl" />
            </button>
            
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">
              <RiServiceLine className="text-2xl" />
            </div>

            <h3 className="font-extrabold text-lg text-heading border-b border-border/80 pb-2">{selectedService.title}</h3>
            
            <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
              {selectedService.description}
            </p>
            
            <div className="rounded-2xl bg-muted/30 p-4 border border-border/60 text-xs leading-relaxed text-muted-foreground">
              {selectedService.details}
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedService(null)}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/95 transition-all"
              >
                Got It, Thanks
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}