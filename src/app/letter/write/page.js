'use client';

import dynamic from 'next/dynamic';
import TopBar from '@/components/layout/TopBar';
import GlassNavRail from '@/components/layout/GlassNavRail';

const LetterWritingScreen = dynamic(
  () => import('@/components/letter/LetterWritingScreen'),
  { ssr: false, loading: () => null }
);

export default function WriteLetterPage() {
  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <TopBar showSearch={false} />
      <LetterWritingScreen />
      <GlassNavRail activeId="photos" />
    </main>
  );
}
