"use client";


import { CmsContent } from "@/components/cms-content";

import {
  RiCompass3Line,
  RiBuilding4Line,
  RiShieldCheckLine,
  RiUserStarLine,
  RiGroupLine,
  RiLightbulbLine,
  RiMapPinLine,
  RiBriefcaseLine,
} from "react-icons/ri";

const values = [
  {
    icon: RiLightbulbLine,
    title: "Innovative Design Approach",
    desc: "We blend creative architectural solutions with structural precision for future-proof designs."
  },
  {
    icon: RiShieldCheckLine,
    title: "Quality Construction Standards",
    desc: "No compromises. We strictly follow BNBC codes and premium material validation."
  },
  {
    icon: RiGroupLine,
    title: "Client-Centered Project Management",
    desc: "Your goals drive our engineering. We align every layout dynamically with your vision."
  },
  {
    icon: RiUserStarLine,
    title: "Professional Engineering Expertise",
    desc: "Led by highly qualified structural, architectural, and electrical design practitioners."
  }
];

const services = [
  "Architectural Design",
  "Structural Design",
  "Interior Design",
  "Construction Management",
  "Engineering Consultancy",
  "Project Supervision",
  "Estimation & Costing",
  "Renovation & Space Planning"
];

export default function AboutPage() {

  return (
    <div className="about-gsap-load space-y-24 py-16">
      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <section
        className="relative pt-24 pb-20 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(var(--primary) / 0.12), transparent)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider shadow-sm">
            Victory Design & Construction
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-heading">
            Building Modern Spaces with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Trust, Innovation, and Excellence
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
            Victory Design & Construction is a forward-thinking architectural, structural, and construction consultancy company dedicated to delivering innovative design solutions and high-quality project execution across Bangladesh.
          </p>
        </div>
      </section>

      {/* ── Who We Are Split ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-secondary rounded-full" />
              <span className="text-sm font-bold text-secondary uppercase tracking-widest">Who We Are</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-heading">Victory Design & Construction</h2>
            <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
              Victory Design & Construction is a modern engineering and construction consultancy firm committed to transforming ideas into functional, sustainable, and visually compelling spaces.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
              With expertise in architectural design, structural planning, interior solutions, and construction management, we provide complete end-to-end services for residential, commercial, and industrial projects.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
              Our mission is to combine creativity, technical precision, and client-focused collaboration to deliver projects that meet the highest standards of quality and professionalism. We believe that every structure should reflect innovation, durability, and purpose. From concept development to project completion, our team works with dedication, transparency, and attention to detail to ensure successful outcomes for every client.
            </p>
          </div>

          <div className="lg:col-span-5 relative rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 sm:p-10 shadow-xl shadow-primary/5 hover:border-primary/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl -z-10" />
            <RiCompass3Line className="text-5xl text-primary mb-4 animate-pulse" />
            
            {/* Vision */}
            <div className="space-y-3 mb-8">
              <h3 className="text-xl font-bold text-heading flex items-center gap-2">
                Our Vision
              </h3>
              <CmsContent
                identifier="about-company-vision"
                fallback="To become one of Bangladesh’s most trusted and innovative construction and consultancy companies by delivering modern engineering solutions that inspire confidence and long-term value."
                className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
                as="p"
              />
            </div>

            {/* Mission */}
            <div className="space-y-3 border-t border-border pt-6">
              <h3 className="text-xl font-bold text-heading flex items-center gap-2">
                Our Mission
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Our mission is to provide high-quality architectural and construction services through innovation, integrity, technical excellence, and a strong commitment to client satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values / Why Choose Us ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="flex justify-center items-center gap-3">
            <div className="h-1 w-6 bg-primary rounded-full" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Why Choose Us</span>
            <div className="h-1 w-6 bg-primary rounded-full" />
          </div>
          <h2 className="text-3xl font-extrabold text-heading">Our Core Values</h2>
          <p className="text-sm text-muted-foreground">
            The guiding principles driving our design execution, site safety guidelines, and client relationships.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:border-primary/40 transition-all hover:shadow-lg shadow-sm group hover:-translate-y-1 duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-primary group-hover:to-secondary group-hover:text-white transition-all duration-300">
                  <Icon className="text-2xl" />
                </div>
                <h3 className="font-bold text-sm text-heading">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Services Section ────────────────────────────────────────────────── */}
      <section className="bg-muted/50 border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Specialized Operations</span>
            <h2 className="text-3xl font-extrabold text-heading">Our Services</h2>
            <p className="text-sm text-muted-foreground">
              Complete engineering blueprints, estimations, project management, and luxury interiors tailored to your space.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-6 flex items-center gap-4 hover:border-secondary/40 transition-all duration-300 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                  <RiBuilding4Line className="text-lg" />
                </div>
                <span className="font-bold text-sm text-heading">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Map / Quick CTA ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-secondary p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative z-10 max-w-3xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Start Your Next Project with Confidence</h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              We are committed to delivering innovative design solutions, quality construction, and reliable engineering consultancy tailored to your needs.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="/contact"
                className="px-6 py-3 rounded-xl bg-white text-primary font-bold text-sm hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Schedule Consultation
              </a>
              <a
                href="/projects"
                className="px-6 py-3 rounded-xl border border-white/20 hover:border-white/50 text-white font-bold text-sm hover:bg-white/5 transition-all duration-200"
              >
                Browse Projects
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
