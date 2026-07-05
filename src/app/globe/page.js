'use client';

import dynamic from 'next/dynamic';
import TopBar from '@/components/layout/TopBar';
import GlassNavRail from '@/components/layout/GlassNavRail';

// Dynamic import to prevent SSR issues on canvas size calculations
const InteractiveAtlas = dynamic(
  () => import('@/components/atlas/InteractiveAtlas'),
  { ssr: false, loading: () => null }
);

export default function AtlasPage() {
  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <TopBar showSearch={false} />
      <InteractiveAtlas />
      <GlassNavRail activeId="globe" />
    </main>
  );
}
