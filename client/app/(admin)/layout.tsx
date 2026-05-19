"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import {
  RiGraduationCapLine,
  RiDashboardLine,
  RiBookOpenLine,
  RiBuildingLine,
  RiSettings4Line,
  RiLogoutBoxLine,
  RiHomeLine,
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const adminNavItems = [
  { label: "Overview", href: "/admin", icon: RiDashboardLine },
  { label: "Manage Courses", href: "/admin/courses", icon: RiBookOpenLine },
  { label: "Manage Projects", href: "/admin/projects", icon: RiBuildingLine },
  { label: "Manage CMS", href: "/admin/cms", icon: RiSettings4Line },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access the Admin Panel.");
      router.replace("/auth/login");
      return;
    }

    if (user?.role !== "Admin") {
      toast.error("Access denied. Admin role required.");
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "Admin") return null;

  return (
    <div className="flex min-h-screen bg-muted/10">
      {/* Admin Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r border-border bg-background z-40">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <RiGraduationCapLine className="text-primary-foreground text-base" />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">
              BuildCraft<span className="text-primary">Admin</span>
            </span>
          </Link>
        </div>

        {/* User Info Badge */}
        <div className="px-4 py-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0 border border-primary/20">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">{user?.fullName}</p>
              <span className="inline-block px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminNavItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                pathname === href
                  ? "bg-primary/10 text-primary border border-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="text-lg shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-4 space-y-1 border-t border-border pt-3">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <RiHomeLine className="text-lg" /> Back to Main Site
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/");
              toast.success("Successfully logged out.");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
          >
            <RiLogoutBoxLine className="text-lg" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-background border-b border-border flex items-center justify-between px-4 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <RiGraduationCapLine className="text-primary-foreground text-sm" />
          </div>
          <span className="font-bold text-sm text-foreground">BuildCraft Admin</span>
        </Link>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Mobile navigation bottom bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-background border-t border-border flex z-40">
        {adminNavItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center py-2 text-xs font-medium gap-0.5 transition-colors",
              pathname === href ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="text-lg" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Main content viewport */}
      <div className="flex-1 md:ml-64">
        <div className="pt-14 md:pt-0 pb-20 md:pb-0 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
