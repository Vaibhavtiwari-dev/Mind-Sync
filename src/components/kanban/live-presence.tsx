"use client";

import { useEffect, useState } from "react";
import PartySocket from "partysocket";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PresenceUser {
  id: string;
  color: string;
  name: string;
}

const GRADIENTS = [
  "from-violet-500 to-indigo-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500",
  "from-purple-500 to-fuchsia-500"
];

// Helper to generate a friendly random name/initials
const ADJECTIVES = ["Aether", "Quantum", "Cyber", "Neural", "Synaptic", "Spectral"];
const NOUNS = ["Mind", "Node", "Core", "Nexus", "Link", "Pulse"];

export function LivePresence({ room }: { room: string }) {
  const [activeUsers, setActiveUsers] = useState<Map<string, PresenceUser>>(new Map());

  useEffect(() => {
    // Generate static details for this client
    const randomIndex = Math.floor(Math.random() * GRADIENTS.length);
    const randomName = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`;
    
    const socket = new PartySocket({
      host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
      room,
    });

    socket.addEventListener("message", (e) => {
      try {
        const data = JSON.parse(e.data);
        setActiveUsers((prev) => {
          const map = new Map(prev);
          if (data.type === "connect") {
            const grad = GRADIENTS[map.size % GRADIENTS.length];
            const name = `${ADJECTIVES[map.size % ADJECTIVES.length]} ${NOUNS[map.size % NOUNS.length]}`;
            map.set(data.connectionId, { id: data.connectionId, color: grad, name });
          } else if (data.type === "disconnect") {
            map.delete(data.connectionId);
          }
          return map;
        });
      } catch (err) {
        // ignore non-json messages
      }
    });

    return () => {
      socket.close();
    };
  }, [room]);

  const maxVisible = 3;
  const userList = Array.from(activeUsers.values());
  const visibleUsers = userList.slice(0, maxVisible);
  const remainingCount = userList.length - maxVisible;

  // Single status when no other users are present
  if (activeUsers.size === 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-8 px-3 items-center gap-2 rounded-full border border-white/20 dark:border-white/[0.08] bg-white/40 dark:bg-white/[0.04] backdrop-blur-md text-xs text-muted-foreground shadow-sm transition-all duration-300 hover:bg-white/60 dark:hover:bg-white/[0.08]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              <span className="font-medium tracking-tight">Sync Active</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="glass-card text-xs">You are sync-monitoring solo.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-2.5 rounded-full border border-white/20 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 p-1.5 pr-3.5 backdrop-blur-xl shadow-md transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-900/60 hover:border-white/40 dark:hover:border-white/20">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground ml-1 bg-white/20 dark:bg-slate-800/30 border border-white/30 dark:border-white/5 shadow-sm">
              <Users className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 animate-pulse" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="glass-card text-xs font-medium">
            {activeUsers.size} other {activeUsers.size === 1 ? "mind" : "minds"} connected.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex -space-x-2">
        <AnimatePresence mode="popLayout">
          {visibleUsers.map((user) => (
            <motion.div
              key={user.id}
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="relative"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-7 w-7 border-2 border-background dark:border-slate-950 ring-1 ring-black/5 dark:ring-white/10 shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:z-30 hover:scale-110 hover:shadow-indigo-500/20">
                      <AvatarFallback className={cn("text-[10px] font-bold text-white bg-gradient-to-br shadow-inner", user.color)}>
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent className="glass-card text-xs font-semibold">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold">{user.name}</span>
                      <span className="text-[10px] text-muted-foreground">ID: {user.id.substring(0, 8)}</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          ))}

          {remainingCount > 0 && (
            <motion.div
              key="overflow"
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background dark:border-slate-950 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white text-[9px] font-black ring-1 ring-black/5 dark:ring-white/10 shadow-lg shadow-indigo-500/20 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-purple-500/40">
                      +{remainingCount}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="glass-card text-xs font-semibold">
                    {remainingCount} more active observer{remainingCount > 1 ? "s" : ""}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

