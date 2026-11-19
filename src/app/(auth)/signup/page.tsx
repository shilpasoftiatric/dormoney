"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/onboarding");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-8 h-8 border-4 border-[#1A6FD4]/30 border-t-[#1A6FD4] rounded-full animate-spin" />
      <p className="text-sm font-medium text-slate-500">Redirecting to Dormoney onboarding…</p>
    </div>
  );
}
