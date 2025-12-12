/**
 * Map configuration constants
 */

// CartoDB Voyager tile layer URL (matches the clean, modern look requested)
export const TILE_LAYER_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

// Attribution for CartoDB
export const TILE_LAYER_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Default map center coordinates (centered on world view, slightly favoring Asia)
export const DEFAULT_CENTER = [13, 80.2];

// Default zoom level (shows world view)
export const DEFAULT_ZOOM = 13;

// Minimum zoom level
export const MIN_ZOOM = 2;

// Maximum zoom level
export const MAX_ZOOM = 18;

// Cluster configuration
export const CLUSTER_CONFIG = {
    // Show coverage on hover
    showCoverageOnHover: true,
    // Zoom to bounds on cluster click
    zoomToBoundsOnClick: true,
    // Spiderfy on max zoom
    spiderfyOnMaxZoom: true,
    // Remove outside visible bounds
    removeOutsideVisibleBounds: true,
    // Animate adding markers
    animate: true,
    // Maximum cluster radius in pixels
    maxClusterRadius: 80,
};
