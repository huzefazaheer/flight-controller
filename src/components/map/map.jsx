import styles from './styles.module.css'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef, useState } from 'react'

// Fix Leaflet marker icons (Webpack issue)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

export default function Map({
  waypoints,
  className,
  coords,
  setCoords,
  fdata,
}) {
  const [showToast, setShowToast] = useState(false)
  const [CurrentLocation, setCurrentLocation] = useState({ lat: 0, lng: 1 })
  const hasFliedRef = useRef(false)
  const markerRef = useRef(null)

  const positionMarkerIcon = L.icon({
    iconUrl: 'currentlocation.svg',
    iconSize: [24, 24],
  })

  function MapUpdater({ center }) {
    const map = useMap()
    useEffect(() => {
      if (hasFliedRef.current == false) {
        setTimeout(() => {
          map.flyTo(center, map.getZoom())
          hasFliedRef.current = true
          markerRef.current = L.marker(center, {
            icon: positionMarkerIcon,
          }).addTo(map)
        }, 2000)
      }
      if (markerRef.current != null) {
        console.log(markerRef.current.setLatLng(center))
      }
    }, [center])
    return null
  }

  const markers = waypoints.map((waypoint, index) => {
    return (
      <Marker key={waypoint.id} position={[waypoint.lat, waypoint.lng]}>
        <Popup>{'WP no:' + index + 1}</Popup>
      </Marker>
    )
  })

  return (
    <div className={styles.map}>
      <MapContainer
        className={className}
        o
        center={[fdata.posRef.current[0], fdata.posRef.current[1]]}
        zoom={13}
      >
        <MapUpdater
          center={[fdata.posRef.current[0], fdata.posRef.current[1]]}
        />
        {/* ESRI World Imagery Layer */}
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

        {/* Example Marker */}
        {markers}
        <HoverHandler
          coords={coords}
          setCoords={setCoords}
          setShowToast={setShowToast}
          showToast={showToast}
          setCurrentLocation={setCurrentLocation}
        />
        <GPSLoc CurrentLocation={CurrentLocation} />
      </MapContainer>
      {showToast ? <Toast coords={coords}></Toast> : ''}
    </div>
  )
}

function HoverHandler({
  coords,
  setCoords,
  setShowToast,
  showToast,
  setCurrentLocation,
}) {
  useMapEvents({
    contextmenu: (e) => {
      setCoords(e.latlng) // Update coordinates on mouse move
      setShowToast(!showToast)
    },
    mouseup: (e) => {
      setTimeout(() => {
        setShowToast(false)
      }, 2000)
    },
    mousemove: (e) => {
      setCurrentLocation(e.latlng)
    },
  })

  //Show current coords on hover
  return (
    coords && (
      <div className={styles.coorddisplay}>
        {/* Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)} */}
      </div>
    )
  )
}

function Toast({ coords }) {
  return (
    <div className={styles.toast}>
      <h3>Copied Coordinate</h3>
      <p>{'Latitude: ' + coords.lat}</p>
      <p>{'Longitude: ' + coords.lng}</p>
    </div>
  )
}

function GPSLoc({ CurrentLocation }) {
  return (
    <div className={styles.currloc}>
      <p>{'Lat:' + CurrentLocation.lat}</p>
      <p>{'Lng:' + CurrentLocation.lng}</p>
    </div>
  )
}
