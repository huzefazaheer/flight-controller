// components/ESRIMap.jsx
'use client'; // Mark as Client Component (Next.js 13+)

import styles from "./styles.module.css"

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState } from "react";

// Fix Leaflet marker icons (Webpack issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


export default function Map({waypoints, className, coords, setCoords}){
    const defaultPosition = [33.6844, 73.0479]; // ISB coordinates

    const markers = waypoints.map(waypoint => {
        return(
            <Marker key={waypoint.id} position={[waypoint.lat, waypoint.lng]}>
            {/* <Popup>{waypoint.id}</Popup> */}
            </Marker>
        )
    })

  return (
    <MapContainer className={className} o
      center={defaultPosition}
      zoom={13}
    >
      {/* ESRI World Imagery Layer */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {/* Example Marker */}
      {markers}
      <HoverHandler coords={coords} setCoords={setCoords}/>   

    </MapContainer>
  );
}


function HoverHandler({coords, setCoords}) {

  useMapEvents({
    mousedown: (e) => {
      setCoords(e.latlng); // Update coordinates on mouse move
    },
  });

  return coords && (
    <div className="coord-display">
      Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)}
    </div>
  );
}