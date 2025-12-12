'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, Suspense } from 'react';
import FilterBar from '@/components/map/FilterBar';

// Dynamically import MapView with no SSR to avoid Leaflet window issues
const MapView = dynamic(
  () => import('@/components/map/MapView'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
);

/**
 * Map page - Interactive world map with event markers
 */
export default function MapPage() {
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    // Force remount on client side only
    setMapKey(1);
  }, []);

  return (
    <main className="h-screen w-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg z-20">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Interactive World Map</h1>
          <p className="text-blue-100 mt-1">Explore events around the globe</p>
        </div>
      </header>

      {/* Content Container */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Filter Bar */}
        <Suspense fallback={<div className="w-80 bg-white border-r h-full"></div>}>
          <FilterBar />
        </Suspense>

        {/* Map Container */}
        <div className="flex-1 relative">
          {mapKey > 0 && <MapView key={mapKey} />}
        </div>
      </div>
    </main>
  );
}
