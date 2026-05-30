"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import {
  RiGraduationCapLine,
  RiDashboardLine,
  RiBookOpenLine,
  RiMedalLine,
  RiLogoutBoxLine,
  RiHomeLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: RiDashboardLine },
  { label: "My Courses", href: "/dashboard/courses", icon: RiBookOpenLine },
  { label: "Certificates", href: "/dashboard/certificates", icon: RiMedalLine },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      toast.error("Please log in to access your dashboard.");
      router.replace("/auth/login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col fixed inset-y-0 border-r border-border bg-background z-40">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-border shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <RiGraduationCapLine className="text-primary-foreground text-base" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              Victory Design &<span className="text-primary"> Construction</span>
            </span>
          </Link>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                pathname === href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="text-lg shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="px-3 pb-4 space-y-1 border-t border-border pt-3">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <RiHomeLine className="text-lg" /> Back to Site
          </Link>
          <button
            onClick={() => { logout(); router.push("/"); toast.success("Logged out successfully."); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
          >
            <RiLogoutBoxLine className="text-lg" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-background border-b border-border flex items-center justify-between px-4 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <RiGraduationCapLine className="text-primary-foreground text-sm" />
          </div>
          <span className="font-bold text-sm">Victory Design & Construction</span>
        </Link>
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-background border-t border-border flex z-40">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} className={cn("flex-1 flex flex-col items-center py-2.5 text-xs font-medium gap-1 transition-colors", pathname === href ? "text-primary" : "text-muted-foreground")}>
            <Icon className="text-xl" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Main content */}
      <div className="flex-1 md:ml-60">
        <div className="pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
