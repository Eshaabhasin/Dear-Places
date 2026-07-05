'use client';

import { use } from 'react';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import GlassNavRail from '@/components/layout/GlassNavRail';
import { destinations } from '@/data/destinations';

const CityMiniatureWorld = dynamic(
  () => import('@/components/city/CityMiniatureWorld'),
  { ssr: false, loading: () => null }
);

export default function CityPage({ params }) {
  const { slug } = use(params);
  const destination = destinations.find((d) => d.slug === slug);

  if (!destination) {
    notFound();
  }

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <TopBar showSearch={false} />
      <CityMiniatureWorld destination={destination} />
      <GlassNavRail activeId="atlas" />
    </main>
  );
}
