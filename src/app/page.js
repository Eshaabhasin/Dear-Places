'use client';

import HeroSection from '@/components/landing/HeroSection';
import GlassNavRail from '@/components/layout/GlassNavRail';

export default function Home() {
  return (
    <main style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <HeroSection />
      <GlassNavRail activeId="home" />
    </main>
  );
}

