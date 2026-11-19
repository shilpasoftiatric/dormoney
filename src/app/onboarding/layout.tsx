import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50">
      {/* Top Navigation — Clean 64px (h-16) header with bold, sharp logo */}
      <header className="h-16 border-b border-slate-200 bg-white shrink-0 flex items-center px-6 sm:px-10 shadow-xs z-30">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <Image
            src="/images/dormoney-logo.png"
            alt={settings.site_name || "Dormoney"}
            width={260}
            height={150}
            className="h-11 w-auto object-contain"
            priority
          />
        </Link>
      </header>

      {/* Main Content Area — Centered with guaranteed breathing room top and bottom */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-2xl sm:max-w-[700px]">
          {children}
        </div>
      </main>
    </div>
  );
}
