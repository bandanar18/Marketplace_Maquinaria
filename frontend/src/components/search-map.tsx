"use client";

import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface SearchMapProps {
  products: any[];
  hoveredProductId?: string | null;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};


export default function SearchMap({ products, hoveredProductId }: SearchMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const validProducts = useMemo(() => 
    products.filter(p => p.latitude && p.longitude),
    [products]
  );

  const center = useMemo(() => {
    if (validProducts.length > 0) {
      return { 
        lat: Number(validProducts[0].latitude), 
        lng: Number(validProducts[0].longitude) 
      };
    }
    return { lat: 10.4806, lng: -66.9036 }; // Caracas
  }, [validProducts]);

  useEffect(() => {
    if (hoveredProductId) {
      const product = validProducts.find(p => p.id === hoveredProductId);
      if (product) {
        setSelectedProduct(product);
        if (map) {
          map.panTo({ lat: Number(product.latitude), lng: Number(product.longitude) });
        }
      }
    }
  }, [hoveredProductId, validProducts, map]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-full w-full bg-[#F5F5F5] animate-pulse flex items-center justify-center text-gray-400 font-bold">
        Cargando Google Maps...
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={6}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {validProducts.map((product, idx) => (
          <Marker
            key={product.id}
            position={{ lat: Number(product.latitude), lng: Number(product.longitude) }}
            onClick={() => setSelectedProduct(product)}
            label={{
              text: (idx + 1).toString(),
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
            }}
            icon={{
              path: "M17 0C7.61116 0 0 7.61116 0 17C0 28.5 17 42 17 42C17 42 34 28.5 34 17C34 7.61116 26.3888 0 17 0Z",
              fillColor: hoveredProductId === product.id || selectedProduct?.id === product.id ? "#0073BB" : "#D32323",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#FFFFFF",
              scale: 0.8,
              anchor: new google.maps.Point(17, 42),
              labelOrigin: new google.maps.Point(17, 17),
            }}
            zIndex={hoveredProductId === product.id ? 1000 : 0}
          />
        ))}

        {selectedProduct && (
          <InfoWindow
            position={{ lat: Number(selectedProduct.latitude), lng: Number(selectedProduct.longitude) }}
            onCloseClick={() => setSelectedProduct(null)}
          >
            <div className="w-52 overflow-hidden rounded-lg">
              <div className="relative h-28 w-full">
                <Image 
                  src={selectedProduct.images?.[0]?.url || "https://images.unsplash.com/photo-1579412691970-ef9b60cff9ad?q=80&w=400"}
                  alt={selectedProduct.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2 bg-white">
                <Link href={`/marketplace/${selectedProduct.slug}`} className="font-bold text-sm text-[#0073BB] hover:underline block line-clamp-1 mb-1">
                  {selectedProduct.title}
                </Link>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-[#5C6370]">{selectedProduct.city}</p>
                  <p className="text-sm font-bold text-[#2D2E2F]">
                    ${new Intl.NumberFormat().format(selectedProduct.price)}
                  </p>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[10]">
        <button className="bg-white px-5 py-2.5 rounded-full shadow-xl border border-[#EBEBEB] text-xs font-bold text-[#2D2E2F] hover:bg-gray-50 flex items-center gap-2 transition-all active:scale-95">
           Buscar en esta área
        </button>
      </div>
    </div>
  );
}
