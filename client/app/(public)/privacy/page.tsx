"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { RiShieldKeyholeLine, RiLockLine, RiEyeOffLine, RiDatabaseLine } from "react-icons/ri";

export default function PrivacyPage() {
  useEffect(() => {
    gsap.fromTo(
      ".privacy-fade-in > *",
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="privacy-fade-in max-w-4xl mx-auto px-4 sm:px-6 py-20 space-y-12">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="text-center space-y-4 pt-16">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 text-2xl">
          <RiShieldKeyholeLine />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground">Last updated: May 19, 2026</p>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          At BuildCraft Academy, we are fully committed to protecting your personal information, course learning history, and progress analytics.
        </p>
      </div>

      {/* ── Quick Pillars ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-y border-border py-8">
        {[
          { icon: RiLockLine, title: "Secure Transit", desc: "All user telemetry and certificates are secured using SSL encryption." },
          { icon: RiEyeOffLine, title: "Zero Selling", desc: "We never lease or sell student learning progress profiles to advertisers." },
          { icon: RiDatabaseLine, title: "Data Deletion", desc: "Request complete learning profile erasure at any time via settings." },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Icon className="text-base shrink-0" />
                <span>{item.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* ── Policies Detail ───────────────────────────────────────────────── */}
      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">1. Information We Collect</h2>
          <p>
            We collect personal credentials necessary for academic registration, including your full name, active email address, and encrypted password. When you interact with the Classroom workspace, we automatically capture completed lesson counts and quiz scores to compile progress reports.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. How We Use Information</h2>
          <p>
            Your training telemetry is utilized solely to compile metrics for your personal Student Learning Dashboard, calculate course completion rings, issue authentic certificates, and verify certificate validation queries from recruiters.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">3. Account Protection</h2>
          <p>
            We deploy secure password hashing and JSON Web Token (JWT) session guards to maintain authenticated client states. It is your responsibility to safeguard your credentials and sign out of shared browsers immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">4. Policy Modifications</h2>
          <p>
            BuildCraft Academy reserves the right to modify this statement. Registered accounts will receive direct dashboard notices if there are material modifications to data processing operations.
          </p>
        </section>
      </div>
    </div>
  );
}
