"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ShieldCheck, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CompanyCardProps {
  company: {
    id: string;
    slug: string;
    name: string;
    logoUrl?: string | null;
    coverUrl?: string | null;
    city: string;
    country: string;
    verifiedAt?: string | null;
    rating?: number;
    reviewsCount?: number;
  };
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/distribuidores/${company.slug}`}>
      <Card className="border-[#EBEBEB] hover:shadow-xl transition-all duration-300 overflow-hidden bg-white group h-full">
        <div className="h-24 bg-gray-100 relative overflow-hidden">
          <Image 
            src={company.coverUrl || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800"} 
            alt={company.name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {company.verifiedAt && (
            <Badge className="absolute top-2 right-2 bg-[#27AE60] text-white border-none text-[10px] font-black uppercase">
              Verificado
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4 relative">
          {/* Logo overlay */}
          <div className="absolute -top-10 left-4 w-16 h-16 rounded-lg border-4 border-white bg-white shadow-md overflow-hidden shrink-0 z-10">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain p-1" />
            ) : (
              <div className="w-full h-full bg-[#F5F5F5] flex items-center justify-center font-bold text-[#9099A6] text-xs">
                {company.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="pt-8 space-y-3">
            <div>
              <h3 className="font-black text-[#1C2B3A] leading-tight line-clamp-1 group-hover:text-[#D32323] transition-colors">
                {company.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex items-center text-[#F1C40F]">
                  {[1,2,3,4,5].map(i => <ShieldCheck key={i} size={10} className="fill-current" />)}
                </div>
                <span className="text-[10px] font-bold text-[#5C6370]">5.0 (24 reseñas)</span>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-gray-50 pt-3">
              <p className="text-[11px] text-[#5C6370] flex items-center gap-2">
                <MapPin size={12} className="text-[#D32323]" /> {company.city}, {company.country}
              </p>
              <p className="text-[11px] text-[#27AE60] flex items-center gap-2 font-bold">
                <Clock size={12} /> Abierto ⋅ Cierra 18:00
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between text-[#0073BB] font-black text-[10px] uppercase tracking-wider">
              <span>Ver Inventario</span>
              <ChevronRight size={14} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
