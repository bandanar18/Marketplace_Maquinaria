"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { productsService } from "@/services/products.service";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuoteModal } from "@/components/quote-modal";
import { StarRating } from "@/components/star-rating";
import {
  MapPin,
  ShieldCheck,
  Phone,
  Mail,
  FileText,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Info
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/map-view"), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-steel">Cargando Mapa...</div>
});

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsService.getProductBySlug(slug as string),
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F7F8FA]">
        <Header />
        <div className="max-w-[1248px] mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-video rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) return <div>Producto no encontrado</div>;

  const images =
    product.images.length > 0
      ? product.images
      : [
          {
            url: "https://images.unsplash.com/photo-1579412691970-ef9b60cff9ad?q=80&w=2000",
          },
        ];

  const isRental =
    product.transactionType === "RENTAL" || product.transactionType === "BOTH";

  return (
    <main className="min-h-screen bg-[#F7F8FA] pb-20">
      <Header />

      <div className="max-w-[1248px] mx-auto px-4 py-6">
        <Link
          href="/marketplace"
          className="inline-flex items-center text-sm font-medium text-[#0073BB] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Marketplace
        </Link>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          {/* Left Column: Gallery & Content */}
          <div className="space-y-10">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-white border border-[#E2E6EA] shadow-sm">
                <Image
                  src={images[activeImage].url}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImage((prev) =>
                          prev > 0 ? prev - 1 : images.length - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImage((prev) =>
                          prev < images.length - 1 ? prev + 1 : 0
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-20 aspect-video rounded-md overflow-hidden border-2 transition-all ${
                      activeImage === idx
                        ? "border-[#D32323] shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${product.title} ${idx}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="w-full justify-start border-b border-[#E2E6EA] h-14 p-0 bg-transparent gap-8">
                <TabsTrigger
                  value="specs"
                  className="data-[state=active]:border-[#D32323] data-[state=active]:text-[#D32323] border-b-2 border-transparent rounded-none h-full px-0 font-bold"
                >
                  ESPECIFICACIONES
                </TabsTrigger>
                <TabsTrigger
                  value="desc"
                  className="data-[state=active]:border-[#D32323] data-[state=active]:text-[#D32323] border-b-2 border-transparent rounded-none h-full px-0 font-bold"
                >
                  DESCRIPCIÓN
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="data-[state=active]:border-[#D32323] data-[state=active]:text-[#D32323] border-b-2 border-transparent rounded-none h-full px-0 font-bold"
                >
                  UBICACIÓN
                </TabsTrigger>
                <TabsTrigger
                  value="docs"
                  className="data-[state=active]:border-[#D32323] data-[state=active]:text-[#D32323] border-b-2 border-transparent rounded-none h-full px-0 font-bold"
                >
                  DOCUMENTOS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="specs" className="py-8">
                <div className="grid md:grid-cols-2 gap-y-0 gap-x-12">
                  {[
                    { label: "Marca", value: product.brand },
                    { label: "Modelo", value: product.model },
                    { label: "Año", value: product.year },
                    {
                      label: "Condición",
                      value:
                        product.condition === "NEW"
                          ? "Nuevo"
                          : product.condition === "REFURBISHED"
                          ? "Reacondicionado"
                          : "Usado",
                    },
                  ].map((spec) => (
                    <div
                      key={spec.label}
                      className="flex justify-between py-3 border-b border-[#E2E6EA]/50 even:bg-[#FAFBFC]"
                    >
                      <span className="text-[#9099A6] font-mono text-xs">
                        {spec.label}
                      </span>
                      <span className="font-mono text-sm font-medium">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                  {product.specs &&
                    Object.entries(product.specs).map(
                      ([key, val]: [string, any]) => (
                        <div
                          key={key}
                          className="flex justify-between py-3 border-b border-[#E2E6EA]/50"
                        >
                          <span className="text-[#9099A6] font-mono text-xs capitalize">
                            {key}
                          </span>
                          <span className="font-mono text-sm font-medium">
                            {val}
                          </span>
                        </div>
                      )
                    )}
                </div>
              </TabsContent>

              <TabsContent
                value="desc"
                className="py-8 text-[#5C6370] leading-relaxed"
              >
                <p className="whitespace-pre-line">{product.description}</p>
              </TabsContent>

              <TabsContent value="map" className="py-8 space-y-6">
                <div className="flex items-center gap-2 p-4 bg-[#F5F5F5] rounded-lg border border-[#EBEBEB]">
                  <MapPin className="w-5 h-5 text-[#D32323]" />
                  <div>
                    <p className="font-bold text-sm text-[#2D2E2F]">
                      {product.address || "Dirección no especificada"}
                    </p>
                    <p className="text-xs text-[#5C6370]">
                      {product.city}, {product.country}
                    </p>
                  </div>
                </div>
                
                {product.latitude && product.longitude ? (
                  <MapView 
                    lat={Number(product.latitude)} 
                    lng={Number(product.longitude)} 
                    address={product.address}
                    title={product.title}
                  />
                ) : (
                  <div className="h-[300px] w-full bg-[#F5F5F5] rounded-xl flex flex-col items-center justify-center text-[#5C6370] border border-dashed border-[#EBEBEB]">
                    <MapPin className="w-10 h-10 mb-2 opacity-20" />
                    <p className="font-medium">Coordenadas exactas no disponibles</p>
                    <p className="text-xs">Contacta al vendedor para más información</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="docs" className="py-8">
                <div className="grid gap-4">
                  <div className="flex items-center p-4 bg-white border border-[#E2E6EA] rounded-lg hover:border-[#D32323] transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-[#D32323]/10 rounded-lg flex items-center justify-center mr-4">
                      <FileText className="w-5 h-5 text-[#D32323]" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        Ficha Técnica_Certificada.pdf
                      </p>
                      <p className="text-xs text-[#9099A6]">
                        Descargar documento oficial
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: Buying Section */}
          <div className="space-y-6">
            <div className="p-8 bg-white border border-[#E2E6EA] rounded-lg shadow-lg sticky top-24">
              <div className="flex justify-between items-start mb-4">
                <div>
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-2">
                    {product.availability === "IN_STOCK" && (
                      <span className="bg-[#EAFAF1] text-[#27AE60] text-xs font-bold px-2 py-0.5 rounded border border-[#27AE60]/20">
                        DISPONIBLE
                      </span>
                    )}
                    {isRental && (
                      <span className="bg-[#F5EEF8] text-[#8E44AD] text-xs font-bold px-2 py-0.5 rounded border border-[#8E44AD]/20">
                        EN RENTA
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-[#1A1A2E] tracking-tight">
                    {product.title}
                  </h1>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-[#F7F8FA] rounded-full transition-colors">
                    <Heart className="w-5 h-5 text-[#5C6370]" />
                  </button>
                  <button className="p-2 hover:bg-[#F7F8FA] rounded-full transition-colors">
                    <Share2 className="w-5 h-5 text-[#5C6370]" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <StarRating rating={4.5} count={0} size="md" showCount={false} />
              </div>

              {/* Price */}
              <div className="mb-8">
                {isRental ? (
                  <div>
                    {product.pricePerDay && (
                      <div className="text-3xl font-bold text-[#D32323]">
                        $
                        {new Intl.NumberFormat().format(
                          Number(product.pricePerDay)
                        )}{" "}
                        <span className="text-lg text-[#5C6370]">/ día</span>
                      </div>
                    )}
                    {product.pricePerWeek && (
                      <div className="text-lg font-bold text-[#D32323] mt-1">
                        $
                        {new Intl.NumberFormat().format(
                          Number(product.pricePerWeek)
                        )}{" "}
                        <span className="text-sm text-[#5C6370]">/ sem</span>
                      </div>
                    )}
                    {product.pricePerMonth && (
                      <div className="text-lg font-bold text-[#D32323] mt-1">
                        $
                        {new Intl.NumberFormat().format(
                          Number(product.pricePerMonth)
                        )}{" "}
                        <span className="text-sm text-[#5C6370]">/ mes</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-[#D32323]">
                    {product.currency} $
                    {new Intl.NumberFormat().format(product.price)}
                  </div>
                )}
              </div>

              {/* Location & Trust */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-3 text-[#5C6370]" />
                  <span className="font-medium">
                    {product.city}, {product.country}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <ShieldCheck className="w-4 h-4 mr-3 text-[#27AE60]" />
                  <span className="text-[#27AE60] font-medium">
                    Vendedor Verificado
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="w-full bg-[#D32323] hover:bg-[#A61A1A] text-white font-bold h-14 text-lg rounded-md transition-colors cursor-pointer shadow-md"
                >
                  Solicitar Cotización
                </button>
                <button className="w-full border-2 border-[#1C2B3A] text-[#1C2B3A] hover:bg-[#1C2B3A] hover:text-white font-bold h-12 rounded-md transition-colors flex items-center justify-center cursor-pointer">
                  <Phone className="w-4 h-4 mr-2" /> Contactar Vendedor
                </button>
              </div>

              {/* Company Info */}
              <div className="mt-8 pt-8 border-t border-[#E2E6EA]">
                <p className="text-xs font-bold text-[#9099A6] uppercase mb-4 tracking-widest">
                  Vendido por
                </p>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-lg mr-4 flex items-center justify-center font-bold text-[#2D2E2F] border border-[#EBEBEB]">
                    {product.company?.name?.[0]}
                  </div>
                  <div>
                    <p className="font-bold leading-tight text-[#2D2E2F]">
                      {product.company?.name}
                    </p>
                    <Link
                      href={`/company/${product.company?.slug}`}
                      className="text-xs text-[#0073BB] hover:underline font-bold"
                    >
                      Ver catálogo completo
                    </Link>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="p-2.5 bg-[#F5F5F5] rounded-md border border-[#EBEBEB] hover:bg-gray-100 transition-colors cursor-pointer">
                    <Phone className="w-4 h-4 text-[#D32323]" />
                  </div>
                  <div className="p-2.5 bg-[#F5F5F5] rounded-md border border-[#EBEBEB] hover:bg-gray-100 transition-colors cursor-pointer">
                    <Mail className="w-4 h-4 text-[#D32323]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuoteModal
        product={product}
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />

      <Footer />
    </main>
  );
}
