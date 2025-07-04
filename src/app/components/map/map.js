// components/ESRIMap.jsx
'use client'; // Mark as Client Component (Next.js 13+)

import styles from "./styles.module.css"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons (Webpack issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


export default function Map({className}){
    const defaultPosition = [33.6844, 73.0479]; // ISB coordinates

  return (
    <MapContainer className={className}
      center={defaultPosition}
      zoom={13}
    >
      {/* ESRI World Imagery Layer */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {/* Example Marker */}
      <Marker position={defaultPosition}>
        <Popup>Intersection </Popup>
      </Marker>
    </MapContainer>
  );
}