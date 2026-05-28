"use client";

import { useEffect, useRef } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { UserButton } from "@clerk/nextjs";
import { SkipLink } from "@/components/accessibility/skip-link";
import { KeyboardShortcutsHelp } from "@/components/accessibility/keyboard-shortcuts-help";
import { GlobalKeyboardShortcuts } from "@/components/accessibility/global-keyboard-shortcuts";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { StoreHydrator } from "@/components/StoreHydrator";
import type { InitialData } from "@/app/actions/get-initial-data";
import Link from "next/link";

export default function DashboardShell({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: InitialData | null;
}) {
  const meshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!meshRef.current) return;
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      meshRef.current.style.background = `radial-gradient(at ${x * 100}% ${y * 100}%, #260059 0%, transparent 50%),
                                          radial-gradient(at ${100 - x * 100}% ${100 - y * 100}%, #3e001f 0%, transparent 50%),
                                          radial-gradient(at 100% 100%, #001a42 0%, transparent 50%),
                                          radial-gradient(at 0% 100%, #15121b 0%, transparent 50%)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      {/* Hydrate store with server data */}
      <StoreHydrator initialData={initialData} />
      {/* Background Gradient Mesh */}
      <div ref={meshRef} className="mesh-bg pointer-events-none" />
      
      {/* Accessibility: Skip to main content link */}
      <SkipLink />

      {/* Accessibility: Keyboard shortcuts help overlay (? key) */}
      <KeyboardShortcutsHelp />

      {/* Global Keyboard Shortcuts (G+D, G+K, Ctrl+Z, etc.) */}
      <GlobalKeyboardShortcuts />

      {/* PWA Service Worker Registration */}
      <ServiceWorkerRegistration />

      {/* Global Command Palette */}
      <CommandMenu />

      {/* Desktop Sidebar */}
      <nav className="hidden w-[280px] flex-shrink-0 md:block relative z-20" aria-label="Main navigation">
        <AppSidebar />
      </nav>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden relative z-10">
        {/* Mobile Header (Hidden on Desktop) */}
        <header
          className="border-border/30 bg-white/60 dark:bg-card/60 backdrop-blur-xl flex h-14 flex-shrink-0 items-center justify-between border-b px-4 md:hidden pl-safe pr-safe"
          role="banner"
        >
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="border-border bg-card w-64 border-r p-0"
                aria-label="Navigation menu"
              >
                <div className="h-full">
                  <AppSidebar />
                </div>
              </SheetContent>
            </Sheet>

            <h1 className="text-sm font-semibold tracking-tight">Mind-Sync</h1>
          </div>

          <div className="flex items-center gap-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
        </header>

        {/* Main Content Area */}
        <main
          id="main-content"
          className="custom-scrollbar flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop pb-safe pl-safe pr-safe flex flex-col justify-between"
          role="main"
          aria-label="Main content"
        >
          <div className="flex-1">
            {children}
          </div>
          
          {/* Footer (Shared Component Identity) */}
          <footer className="border-t border-outline-variant/20 bg-surface-container-lowest mt-12 py-12 px-margin-mobile md:px-margin-desktop">
            <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-8">
              <div className="flex flex-wrap justify-center gap-8">
                <Link className="text-on-surface-variant font-label-sm hover:text-tertiary transition-all" href="#">
                  Privacy Protocol
                </Link>
                <Link className="text-on-surface-variant font-label-sm hover:text-tertiary transition-all" href="#">
                  Neural Terms
                </Link>
                <Link className="text-on-surface-variant font-label-sm hover:text-tertiary transition-all" href="#">
                  System Status
                </Link>
                <Link className="text-on-surface-variant font-label-sm hover:text-tertiary transition-all" href="#">
                  Elite Support
                </Link>
              </div>
              <div className="text-center">
                <p className="font-headline-lg text-2xl font-bold text-on-surface mb-2">Mind-Sync</p>
                <p className="text-on-surface-variant text-sm font-label-sm">© 2024 Mind-Sync. All Rights Reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* ARIA Live Region for Announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only" id="announcements" />
    </div>
  );
}
