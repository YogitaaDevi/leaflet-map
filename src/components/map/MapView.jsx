'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapContainer, TileLayer, useMap, Marker, Popup, Circle } from 'react-leaflet';
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
 * LocationController component - Centers map on user location
 */
const LocationController = ({ userLocation, shouldCenter, onCentered }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation && shouldCenter) {
      map.flyTo([userLocation.lat, userLocation.lng], 15, {
        duration: 1.5
      });
      // Reset the flag after centering
      if (onCentered) {
        setTimeout(() => onCentered(), 1600); // Slightly longer than animation duration
      }
    }
  }, [userLocation, shouldCenter, map, onCentered]);

  return null;
};

/**
 * MapView component - Main map container with clustering functionality
 */
const MapView = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [shouldCenterOnLocation, setShouldCenterOnLocation] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Function to get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          accuracy: position.coords.accuracy
        });
        setShouldCenterOnLocation(true);
        setIsLocating(false);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Create custom icon for user location
  const userLocationIcon = L.divIcon({
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    className: 'user-location-marker'
  });

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
    <>
      {/* Location Button */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={getUserLocation}
          disabled={isLocating}
          className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-2 px-4 rounded-lg shadow-lg border border-gray-200 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Get my location"
        >
          {isLocating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Locating...</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>My Location</span>
            </>
          )}
        </button>
        {locationError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-lg text-sm max-w-xs">
            {locationError}
          </div>
        )}
      </div>

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
        <LocationController 
          userLocation={userLocation} 
          shouldCenter={shouldCenterOnLocation}
          onCentered={() => setShouldCenterOnLocation(false)}
        />

        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution={TILE_LAYER_ATTRIBUTION}
          url={TILE_LAYER_URL}
        />

        {/* User Location Marker */}
        {userLocation && (
          <>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userLocation.accuracy || 50}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                weight: 2
              }}
            />
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userLocationIcon}
            >
              <Popup>
                <div className="popup-content">
                  <h3 className="font-bold text-lg mb-2">Your Location</h3>
                  <p className="text-sm text-gray-700">
                    <strong>Latitude:</strong> {userLocation.lat.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Longitude:</strong> {userLocation.lng.toFixed(6)}
                  </p>
                  {userLocation.accuracy && (
                    <p className="text-sm text-gray-700">
                      <strong>Accuracy:</strong> ±{Math.round(userLocation.accuracy)}m
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          </>
        )}

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
    </>
  );
};

export default MapView;
