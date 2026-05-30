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
  RiBuildingLine,
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
      ".contact-gsap-load > *",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" }
    );
  }, []);

  const onSubmit = async (data: ContactForm) => {
    // Mock API request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    toast.success("Thank you! Your message has been received. Our team will get back to you shortly.");
    reset();
  };

  return (
    <div className="contact-gsap-load space-y-16 py-16">
      {/* ── Hero Header ───────────────────────────────────────────────────── */}
      <section
        className="relative pt-24 pb-12 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% -10%, hsl(var(--primary) / 0.12), transparent)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider">
            Victory Design & Construction
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-heading">
            Let’s Build Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Exceptional Together
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed">
            Get in touch with Victory Design & Construction for professional engineering, architectural, and construction consultancy services.
          </p>
        </div>
      </section>

      {/* ── Main Content Split ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Info Side (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-heading">Contact Information</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect with our head office in Dhaka or consult our regional engineers at our branch office.
              </p>
            </div>

            <div className="space-y-6">
              {/* Head Office */}
              <div className="flex gap-4 items-start rounded-2xl border border-border p-5 bg-card shadow-sm hover:border-primary/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <RiMapPinLine className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-heading">Main Branch</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                    Eastern Kamalapur Complex<br />
                    2nd Floor, Room No 206<br />
                    Kamalapur, Dhaka 1000
                  </p>
                </div>
              </div>

              {/* Branch Office */}
              <div className="flex gap-4 items-start rounded-2xl border border-border p-5 bg-card shadow-sm hover:border-secondary/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <RiBuildingLine className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-heading">Branch Office</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                    Madhya Bazar, Chandina, Cumilla
                  </p>
                </div>
              </div>

              {/* Phone Contacts */}
              <div className="flex gap-4 items-start rounded-2xl border border-border p-5 bg-card shadow-sm hover:border-primary/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <RiPhoneLine className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-heading">Call Support</h4>
                  <p className="text-xs sm:text-sm text-foreground font-semibold mt-1">
                    +88 01779481486
                  </p>
                  <p className="text-xs sm:text-sm text-foreground font-semibold">
                    +88 01868785980
                  </p>
                </div>
              </div>

              {/* Email & Web */}
              <div className="flex gap-4 items-start rounded-2xl border border-border p-5 bg-card shadow-sm hover:border-secondary/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <RiMailLine className="text-xl" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-heading">Online Support</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Email: <a href="mailto:victorydesign72@gmail.com" className="text-primary hover:underline font-medium">victorydesign72@gmail.com</a>
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Web: <a href="http://www.victorydesign.com" target="_blank" rel="noreferrer" className="text-secondary hover:underline font-medium">www.victorydesign.com</a>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Form Side (3 cols) */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto text-3xl">
                    <RiCheckDoubleLine />
                  </div>
                  <h3 className="text-xl font-bold text-heading">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Your inquiry has been successfully transmitted. Our design consultants will review your estimation request and contact you.
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
                  <div>
                    <h3 className="font-bold text-lg text-heading">Send Us a Message</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Have a project in mind or need professional consultation? Fill out the form below and our team will get back to you as soon as possible.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Your Name</label>
                      <input
                        type="text"
                        {...register("name")}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Your Email</label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                    />
                    {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Message / Project Description</label>
                    <textarea
                      rows={5}
                      {...register("message")}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-foreground"
                    />
                    {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/15"
                  >
                    {isSubmitting ? "Sending..." : (
                      <>
                        <RiSendPlaneFill /> Send Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Map Embed Placeholder ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border overflow-hidden h-96 shadow-sm hover:border-primary/20 transition-all duration-300">
          <iframe
            title="Victory Design & Construction Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.793740263651!2d90.4262174!3d23.7279768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b85a3c2005a9%3A0xa19bf9e8a7197022!2sKamalapur%20Dhaka%201000!5e0!3m2!1sen!2sbd!4v1716301290355!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-secondary p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Start Your Next Project with Confidence</h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              We are committed to delivering innovative design solutions, quality construction, and reliable engineering consultancy tailored to your needs.
            </p>
            <div>
              <a
                href="tel:+8801779481486"
                className="inline-flex px-8 py-3.5 rounded-xl bg-white text-primary font-bold text-sm hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Call Our Engineers Now
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
