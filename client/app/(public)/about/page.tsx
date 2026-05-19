"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import {
  RiShieldCheckLine,
  RiUserStarLine,
  RiGroupLine,
  RiLightbulbLine,
  RiDoubleQuotesL,
} from "react-icons/ri";

const values = [
  {
    icon: RiShieldCheckLine,
    title: "Uncompromising Quality",
    desc: "We align all curriculum with modern building code requirements and real-world construction demands.",
  },
  {
    icon: RiUserStarLine,
    title: "Expert Guidance",
    desc: "Every course is taught by experienced architectural practitioners, structural designers, and developers.",
  },
  {
    icon: RiGroupLine,
    title: "Community Growth",
    desc: "We promote direct collaboration between professionals, students, and active project engineers.",
  },
  {
    icon: RiLightbulbLine,
    title: "Practical Innovation",
    desc: "From 3D blueprints to modern CAD drafting, we integrate state-of-the-art tools and techniques.",
  },
];

const team = [
  {
    name: "Engr. Maruf Sarkar",
    role: "Founder & Chief Instructor",
    designation: "Structural Engineering Lead (12+ Yrs Exp)",
    initials: "MS",
  },
  {
    name: "Ar. Nafisa Islam",
    role: "Senior Instructor",
    designation: "Interior Architecture Designer (8+ Yrs Exp)",
    initials: "NI",
  },
  {
    name: "Engr. Tanvir Ahmed",
    role: "Guest Lecturer",
    designation: "Project Management Consultant (15+ Yrs Exp)",
    initials: "TA",
  },
];

export default function AboutPage() {
  useEffect(() => {
    gsap.fromTo(
      ".about-fade-in > *",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="about-fade-in space-y-24 py-16">
      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <section
        className="relative pt-20 pb-16 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, hsl(var(--primary) / 0.12), transparent)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider">
            Our Story & Legacy
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Building Knowledge. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">
              Structuring Careers.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
            BuildCraft Academy is Bangladesh&apos;s leading specialized learning community, built to bridge the gap between architectural theory and practical construction site delivery.
          </p>
        </div>
      </section>

      {/* ── Mission & Vision Split ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Bridging The Professional Blueprints</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Founded with the objective of empowering local civil engineers, designers, and site workers, BuildCraft Academy delivers high-yield training modules mapped directly to real-world infrastructure benchmarks.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We focus heavily on hands-on software mastery, site safety checklists, estimation strategies, and building engineering workflows that prepare students for immediate jobs.
            </p>
          </div>
          <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 sm:p-10">
            <RiDoubleQuotesL className="text-5xl text-primary/30 mb-4" />
            <p className="italic text-base sm:text-lg text-foreground font-medium leading-relaxed">
              &quot;The modern builder requires more than conceptual drawings. They must understand concrete mix designs, steel scheduling, estimation audits, and modern coordination tools to be truly effective.&quot;
            </p>
            <div className="mt-6 border-t border-border pt-4">
              <div className="font-bold text-sm">Engr. Maruf Sarkar</div>
              <div className="text-xs text-muted-foreground">Founder, BuildCraft Academy</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold">The Pillars of Our Academy</h2>
          <p className="text-sm text-muted-foreground">
            Our educational system is crafted with values that shape professional competence.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-border bg-background p-6 space-y-4 hover:border-primary/30 transition-all hover:shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="text-xl" />
                </div>
                <h3 className="font-bold text-sm">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Expert Team ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold">Meet Your Instructors</h2>
          <p className="text-sm text-muted-foreground">
            Industry professionals with decades of hands-on structural and design experience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-background p-6 space-y-4 hover:border-primary/30 transition-all text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-cyan-500 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-primary/15">
                {member.initials}
              </div>
              <div>
                <h3 className="font-bold text-base">{member.name}</h3>
                <p className="text-xs text-primary font-semibold mt-0.5">{member.role}</p>
                <p className="text-xs text-muted-foreground mt-2">{member.designation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
