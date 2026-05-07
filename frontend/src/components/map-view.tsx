"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon
const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapViewProps {
  lat: number;
  lng: number;
  address?: string;
  title?: string;
}

export default function MapView({ lat, lng, address, title }: MapViewProps) {
  const position: [number, number] = [lat, lng];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-[#EBEBEB] shadow-sm">
      <MapContainer 
        center={position} 
        zoom={14} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon}>
          <Popup>
            <div className="text-sm">
              <p className="font-bold text-[#D32323] mb-1">{title || "Ubicación del Equipo"}</p>
              <p className="text-[#5C6370]">{address || "Ubicación aproximada"}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
