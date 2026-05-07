"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { favoritesService } from "@/services/favorites.service";
import { toast } from "sonner";
import { StarRating } from "@/components/star-rating";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const isRental =
    product.transactionType === "RENTAL" || product.transactionType === "BOTH";
  const isSale =
    product.transactionType === "SALE" || product.transactionType === "BOTH";

  const mainImage =
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1579412691970-ef9b60cff9ad?q=80&w=800";

  useEffect(() => {
    if (user) {
      checkIfFavorited();
    }
  }, [user, product.id]);

  const checkIfFavorited = async () => {
    try {
      const { isFavorited } = await favoritesService.isFavorited(product.id);
      setIsFavorited(isFavorited);
    } catch (error) {
      // Silently fail
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Debes iniciar sesión para guardar favoritos");
      return;
    }

    setIsPending(true);
    try {
      const res = await favoritesService.toggleFavorite(product.id);
      setIsFavorited(res.favorited);
      toast.success(
        res.favorited ? "Añadido a favoritos" : "Eliminado de favoritos"
      );
    } catch (error) {
      toast.error("Error al gestionar favoritos");
    } finally {
      setIsPending(false);
    }
  };

  const getPriceDisplay = () => {
    if (isRental && product.pricePerDay) {
      return `$${new Intl.NumberFormat().format(Number(product.pricePerDay))} / día`;
    }
    return `$${new Intl.NumberFormat().format(product.price)}`;
  };

  return (
    <div className="bg-white border border-[#EBEBEB] rounded-[4px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#F5F5F5]">
        <Link href={`/marketplace/${product.slug}`}>
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {product.condition === "NEW" && (
            <span className="bg-[#EAFAF1] text-[#27AE60] text-[10px] font-bold px-2 py-0.5 rounded border border-[#27AE60]/20">
              NUEVO
            </span>
          )}
          {product.condition === "USED" && (
            <span className="bg-[#FEF9E7] text-[#F39C12] text-[10px] font-bold px-2 py-0.5 rounded border border-[#F39C12]/20">
              USADO
            </span>
          )}
          {isRental && (
            <span className="bg-[#F5EEF8] text-[#8E44AD] text-[10px] font-bold px-2 py-0.5 rounded border border-[#8E44AD]/20">
              ALQUILER
            </span>
          )}
          {isSale && !isRental && (
            <span className="bg-[#EBF5FB] text-[#2980B9] text-[10px] font-bold px-2 py-0.5 rounded border border-[#2980B9]/20">
              VENTA
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={toggleFavorite}
          disabled={isPending}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-sm transition-all ${
            isFavorited
              ? "bg-[#D32323] text-white"
              : "bg-white/90 text-[#2D2E2F] hover:text-[#D32323]"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="mb-1.5">
          <StarRating rating={4.5} count={0} size="sm" showCount={false} />
        </div>

        {/* Title */}
        <Link href={`/marketplace/${product.slug}`}>
          <h3 className="font-bold text-[#0073BB] hover:underline text-base line-clamp-1 mb-1">
            {product.title}
          </h3>
        </Link>

        {/* Company */}
        <p className="text-xs text-[#5C6370] mb-2 font-medium">
          {product.company?.name} · {product.brand}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-[#5C6370] mb-3">
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="w-3 h-3" /> {product.year}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3 h-3" /> {product.city}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between border-t border-[#EBEBEB] pt-3">
          <span className="text-lg font-bold text-[#D32323]">
            {getPriceDisplay()}
          </span>
          <Link
            href={`/marketplace/${product.slug}`}
            className="bg-[#D32323] hover:bg-[#A61A1A] text-white font-bold text-xs px-4 py-2 rounded-[4px] transition-colors"
          >
            Cotizar
          </Link>
        </div>
      </div>
    </div>
  );
}
