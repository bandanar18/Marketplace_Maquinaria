"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { companyService } from "@/services/company.service";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, ShieldCheck, Search, Star, MessageSquare, Package } from "lucide-react";
import Link from "next/link";
import { StarRating } from "@/components/star-rating";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");

  const { data: companiesData, isLoading } = useQuery({
    queryKey: ["companies", search],
    queryFn: () => companyService.getCompanies({ search }),
  });

  const companies = companiesData?.items || [];

  return (
    <main className="bg-[#F5F5F5] min-h-screen font-sans">
      <Header />

      {/* Results Header */}
      <div className="bg-white border-b border-[#EBEBEB] py-8">
        <div className="max-w-[1248px] mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#2D2E2F]">
              Distribuidores y Tiendas
            </h1>
            <p className="text-[#5C6370] mt-1 font-medium">
              Encuentra los mejores proveedores de maquinaria pesada e industrial
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o ciudad..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#EBEBEB] rounded-[4px] pl-11 pr-4 py-3 shadow-sm outline-none focus:border-[#D32323] transition-colors font-medium"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1248px] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10">
        {/* Left: Main Content */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-6 text-[#2D2E2F]">
            {isLoading ? "Buscando distribuidores..." : `${companiesData?.meta?.total || 0} proveedores encontrados`}
          </h2>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-6 border-b border-[#EBEBEB] pb-8 bg-white p-6 rounded-[4px]">
                  <Skeleton className="w-48 h-48 rounded-lg" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : companies.length > 0 ? (
            <div className="space-y-6">
              {companies.map((company: any, index: number) => (
                <div key={company.id} className="flex flex-col md:flex-row gap-6 border border-[#EBEBEB] bg-white p-6 rounded-[4px] hover:shadow-md transition-shadow group">
                  {/* Logo */}
                  <Link href={`/company/${company.slug}`} className="shrink-0">
                    <div className="relative w-full md:w-48 aspect-square rounded-[4px] border border-[#EBEBEB] overflow-hidden bg-[#F5F5F5] flex items-center justify-center shadow-inner">
                      {company.logoUrl ? (
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <div className="text-4xl font-black text-gray-300 uppercase">
                          {company.name[0]}
                        </div>
                      )}
                      {company.verifiedAt && (
                        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm border border-green-100">
                          <ShieldCheck size={18} className="text-[#27AE60]" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                      <div>
                        <Link href={`/company/${company.slug}`}>
                          <h3 className="text-2xl font-bold text-[#0073BB] hover:underline">
                            {index + 1}. {company.name}
                          </h3>
                        </Link>
                        <div className="mt-1 flex items-center gap-2">
                          <StarRating rating={4.5} count={company._count?.reviews || 0} size="md" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#5C6370] font-bold text-sm bg-[#F5F5F5] px-3 py-1.5 rounded-[4px] border border-[#EBEBEB]">
                        <MapPin size={16} /> {company.city}, {company.country}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#2D2E2F] mb-4">
                      <span className="flex items-center gap-1.5 font-bold text-[#D32323]">
                        <Package size={16} /> {company._count?.products || 0} Equipos
                      </span>
                      <span className="text-[#EBEBEB]">|</span>
                      <span className="bg-[#EAFAF1] text-[#27AE60] text-xs font-bold px-2 py-0.5 rounded border border-[#27AE60]/20">
                        Vendedor Verificado
                      </span>
                    </div>

                    <p className="text-[#5C6370] line-clamp-3 mb-6 italic bg-[#F5F5F5] p-4 rounded-[4px] border-l-4 border-[#D32323] font-medium">
                      <MessageSquare size={16} className="inline mr-2 opacity-30" />
                      {company.description || "Este distribuidor ofrece una amplia gama de maquinaria industrial con los más altos estándares de calidad y servicio técnico especializado."}
                    </p>

                    <div className="flex gap-3">
                      <Link
                        href={`/company/${company.slug}`}
                        className="bg-[#D32323] hover:bg-[#A61A1A] text-white font-bold px-6 py-2.5 rounded-[4px] text-sm transition-colors shadow-sm"
                      >
                        Ver Inventario
                      </Link>
                      <button className="border border-[#EBEBEB] bg-white hover:bg-[#F5F5F5] text-[#2D2E2F] font-bold px-6 py-2.5 rounded-[4px] text-sm transition-colors shadow-sm">
                        Contactar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[4px] border border-dashed border-[#EBEBEB]">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#2D2E2F]">No encontramos distribuidores</h3>
              <p className="text-[#5C6370] mt-1 font-medium">Intenta con otro nombre de empresa o ciudad.</p>
              <button
                className="mt-4 text-[#D32323] font-bold text-sm hover:underline"
                onClick={() => setSearch("")}
              >
                Limpiar búsqueda
              </button>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <aside className="w-full lg:w-80 space-y-8">
          {/* Ad / Promo */}
          <div className="bg-[#2D2E2F] rounded-[4px] p-8 text-white text-center shadow-lg">
            <Package size={48} className="mx-auto mb-4 text-[#D32323]" />
            <h3 className="text-xl font-bold mb-2">¿Eres distribuidor?</h3>
            <p className="text-[#9099A6] text-sm mb-8 leading-relaxed">
              Aumenta tus ventas publicando tu inventario en la plataforma líder del sector industrial.
            </p>
            <Link
              href="/auth/register/company"
              className="block w-full bg-[#D32323] hover:bg-[#A61A1A] text-white font-bold py-3.5 rounded-[4px] transition-colors shadow-md"
            >
              Registrar Empresa
            </Link>
          </div>

          {/* Quick Filters */}
          <div className="bg-white border border-[#EBEBEB] rounded-[4px] p-6 shadow-sm">
            <h3 className="font-bold mb-4 text-[#2D2E2F] border-b border-[#EBEBEB] pb-2">Ciudades Destacadas</h3>
            <div className="space-y-3">
              {["Monterrey", "Ciudad de México", "Guadalajara", "Querétaro", "Puebla"].map(city => (
                <button
                  key={city}
                  onClick={() => setSearch(city)}
                  className="block text-[#0073BB] hover:underline text-sm font-bold"
                >
                  Distribuidores en {city}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <Footer />
    </main>
  );
}
