"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { useUser, useClerk } from "@clerk/nextjs";
import { useTasks, useEvents, useNotes } from "@/store/selectors";
import { exportAllData } from "@/lib/export-utils";
import { 
  Download, 
  User, 
  Globe, 
  Bell, 
  Shield, 
  Database,
  CheckCircle2,
  FileText,
  Calendar,
  Sparkles,
  RefreshCw,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const tasks = useTasks();
  const events = useEvents();
  const notes = useNotes();
  
  // States for Preferences
  const [notifications, setNotifications] = useState(true);
  const [aiAutopilot, setAiAutopilot] = useState(false);
  const [localSync, setLocalSync] = useState(true);
  
  const mounted = useHydrated();

  const handleGoogleConnect = () => {
    openUserProfile();
  };

  const handleExportAllData = () => {
    try {
      exportAllData({ tasks, events, notes });
      toast.success("Workspace backup downloaded successfully!", {
        description: "Your local backup is encrypted and saved locally.",
        duration: 4000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to export backup. Please check console.");
    }
  };

  if (!mounted) {
    return null; 
  }

  // Calculate live statistics
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const savedNotesCount = notes.length;
  const scheduledEventsCount = events.length;

  return (
    <div className="h-full overflow-y-auto pr-2 custom-scrollbar animate-fade-in-up">
      <div className="max-w-4xl space-y-8 pb-12 mx-auto px-2 md:px-4">
        
        {/* Title Header */}
        <div className="flex flex-col gap-2.5">
          <h1 className="text-3xl font-extrabold tracking-tight gradient-text-animated w-fit">
            Settings & Control Panel
          </h1>
          <p className="text-muted-foreground text-sm leading-normal max-w-xl">
            Fine-tune your cognitive database, customize background AI models, synchronize integrations, and secure local backups.
          </p>
        </div>

        <div className="space-y-8">
          
          {/* Clerk Profile Dashboard Container */}
          <GlassCard className="p-0 overflow-hidden border-white/10 dark:border-white/5 hover:border-white/15 hover-glow transition-all duration-300 relative">
            <div className="p-5 flex items-center gap-3 border-b border-white/10 dark:border-white/5 bg-white/20 dark:bg-white/[0.01]">
              <div className="p-2 bg-primary/15 rounded-lg border border-primary/20">
                <User className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-base font-bold text-foreground">User Profile Details</h2>
            </div>
            
            <div className="p-6 relative flex flex-col md:flex-row items-center md:items-start gap-8 z-10">
              
              {/* Profile Glow ambient background */}
              <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-primary/5 to-transparent blur-3xl pointer-events-none" />

              {/* Avatar structure */}
              <div className="relative group flex-shrink-0">
                <Avatar className="h-24 w-24 border-4 border-white/10 dark:border-white/5 shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-pink-500 text-white">
                      {user?.firstName?.[0] || "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-primary to-pink-500 opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500 animate-pulse" style={{ animationDuration: '4s' }} />
              </div>

              {/* Account Details & Stats Grid */}
              <div className="space-y-5 flex-1 text-center md:text-left z-10 w-full">
                <div className="space-y-1">
                  <div className="font-extrabold text-2xl tracking-tight text-foreground flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-2">
                    {user?.fullName || "Aetheric Sync Member"}
                    <Badge variant="outline" className="w-fit mx-auto md:mx-0 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wider">
                      ACTIVE SESSION
                    </Badge>
                  </div>
                  <div className="text-muted-foreground/80 flex items-center justify-center md:justify-start gap-2 text-sm font-medium">
                    <Shield className="w-4 h-4 text-primary/70 animate-pulse" />
                    {user?.primaryEmailAddress?.emailAddress || "local.user@mind-sync.dev"}
                  </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto md:mx-0 bg-white/5 dark:bg-white/[0.01] border border-white/5 p-3 rounded-2xl">
                  <div className="text-center p-2 rounded-xl border border-transparent hover:border-white/5 transition-all">
                    <div className="text-xl font-extrabold text-foreground">{completedTasksCount}</div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground/60 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                      Tasks
                    </div>
                  </div>
                  <div className="text-center p-2 rounded-xl border border-transparent hover:border-white/5 transition-all">
                    <div className="text-xl font-extrabold text-foreground">{savedNotesCount}</div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground/60 flex items-center justify-center gap-1">
                      <FileText className="w-2.5 h-2.5 text-purple-400" />
                      Notes
                    </div>
                  </div>
                  <div className="text-center p-2 rounded-xl border border-transparent hover:border-white/5 transition-all">
                    <div className="text-xl font-extrabold text-foreground">{scheduledEventsCount}</div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground/60 flex items-center justify-center gap-1">
                      <Calendar className="w-2.5 h-2.5 text-blue-400" />
                      Events
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl border-primary/20 hover:border-primary/50 text-foreground hover:bg-primary/10 hover:shadow-glow transition-all duration-300 font-semibold h-9 px-4.5 gap-2"
                  onClick={() => openUserProfile()}
                >
                    <User className="w-3.5 h-3.5" />
                    Manage Clerk Credentials
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Integrations Section */}
          <GlassCard className="p-0 overflow-hidden border-white/10 dark:border-white/5 hover:border-white/15 hover-glow transition-all duration-300">
            <div className="p-5 flex items-center gap-3 border-b border-white/10 dark:border-white/5 bg-white/20 dark:bg-white/[0.01]">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Globe className="w-4 h-4 text-blue-400 animate-pulse" />
              </div>
              <h2 className="text-base font-bold text-foreground">Integrations & Sync Providers</h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-white/40 dark:bg-white/[0.01] border border-white/10 dark:border-white/5 hover:border-blue-500/25 transition-all duration-300 gap-4">
                <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                  <div className="bg-white p-3 rounded-xl shadow-md border border-white/20 transition-transform duration-300 hover:scale-105 flex-shrink-0">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M24 12.276c0-1.047-.093-2.025-.273-2.964H12v5.61h6.732c-.29 1.565-1.173 2.894-2.496 3.78v3.132h4.045c2.366-2.18 3.732-5.388 3.732-9.558z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.957-1.074 7.942-2.908l-4.045-3.132c-1.073.72-2.45 1.144-3.897 1.144-3.01 0-5.56-2.033-6.468-4.766H1.428v3.18C3.414 21.52 8.328 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.532 14.338c-.227-.68-.356-1.408-.356-2.162s.13-2.482.356-2.162V6.657H1.428C.518 8.47 0 10.525 0 12.5s.518 4.03 1.428 5.843l4.104-3.18z"/>
                      <path fill="#4285F4" d="M12 4.773c1.763 0 3.347.606 4.59 1.794l3.44-3.44C17.953 1.19 15.236 0 12 0 8.328 0 3.414 2.48 1.428 6.657l4.104 3.18C6.44 7.033 8.99 5 12 5z"/>
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-foreground text-sm flex items-center justify-center sm:justify-start gap-1.5">
                      Google Calendar Integration
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    </div>
                    <div className="text-xs text-muted-foreground/80 leading-normal max-w-sm">
                      Synchronize events bidirectional with your external Google credentials automatically.
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center sm:justify-end">
                  {user?.externalAccounts?.some(acc => acc.provider === "google") ? (
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 shadow-glow">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                          Connected
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleGoogleConnect} 
                          className="text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5 rounded-xl h-8 px-3 transition-colors"
                        >
                          Manage
                        </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleGoogleConnect} 
                      className="w-full sm:w-auto rounded-xl border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 hover:text-blue-400 font-semibold h-9.5 px-5 gap-2 transition-all duration-300"
                    >
                      Connect Google Calendar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Preferences Section */}
          <GlassCard className="p-0 overflow-hidden border-white/10 dark:border-white/5 hover:border-white/15 hover-glow transition-all duration-300">
            <div className="p-5 flex items-center gap-3 border-b border-white/10 dark:border-white/5 bg-white/20 dark:bg-white/[0.01]">
              <div className="p-2 bg-pink-500/10 rounded-lg border border-pink-500/20">
                <Bell className="w-4 h-4 text-pink-400" />
              </div>
              <h2 className="text-base font-bold text-foreground">Workspace Preferences</h2>
            </div>
            
            <div className="p-6 space-y-4">
              
              {/* Switch 1: Meeting Notifications */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-white/[0.01] border border-white/10 dark:border-white/5 hover:border-white/15 transition-all duration-300 gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    Meeting Warnings
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                  </div>
                  <div className="text-xs text-muted-foreground/80 leading-normal max-w-md">
                    Get alerted 5 minutes before scheduled meetings start to trigger Zen deep focus block.
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  className="data-[state=checked]:bg-primary shadow-glow transition-all duration-300 cursor-pointer"
                />
              </div>

              {/* Switch 2: AI Autopilot auto-run */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-white/[0.01] border border-white/10 dark:border-white/5 hover:border-white/15 transition-all duration-300 gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    Aether AI Autopilot Suggestions
                    <Sparkles className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div className="text-xs text-muted-foreground/80 leading-normal max-w-md">
                    Auto-analyze workspace entries on saving to feed weekly productivity report cards.
                  </div>
                </div>
                <Switch
                  checked={aiAutopilot}
                  onCheckedChange={setAiAutopilot}
                  className="data-[state=checked]:bg-primary shadow-glow transition-all duration-300 cursor-pointer"
                />
              </div>

              {/* Switch 3: Local Sync logs */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-white/[0.01] border border-white/10 dark:border-white/5 hover:border-white/15 transition-all duration-300 gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    Real-time State Synchronization
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xs text-muted-foreground/80 leading-normal max-w-md">
                    Broadcast active edits live inside local PartyKit nodes for high-availability workspace backup.
                  </div>
                </div>
                <Switch
                  checked={localSync}
                  onCheckedChange={setLocalSync}
                  className="data-[state=checked]:bg-primary shadow-glow transition-all duration-300 cursor-pointer"
                />
              </div>

            </div>
          </GlassCard>

          {/* Data & Privacy Section */}
          <GlassCard className="p-0 overflow-hidden border-white/10 dark:border-white/5 hover:border-white/15 hover-glow transition-all duration-300">
            <div className="p-5 flex items-center gap-3 border-b border-white/10 dark:border-white/5 bg-white/20 dark:bg-white/[0.01]">
              <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <Database className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-base font-bold text-foreground">Data Safety & Encryption</h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/15 gap-5">
                <div className="space-y-2">
                  <div className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400 animate-bounce" />
                    Export Local Workspace Backup
                  </div>
                  <p className="text-xs text-muted-foreground/85 leading-normal max-w-lg">
                    Export your full parameter configuration including tasks list, calendar events, and notes as a clean JSON catalog. The action takes place locally in your browser. No files are transmitted.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportAllData} 
                  className="w-full md:w-auto rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border-amber-500/25 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] text-foreground font-semibold h-10 px-5 gap-2 transition-all duration-300 group/btn shrink-0"
                >
                  <Download className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
                  Download JSON Catalog
                </Button>
              </div>
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
}
