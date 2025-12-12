import L from 'leaflet';

/**
 * Creates a custom Leaflet icon from a logo URL
 * @param {string} logoUrl - URL of the logo image
 * @returns {L.Icon} Leaflet icon instance
 */
export const createCustomIcon = (logoUrl) => {
    return L.icon({
        iconUrl: logoUrl,
        iconSize: [40, 40], // Size of the icon
        iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -40], // Point from which the popup should open relative to the iconAnchor
        className: 'custom-marker-icon' // Custom class for styling
    });
};

/**
 * Creates a custom divIcon with an image background
 * Alternative approach using divIcon for more styling flexibility
 * @param {string} logoUrl - URL of the logo image
 * @returns {L.DivIcon} Leaflet divIcon instance
 */
export const createCustomDivIcon = (logoUrl) => {
    return L.divIcon({
        html: `
      <div class="custom-marker-image" style="
        width: 40px;
        height: 40px;
        background-image: url('${logoUrl}');
        background-size: cover;
        background-position: center;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      "></div>
    `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
        className: 'custom-div-marker-icon'
    });
};
