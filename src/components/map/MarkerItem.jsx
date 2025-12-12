import { Marker, Popup } from 'react-leaflet';
import { createCustomDivIcon } from '@/lib/map/customIcon';

/**
 * MarkerItem component - Renders a single event marker with custom icon and popup
 * @param {Object} event - Event data object
 */
const MarkerItem = ({ event }) => {
  const { eventname, latitude, longitude, location, cityname, logo_url } = event;
  
  // Create custom icon from logo URL
  const customIcon = createCustomDivIcon(logo_url);

  return (
    <Marker 
      position={[latitude, longitude]} 
      icon={customIcon}
      logoUrl={logo_url}
    >
      <Popup>
        <div className="popup-content">
          <h3 className="font-bold text-lg mb-2">{eventname}</h3>
          <p className="text-sm text-gray-700">
            <strong>Location:</strong> {location}
          </p>
          <p className="text-sm text-gray-700">
            <strong>City:</strong> {cityname}
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

export default MarkerItem;
