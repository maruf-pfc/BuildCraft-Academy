"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { RiFileTextLine, RiCheckboxCircleLine, RiErrorWarningLine } from "react-icons/ri";

export default function TermsPage() {
  useEffect(() => {
    gsap.fromTo(
      ".terms-fade-in > *",
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="terms-fade-in max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-12">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-4 pt-16">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 text-2xl">
          <RiFileTextLine />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms of Service</h1>
        <p className="text-xs text-muted-foreground">Last updated: May 19, 2026</p>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Please review the following academic and technical regulations before enrolling in any of BuildCraft Academy&apos;s blueprints.
        </p>
      </div>

      {/* ── Core Guidelines ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-y border-border py-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-500 font-bold text-sm">
            <RiCheckboxCircleLine className="text-base shrink-0" />
            <span>Permitted Actions</span>
          </div>
          <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1 leading-relaxed">
            <li>Single personal use of course video players and curriculum files.</li>
            <li>Downloading static resources (DWG drafts, blueprint templates) for local learning.</li>
            <li>Directly listing earned certificates on private LinkedIn/resume profiles.</li>
          </ul>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-destructive font-bold text-sm">
            <RiErrorWarningLine className="text-base shrink-0" />
            <span>Strictly Prohibited</span>
          </div>
          <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1 leading-relaxed">
            <li>Redistributing video lessons, source code, or private blueprints on other websites.</li>
            <li>Executing scraping bots to copy content blocks from dynamic CMS directories.</li>
            <li>Sharing student portal login details with multiple unauthorized peers.</li>
          </ul>
        </div>
      </div>

      {/* ── Terms Details ──────────────────────────────────────────────────── */}
      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By establishing a credentialed account on the BuildCraft Academy portal, you agree to comply with all student code-of-conduct guidelines, site terms, and applicable local civil laws of Bangladesh.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Intellectual Property</h2>
          <p>
            All video guides, course syllabus modules, layout codes, custom graphics, and downloadable architectural resources are strictly owned by BuildCraft Academy and are protected under international copyright regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. Student Account Access</h2>
          <p>
            Your access key is strictly personal. In cases where our telemetry registers parallel logins or suspicious cross-location classroom downloads, BuildCraft Academy reserves the right to suspend structural course access pending validation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Liability Boundaries</h2>
          <p>
            BuildCraft Academy training guides are structured for educational instruction. We are not liable for private construction site failures, local structural inspection rejections, or engineering miscalculations carried out on real active project sites.
          </p>
        </section>
      </div>
    </div>
  );
}
