"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart, MessageSquare, Star } from "lucide-react";
import { StarRating } from "@/components/star-rating";

interface ReviewListingCardProps {
  product: any;
}

export function ReviewListingCard({ product }: ReviewListingCardProps) {
  const isRental =
    product.transactionType === "RENTAL" || product.transactionType === "BOTH";
  const mainImage =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1579412691970-ef9b60cff9ad?q=80&w=800";

  const getPriceDisplay = () => {
    if (isRental && product.pricePerDay) {
      return `$${new Intl.NumberFormat().format(Number(product.pricePerDay))} / día`;
    }
    return `${product.currency || "USD"} $${new Intl.NumberFormat().format(product.price)}`;
  };

  return (
    <Link href={`/marketplace/${product.slug}`}>
      <div className="bg-white border border-[#EBEBEB] rounded-[4px] p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col md:flex-row gap-6 mb-4">
        {/* Image Section */}
        <div className="relative w-full md:w-64 aspect-video md:aspect-[4/3] rounded-[4px] overflow-hidden bg-[#F5F5F5] flex-shrink-0">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isRental && (
              <span className="bg-[#8E44AD] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide shadow-sm">
                En Alquiler
              </span>
            )}
            {product.condition === "NEW" && (
              <span className="bg-[#27AE60] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide shadow-sm">
                Nuevo
              </span>
            )}
          </div>
          <button
            className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-gray-500 hover:text-[#D32323] transition-colors shadow-sm"
            onClick={(e) => e.preventDefault()}
          >
            <Heart size={16} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-[#0073BB] hover:underline line-clamp-1 mb-1">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="mb-2">
            <StarRating rating={4.5} count={0} size="md" showCount={false} />
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#2D2E2F] mb-3">
            <span className="bg-[#F5F5F5] px-2 py-0.5 rounded text-xs font-bold text-[#5C6370]">
              {product.brand}
            </span>
            <span className="text-[#EBEBEB]">·</span>
            <span className="text-[#5C6370] font-medium">
              {product.condition === "NEW"
                ? "Nuevo"
                : product.condition === "REFURBISHED"
                ? "Reacondicionado"
                : "Usado"}
            </span>
            <span className="text-[#EBEBEB]">·</span>
            <span className="text-[#5C6370] font-medium">{product.year}</span>
            <span className="text-[#EBEBEB]">·</span>
            <span className="text-[#0073BB] font-bold flex items-center gap-1">
              <MapPin size={14} /> {product.city}, {product.country}
            </span>
          </div>

          {/* Description Snippet */}
          <div className="flex items-start gap-2 text-sm text-[#2D2E2F] mb-4 bg-[#F5F5F5] p-3 rounded-[4px] border border-[#EBEBEB]">
            <MessageSquare
              size={16}
              className="text-gray-400 mt-0.5 flex-shrink-0"
            />
            <p className="italic text-[#5C6370] line-clamp-2 font-medium">
              {product.description || "Equipo en excelente estado, ideal para proyectos industriales."}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-[#EBEBEB] pt-4">
            <div>
              <span className="text-xs text-[#5C6370] block mb-0.5 font-bold uppercase tracking-wider">
                {isRental ? "Precio de renta" : "Precio de venta"}
              </span>
              <div className="text-2xl font-bold text-[#2D2E2F]">
                {getPriceDisplay()}
              </div>
            </div>
            <span className="inline-flex items-center justify-center font-bold bg-[#D32323] text-white hover:bg-[#A61A1A] transition-colors px-6 py-2.5 text-sm rounded-[4px] shadow-sm">
              Solicitar Cotización
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
