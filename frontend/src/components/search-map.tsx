"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Custom Yelp-style Marker Icon with Number
const createYelpIcon = (number: number, isHovered: boolean) => {
  return L.divIcon({
    className: "custom-yelp-icon",
    html: `
      <div class="relative flex items-center justify-center">
        <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.2));">
          <path d="M17 0C7.61116 0 0 7.61116 0 17C0 28.5 17 42 17 42C17 42 34 28.5 34 17C34 7.61116 26.3888 0 17 0Z" fill="${isHovered ? '#0073BB' : '#D32323'}"/>
          <circle cx="17" cy="17" r="13" fill="white"/>
          <text x="17" y="21" font-family="Arial" font-size="12" font-weight="bold" fill="${isHovered ? '#0073BB' : '#D32323'}" text-anchor="middle">${number}</text>
        </svg>
      </div>
    `,
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -40],
  });
};

interface SearchMapProps {
  products: any[];
  hoveredProductId?: string | null;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function SearchMap({ products, hoveredProductId }: SearchMapProps) {
  const markerRefs = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (hoveredProductId && markerRefs.current[hoveredProductId]) {
      markerRefs.current[hoveredProductId].openPopup();
    }
  }, [hoveredProductId]);

  const validProducts = products.filter(p => p.latitude && p.longitude);
  
  const center: [number, number] = validProducts.length > 0 
    ? [Number(validProducts[0].latitude), Number(validProducts[0].longitude)]
    : [10.4806, -66.9036]; // Caracas

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={center} 
        zoom={6} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {validProducts.map((product, idx) => (
          <Marker 
            key={product.id} 
            position={[Number(product.latitude), Number(product.longitude)]} 
            icon={createYelpIcon(idx + 1, hoveredProductId === product.id)}
            ref={(ref) => {
              if (ref) markerRefs.current[product.id] = ref;
            }}
            zIndexOffset={hoveredProductId === product.id ? 1000 : 0}
          >
            <Popup className="yelp-popup">
              <div className="w-52 overflow-hidden rounded-lg shadow-xl border-none">
                <div className="relative h-28 w-full">
                  <Image 
                    src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1579412691970-ef9b60cff9ad?q=80&w=400"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#D32323] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    {idx + 1}
                  </div>
                </div>
                <div className="p-3 bg-white">
                  <Link href={`/marketplace/${product.slug}`} className="font-bold text-sm text-[#0073BB] hover:underline block line-clamp-2 mb-1 leading-tight">
                    {product.title}
                  </Link>
                  <div className="flex items-center gap-1.5 mb-2">
                     <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} className="w-3 h-3 text-[#F15C00]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                     </div>
                     <span className="text-[10px] text-[#5C6370] font-medium">(12)</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-[#5C6370] font-medium">{product.city}</p>
                    <p className="text-sm font-bold text-[#2D2E2F]">
                      ${new Intl.NumberFormat().format(product.price)}
                    </p>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {validProducts.length > 0 && <ChangeView center={center} zoom={6} />}
      </MapContainer>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
        <button className="bg-white px-5 py-2.5 rounded-full shadow-xl border border-[#EBEBEB] text-xs font-bold text-[#2D2E2F] hover:bg-gray-50 flex items-center gap-2 transition-all active:scale-95">
           Buscar en esta área
        </button>
      </div>
    </div>
  );
}
