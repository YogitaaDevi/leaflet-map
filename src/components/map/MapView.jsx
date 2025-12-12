'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import MarkerItem from './MarkerItem';
import { eventsData } from '@/data/eventsData';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  TILE_LAYER_URL,
  TILE_LAYER_ATTRIBUTION,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  CLUSTER_CONFIG
} from '@/lib/map/mapConfig';

/**
 * MapController component - Handles map navigation based on filtered events
 */
const MapController = ({ events }) => {
  const map = useMap();

  useEffect(() => {
    if (events.length > 0) {
      // Calculate bounds of all visible events
      const bounds = L.latLngBounds(events.map(e => [e.latitude, e.longitude]));
      // Fly to bounds with padding to ensure markers aren't at the very edge
      map.flyToBounds(bounds, { 
        padding: [50, 50], 
        maxZoom: 15,
        duration: 1.5 // Smooth animation duration
      });
    } else {
      // Reset to default view if no events (or all cleared)
      map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, {
        duration: 1.5
      });
    }
  }, [events, map]);

  return null;
};

/**
 * MapView component - Main map container with clustering functionality
 */
const MapView = () => {
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing map...</p>
        </div>
      </div>
    );
  }

  // Filter events based on selected cities in URL
  const selectedCities = searchParams.get('city')?.split(',').filter(Boolean) || [];
  
  const filteredEvents = selectedCities.length > 0
    ? eventsData.filter(event => selectedCities.includes(event.cityname))
    : eventsData;

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      className="map-container"
    >
      <MapController events={filteredEvents} />

      {/* OpenStreetMap Tile Layer */}
      <TileLayer
        attribution={TILE_LAYER_ATTRIBUTION}
        url={TILE_LAYER_URL}
      />

      {/* Marker Cluster Group with all events */}
      <MarkerClusterGroup
        {...CLUSTER_CONFIG}
        iconCreateFunction={(cluster) => {
          const count = cluster.getChildCount();
          const markers = cluster.getAllChildMarkers();
          
          // Get up to 3 logo URLs from the markers in this cluster
          const logoUrls = markers
            .slice(0, 3)
            .map(marker => marker.options.logoUrl)
            .filter(Boolean); // Filter out undefined/null

          // Generate HTML for stacked images
          const imagesHtml = logoUrls.map((url, index) => 
            `<img src="${url}" class="cluster-stack-img" alt="Event Logo" />`
          ).join('');

          return L.divIcon({
            html: `
              <div class="cluster-container">
                <div class="cluster-pill">${count} Events</div>
                <div class="cluster-ring"></div>
                <div class="cluster-stack-container">
                  ${imagesHtml}
                </div>
              </div>
            `,
            className: 'custom-cluster-icon',
            iconSize: L.point(60, 60, true),
            iconAnchor: [30, 30] // Center the icon
          });
        }}
      >
        {filteredEvents.map((event, index) => (
          <MarkerItem key={index} event={event} />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapView;
