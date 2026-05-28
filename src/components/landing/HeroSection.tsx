'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const Hero3D = dynamic(
  () => import('./Hero3D').then((mod) => mod.Hero3D),
  { ssr: false }
);

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden bg-transparent">
      {/* Three.js Orb */}
      <Hero3D />

      {/* Hero Content */}
      <div className="text-center max-w-4xl z-10">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight mb-6 gradient-text-animated">
          Intelligent &apos;Second Brain&apos; Workspace
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl mb-12 max-w-2xl mx-auto">
          Sync your cognition with our neural-inspired interface. Experience the peak of human-AI collaborative productivity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/sign-up">
            <button className="shimmer-btn px-8 py-4 rounded-xl text-lg font-bold bg-primary text-on-primary shadow-xl hover:scale-105 transition-transform cursor-pointer">
              Start Syncing For Free
            </button>
          </Link>
          <Link href="/sign-in">
            <button className="px-8 py-4 rounded-xl text-lg font-bold border border-outline-variant hover:bg-white/5 transition-colors cursor-pointer text-on-surface">
              Watch Demo
            </button>
          </Link>
        </div>
      </div>

      {/* Ambient Mesh Background Effect */}
      <div className="absolute inset-0 -z-20 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-secondary/20 blur-[120px] rounded-full"></div>
      </div>
    </section>
  );
}
