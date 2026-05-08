"use client";

import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";

interface MapViewProps {
  lat: number;
  lng: number;
  address?: string;
  title?: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function MapView({ lat, lng, address, title }: MapViewProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [showInfoWindow, setShowInfoWindow] = useState(true);

  const position = { lat, lng };

  if (!isLoaded) {
    return (
      <div className="h-[400px] w-full bg-[#F5F5F5] animate-pulse flex items-center justify-center text-gray-400 font-bold rounded-xl border border-[#EBEBEB]">
        Cargando Mapa...
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-[#EBEBEB] shadow-sm">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={position}
        zoom={14}
        options={{
          disableDefaultUI: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        <Marker 
          position={position} 
          onClick={() => setShowInfoWindow(true)}
        />
        
        {showInfoWindow && (
          <InfoWindow
            position={position}
            onCloseClick={() => setShowInfoWindow(false)}
          >
            <div className="p-1 max-w-[200px]">
              <p className="font-bold text-[#D32323] text-sm mb-0.5">{title || "Ubicación del Equipo"}</p>
              <p className="text-[#5C6370] text-xs">{address || "Ubicación aproximada"}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
