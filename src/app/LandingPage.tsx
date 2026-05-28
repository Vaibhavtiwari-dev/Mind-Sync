'use client';

import {
  HeroSection,
  Features,
  CTASection,
  Footer,
  Navbar,
} from '@/components/landing';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <Navbar />

      {/* Hero Section with 3D element embedded inside */}
      <HeroSection />

      {/* Features Section */}
      <Features />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
