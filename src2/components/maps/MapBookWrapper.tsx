'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MapBook = dynamic(() => import('./MapBook'), {
  ssr: false,
});

export default function MapBookWrapper() {
  return (
    <Suspense fallback={<div>Loading map…</div>}>
      <MapBook />
    </Suspense>
  );
}
