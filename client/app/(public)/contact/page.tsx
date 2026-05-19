"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiSendPlaneFill,
  RiCheckDoubleLine,
} from "react-icons/ri";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    gsap.fromTo(
      ".contact-fade-in > *",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );
  }, []);

  const onSubmit = async (data: ContactForm) => {
    // Mock API request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    toast.success("Message sent successfully! We will get back to you shortly.");
    reset();
  };

  return (
    <div className="contact-fade-in space-y-16 py-16">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-20 pb-10 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, hsl(var(--primary) / 0.12), transparent)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Connect With Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">
              Training Hub
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base text-muted-foreground leading-relaxed">
            Have questions about course schedules, corporate group accounts, or certificates? Drop us a line!
          </p>
        </div>
      </section>

      {/* ── Main Content Split ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Info Side (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">Contact Information</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Visit our campus in Dhaka or reach out directly to our student query center.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: RiMailLine,
                  title: "Email Queries",
                  val: "support@buildcraftacademy.com",
                  sub: "Response within 24 business hours",
                },
                {
                  icon: RiPhoneLine,
                  title: "Phone Support",
                  val: "+880 1712-345678",
                  sub: "Sat - Thu, 9 AM - 6 PM (GMT+6)",
                },
                {
                  icon: RiMapPinLine,
                  title: "Academy Campus",
                  val: "Level 4, BuildCraft Hub, Banani Road 11, Dhaka-1213",
                  sub: "Bangladesh",
                },
              ].map(({ icon: Icon, title, val, sub }, i) => (
                <div key={i} className="flex gap-4 items-start rounded-2xl border border-border p-5 bg-background">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{title}</h4>
                    <p className="text-sm text-foreground font-medium mt-1">{val}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side (3 cols) */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-border bg-background p-6 sm:p-8 shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto text-3xl">
                    <RiCheckDoubleLine />
                  </div>
                  <h3 className="text-xl font-bold">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Thank you for reaching out. A representative from the student coordination department will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <h3 className="font-bold text-lg border-b border-border pb-2">Direct Message</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Your Name</label>
                      <input
                        type="text"
                        {...register("name")}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Your Email</label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Subject</label>
                    <input
                      type="text"
                      {...register("subject")}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Message</label>
                    <textarea
                      rows={5}
                      {...register("message")}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                    {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/10"
                  >
                    {isSubmitting ? "Sending..." : (
                      <>
                        <RiSendPlaneFill /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
