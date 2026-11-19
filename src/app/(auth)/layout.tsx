import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return { title: `${settings.site_name} — Sign In` };
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white">
      {/* Left — Branding Panel (Distinct Soft Brand Sky Blue Gradient) */}
      <div className="hidden lg:flex lg:w-1/2 h-full flex-col justify-between p-8 xl:p-12 bg-gradient-to-br from-[#E8F2FD] via-[#F0F6FD] to-[#DCEAF8] border-r border-blue-200/70 relative overflow-hidden shrink-0">
        {/* Subtle decorative background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1A6FD4]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4CAF39]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        {/* Logo — Natural full-color, sharp and crisp on light sky background */}
        <div className="flex items-start relative z-10 mb-6">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <Image
              src="/images/dormoney-logo.png"
              alt={settings.site_name || "Dormoney"}
              width={260}
              height={160}
              className="h-14 xl:h-16 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6 xl:space-y-8 my-auto">
          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl font-extrabold text-slate-900 leading-tight">
              Fund Your Future, <br />
              <span className="text-[#1A6FD4]">One Campaign</span> at a Time
            </h1>
            <p className="text-slate-600 text-base xl:text-lg leading-relaxed max-w-sm">
              Create micro-scholarship campaigns, connect with donors, and unlock direct education funding.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 xl:gap-4">
            {[
              { value: "500+", label: "Donors & Backers" },
              { value: "$2M+", label: "Awarded Funds" },
              { value: "10k+", label: "Students Helped" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-3.5 xl:p-4 text-center border border-blue-100 shadow-sm"
              >
                <p className="text-xl xl:text-2xl font-extrabold text-[#1A6FD4]">{s.value}</p>
                <p className="text-[11px] xl:text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 xl:p-5 border border-blue-100 shadow-sm">
            <p className="text-slate-700 text-xs xl:text-sm leading-relaxed italic">
              "{settings.site_name} helped me launch my campaign and connect with community backers. I received funding for my full first semester!"
            </p>
            <div className="flex items-center gap-3 mt-3 xl:mt-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1A6FD4] to-[#4CAF39] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                J
              </div>
              <div>
                <p className="text-slate-900 font-semibold text-xs">Jordan M.</p>
                <p className="text-slate-500 text-[11px] xl:text-xs">College Student</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="relative z-10 text-xs text-slate-400 mt-2">
          © {new Date().getFullYear()} {settings.site_name}. All rights reserved.
        </div>
      </div>

      {/* Right — Auth Form (Clean White) */}
      <div className="flex-1 h-full overflow-y-auto bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md my-auto py-2">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Link href="/">
              <Image
                src="/images/dormoney-logo.png"
                alt={settings.site_name || "Dormoney"}
                width={220}
                height={140}
                className="h-14 w-auto object-contain"
                priority
              />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
