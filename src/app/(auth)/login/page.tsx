"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Welcome back 👋</h2>
        <p className="text-slate-500 mt-1 text-sm">
          Sign in to continue your Dormoney journey.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
          <span className="text-red-400 mt-0.5">⚠</span>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="pl-10 h-11 rounded-xl border-slate-200 bg-white focus-visible:ring-[#1A6FD4]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
              Password
            </Label>
            <Link href="/forgot-password" className="text-xs text-[#1A6FD4] hover:underline font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="pl-10 pr-10 h-11 rounded-xl border-slate-200 bg-white focus-visible:ring-[#1A6FD4]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-11 rounded-xl text-sm font-bold gap-2 bg-gradient-to-r from-[#1A6FD4] to-[#1255a4] hover:from-[#155ab0] hover:to-[#0f4484] text-white shadow-lg shadow-blue-200 transition-all"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Signing in…
            </span>
          ) : (
            <>Sign In <ArrowRight className="w-4 h-4" /></>
          )}
        </Button>
      </form>

      {/* Feature promo */}
      <div className="flex items-center gap-2.5 p-3 bg-blue-50/80 border border-blue-100 rounded-xl">
        <Sparkles className="w-4 h-4 text-[#1A6FD4] shrink-0" />
        <p className="text-xs text-blue-900 leading-snug">
          <span className="font-bold">Micro-scholarships:</span> Start or contribute to active campaigns anytime.
        </p>
      </div>

      {/* Sign up link & legal footer */}
      <div className="space-y-3 pt-1">
        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link href="/onboarding" className="text-[#1A6FD4] font-semibold hover:underline">
            Create An Account
          </Link>
        </p>

        {/* Legal links for compliance */}
        <div className="pt-2 border-t border-slate-200 flex items-center justify-center gap-3 text-sm text-slate-500">
          <Link href="/terms" className="hover:text-[#1A6FD4] hover:underline transition-colors">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-[#1A6FD4] hover:underline transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/sms-terms" className="hover:text-[#1A6FD4] hover:underline transition-colors">
            SMS Terms
          </Link>
        </div>
      </div>
    </div>
  );
}
