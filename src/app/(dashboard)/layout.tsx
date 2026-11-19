import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth/getUser";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { Suspense } from "react";
import { AIStateProvider } from "@/context/AIStateContext";

function SidebarSkeleton() {
  return (
    <div className="w-64 border-r border-slate-200 bg-white flex flex-col h-full animate-pulse print:hidden shrink-0">
      <div className="flex items-center h-20 pl-4 border-b border-slate-200">
        <div className="w-10 h-10 bg-slate-200 rounded-xl" />
        <div className="ml-3 h-6 w-28 bg-slate-200 rounded" />
      </div>
      <div className="flex-1 p-3 space-y-6">
        <div className="h-12 bg-slate-200 rounded-2xl w-full" />
        {[1, 2, 3].map((g) => (
          <div key={g} className="space-y-3">
            <div className="h-3 w-16 bg-slate-200 rounded ml-3" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2">
                <div className="w-5 h-5 bg-slate-200 rounded-md" />
                <div className="h-4 bg-slate-200 rounded flex-1" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TopbarSkeleton() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-border shrink-0 animate-pulse print:hidden w-full">
      <div className="w-6 h-6 bg-slate-200 rounded" />
      <div className="flex items-center gap-4">
        <div className="h-8 w-24 bg-slate-200 rounded-full" />
        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 bg-slate-200 rounded-full" />
        </div>
      </div>
    </header>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "admin" || user.role === "super_admin") {
    redirect("/admin/dashboard");
  }

  if (!user.isActive) {
    redirect("/login?error=account_suspended");
  }

  if (!user.onboardingComplete && !user.isTestAccount) {
    redirect("/onboarding");
  }

  return (
    <AIStateProvider>
      <div className="fixed inset-0 flex overflow-hidden bg-slate-50 print:static print:inset-auto print:overflow-visible print:bg-white print:h-auto">
        {/* Desktop Sidebar */}
        <div className="relative z-30 hidden lg:flex h-full print:hidden">
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar siteName="Dormoney" />
          </Suspense>
        </div>

        {/* Main Viewport */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden print:overflow-visible print:h-auto">
          <div className="relative z-50 print:hidden">
            <Suspense fallback={<TopbarSkeleton />}>
              <Topbar />
            </Suspense>
          </div>
          <main
            id="main-content-viewport"
            className="relative flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 print:overflow-visible print:h-auto print:p-0 print:m-0"
          >
            <div className="max-w-7xl mx-auto print:max-w-none print:w-full print:m-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AIStateProvider>
  );
}
