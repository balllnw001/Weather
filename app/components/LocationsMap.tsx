'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  darkMode: boolean;
  cities: any[];
  newCity: { lat: number; lon: number } | null;
  setNewCity: (c: { lat: number; lon: number } | null) => void;
}

function ClickHandler({ setNewCity }: { setNewCity: (c: { lat: number; lon: number } | null) => void }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setNewCity({ lat, lon: lng });
    },
  });
  return null;
}

const LocationsMap = ({ darkMode, cities, newCity, setNewCity }: Props) => {
  return (
    <MapContainer center={[13.7563, 100.5018]} zoom={6} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url={
          darkMode
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        }
        attribution="&copy; OpenStreetMap contributors"
      />

      <ClickHandler setNewCity={setNewCity} />

      {newCity && (
        <Marker position={[newCity.lat, newCity.lon]}>
          <Popup>
            <strong>ตำแหน่งใหม่</strong>
            <br />
            Lat: {newCity.lat.toFixed(4)}, Lon: {newCity.lon.toFixed(4)}
          </Popup>
        </Marker>
      )}

      {cities.map((city, idx) => (
        <Marker key={city.id || idx} position={[city.lat, city.lon]}>
          <Popup>
            <strong>{city.name}</strong>
            <br />
            Lat: {city.lat.toFixed(4)}, Lon: {city.lon.toFixed(4)}
            <br />
            {city.timezone && `Timezone: ${city.timezone}`}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LocationsMap;
