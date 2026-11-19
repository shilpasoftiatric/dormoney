import { getAuthenticatedUser } from "@/lib/auth/getUser";
import { signOut } from "@/app/actions/auth";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MobileNav from "./MobileNav";
import NotificationsDropdown from "./NotificationsDropdown";

export default async function Topbar() {
  const user = await getAuthenticatedUser();

  const displayName =
    user?.firstName ||
    user?.contactName ||
    user?.organizationName ||
    user?.email?.split("@")[0] ||
    "User";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-border shrink-0 print:hidden">
      <div className="flex items-center gap-4">
        {/* Mobile Navigation Toggle */}
        <MobileNav siteName="Dormoney" />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications Dropdown (empty list in Phase 1) */}
        <NotificationsDropdown initialNotifications={[]} />

        {/* User + Sign Out */}
        <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-[#1A6FD4]/10 text-[#1A6FD4] text-xs font-bold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{displayName}</p>
            <p className="text-xs text-slate-500 leading-tight">{user?.email}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
