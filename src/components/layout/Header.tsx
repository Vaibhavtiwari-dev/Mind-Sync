"use client";

import { NotificationBell } from "@/components/layout/notification-bell";
import { Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="h1 gradient-text w-fit relative pb-1">
          {title}
          <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-primary/40 via-primary/20 to-transparent rounded-full" />
        </h1>
        {subtitle && <p className="text-sm md:text-base text-muted-foreground mt-2">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Search */}
        <div className="relative group w-48 md:w-64 hidden sm:block">
          <Search
            size={14}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 group-hover:text-primary transition-colors"
          />
          <input
            type="text"
            placeholder="Search workspace (Cmd+K)"
            className="bg-muted/30 border-border/40 focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/60 hover:bg-muted/50 w-full cursor-pointer rounded-lg border py-1.5 pl-9 pr-8 text-xs transition-all focus:ring-2 focus:outline-none"
            readOnly
            onClick={() => {
              const down = new KeyboardEvent("keydown", {
                key: "k",
                metaKey: true,
                ctrlKey: true,
              });
              document.dispatchEvent(down);
            }}
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden h-4 select-none items-center gap-1 rounded border border-border/40 bg-muted/50 px-1.5 font-mono text-[9px] font-medium text-muted-foreground opacity-100 sm:flex">
            <span className="text-[10px]">⌘</span>K
          </kbd>
        </div>

        {children}

        <div className="flex items-center gap-2">
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
