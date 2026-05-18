"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { RiMenuLine, RiCloseLine, RiGraduationCapLine } from "react-icons/ri";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <RiGraduationCapLine className="text-primary-foreground text-xl" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              BuildCraft<span className="text-primary">Academy</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href={user?.role === "Admin" ? "/admin" : "/dashboard"}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hi, {user?.fullName?.split(" ")[0]} 👋
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <RiCloseLine className="text-xl" /> : <RiMenuLine className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                pathname === link.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-all"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium text-center border border-border hover:bg-muted transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium text-center hover:bg-primary/90 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
