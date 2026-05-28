"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "space_dashboard" },
    { href: "/habits", label: "Habits", icon: "psychology" },
    { href: "/focus", label: "Focus", icon: "self_improvement" },
    { href: "/kanban", label: "Kanban", icon: "hub" },
    { href: "/analytics", label: "Analytics", icon: "monitoring" },
    { href: "/meeting", label: "Meeting Mode", icon: "auto_fix_high" },
    { href: "/notes", label: "Notes", icon: "auto_stories" },
  ];

  const isSettingsActive = pathname === "/settings" || pathname.startsWith("/settings/");

  return (
    <aside className="glass-sidebar h-full w-full flex flex-col py-6 px-4 z-50 select-none">
      {/* Brand */}
      <div className="mb-8 px-4">
        <h1 
          className="font-headline-lg font-bold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent"
          style={{ fontSize: "32px", lineHeight: "1.3", fontFamily: "Inter, sans-serif" }}
        >
          Mind-Sync
        </h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant tracking-widest mt-1">
          ELITE TIER
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 md:space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-all duration-300 ${
                isActive
                  ? "text-primary bg-primary-container/20 border-r-2 border-primary scale-[0.98]"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto space-y-4 md:space-y-5">
        {/* Promo Panel */}
        <div className="p-3.5 rounded-2xl bg-primary-container/10 border border-primary/20">
          <p className="font-label-sm text-[10px] text-primary mb-1.5">PRO PERFORMANCE</p>
          <button className="w-full py-2 bg-primary text-on-primary font-bold rounded-lg text-label-sm hover:shadow-[0_0_15px_rgba(211,187,255,0.4)] transition-all cursor-pointer border-none outline-none">
            Upgrade to Pro
          </button>
        </div>

        {/* Settings & Support */}
        <div className="flex flex-col gap-1.5">
          <Link
            href="/settings"
            className={`flex items-center gap-3 py-2 px-4 rounded-lg transition-all duration-300 ${
              isSettingsActive
                ? "text-primary bg-primary-container/20 border-r-2 border-primary scale-[0.98]"
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
            }`}
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            <span className="font-label-sm text-label-sm">Settings</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 py-2 px-4 text-on-surface-variant hover:text-on-surface transition-all rounded-lg hover:bg-white/5"
          >
            <span className="material-symbols-outlined text-xl">help_outline</span>
            <span className="font-label-sm text-label-sm">Support</span>
          </Link>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-4 pt-4 border-t border-white/5">
          <img
            alt="User Intelligence Profile"
            className="w-10 h-10 rounded-full border-2 border-primary/40 object-cover"
            src={
              isLoaded && user?.imageUrl
                ? user.imageUrl
                : "https://lh3.googleusercontent.com/aida-public/AB6AXuCZU3PsxUpi-jOsV6ihu_fYai7A_IJxhS3OKCBoMqZbj35iukk8UgwJ2idAKd6q5qy60VL1FDMVgCQAF6Tjs2LPTMvLHGBKjs03-iuGl26nMmvJKRRexgoEYir0lYCUiMICBzjlqWSaefuYR1qZqff6ep6yn_vRj1nDMH7UzlnW9mCyEqmibr23X3xXfDQJxSNXu-F6iqzOTlxo7jQFUkWXCddLrBreau9QHh1Ur4jyKSxu-BZFD0gHX2c76bwoLYNDXGA9S1NtCgc"
            }
          />
          <div className="min-w-0 flex-1">
            <p className="font-label-sm text-on-surface font-bold truncate leading-tight">
              {isLoaded && user ? (user.fullName || user.username || "Alexander Vance") : "Alexander Vance"}
            </p>
            <p className="text-[10px] text-on-surface-variant mt-0.5">Elite Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
