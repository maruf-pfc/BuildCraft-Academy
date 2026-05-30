"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiGraduationCapLine, RiGoogleFill } from "react-icons/ri";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (data: FormData) => authService.login(data),
    onSuccess: (res) => {
      if (!res.data) { toast.error(res.message); return; }
      login(res.data);
      toast.success("Welcome back! 👋");
      const role = res.data.role;
      router.push(role === "Admin" ? "/admin" : "/dashboard");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const googleMutation = useMutation({
    mutationFn: (data: { email: string; fullName: string; idToken: string }) =>
      authService.googleLogin(data),
    onSuccess: (res) => {
      if (!res.data) { toast.error(res.message); return; }
      login(res.data);
      toast.success("Welcome back with Google! 👋");
      const role = res.data.role;
      router.push(role === "Admin" ? "/admin" : "/dashboard");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleGoogleLogin = () => {
    // Standard OAuth flow: mock successful user info retrieval from OAuth pop-up
    googleMutation.mutate({
      email: "student@vtclbd.com",
      fullName: "Google Student",
      idToken: "google-oauth-token-12345",
    });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Logo (mobile only) */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <RiGraduationCapLine className="text-primary-foreground text-xl" />
        </div>
        <span className="font-bold text-lg">Victory<span className="text-primary">Technologies & Construction Ltd.</span></span>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Sign in to continue to your learning dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="email">Email address</label>
          <div className="relative">
            <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="password">Password</label>
            <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline underline-offset-4">Forgot password?</Link>
          </div>
          <div className="relative">
            <RiLockLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 transition-all shadow-lg shadow-primary/20"
        >
          {mutation.isPending ? "Signing in..." : "Sign In"}
        </button>

        {/* Google Authentication */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase font-bold tracking-wider">Or continue with</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleMutation.isPending}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card hover:bg-muted text-sm font-semibold transition-all shadow-sm hover:scale-[1.01] duration-200"
        >
          <RiGoogleFill className="text-red-500 text-lg" />
          {googleMutation.isPending ? "Connecting to Google..." : "Sign in with Google"}
        </button>

        {/* Demo credentials */}
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">🔐 Demo Login Credentials</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all text-left"
              onClick={() => { setValue("email", "admin@vtclbd.com"); setValue("password", "Admin@123!"); }}
            >
              <span className="text-[10px] text-muted-foreground font-semibold">ADMIN</span>
              <span className="text-xs text-primary font-bold">👑 Fill Admin</span>
              <span className="text-[10px] text-muted-foreground font-mono">admin@vtclbd.com</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-all text-left"
              onClick={() => { setValue("email", "student@vtclbd.com"); setValue("password", "Student@123!"); }}
            >
              <span className="text-[10px] text-muted-foreground font-semibold">STUDENT</span>
              <span className="text-xs text-green-600 font-bold">🎓 Fill Student</span>
              <span className="text-[10px] text-muted-foreground font-mono">student@vtclbd.com</span>
            </button>
          </div>
        </div>
      </form>

      <p className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-primary font-medium hover:underline underline-offset-4">
          Create one for free
        </Link>
      </p>
    </div>
  );
}
