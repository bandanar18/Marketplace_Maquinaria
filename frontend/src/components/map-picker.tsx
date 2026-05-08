"use client";

import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useState, useCallback, useEffect } from "react";

interface MapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onChange: (lat: number, lng: number) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function MapPicker({ initialLat, initialLng, onChange }: MapPickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  );

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setPosition(newPos);
      onChange(newPos.lat, newPos.lng);
    }
  }, [onChange]);

  const defaultCenter = { 
    lat: initialLat || 10.4806, 
    lng: initialLng || -66.9036 
  }; // Caracas as default

  if (!isLoaded) {
    return (
      <div className="h-[300px] w-full bg-[#F5F5F5] animate-pulse flex items-center justify-center text-gray-400 font-bold rounded-lg border border-gray-200">
        Cargando Mapa...
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden border border-gray-200">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={position || defaultCenter}
        zoom={position ? 14 : 6}
        onClick={onMapClick}
        options={{
          disableDefaultUI: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {position && (
          <Marker position={position} />
        )}
      </GoogleMap>
    </div>
  );
}
