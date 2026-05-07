"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { productsService } from "@/services/products.service";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Pickaxe,
  Tractor,
  Package,
  Zap,
  Star,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/star-rating";

const heroCategories = [
  { name: "Excavadoras", icon: Pickaxe },
  { name: "Tractores", icon: Tractor },
  { name: "Carretillas", icon: Package },
  { name: "Generadores", icon: Zap },
];

const directoryLinks = {
  construccion: [
    "Excavadoras de cadenas",
    "Cargadoras de ruedas",
    "Miniexcavadoras",
    "Retroexcavadoras",
    "Manipuladores telescópicos",
    "Grúas móviles",
    "Rodillos compactadores",
  ],
  agricultura: [
    "Tractores",
    "Cosechadoras",
    "Sembradoras",
    "Pulverizadores",
    "Remolques",
    "Empacadoras",
    "Arados",
  ],
  repuestos: [
    "Motores",
    "Cilindros hidráulicos",
    "Bombas",
    "Cucharones",
    "Cabinas",
    "Transmisiones",
    "Neumáticos",
  ],
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const router = useRouter();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => productsService.getProducts({ limit: 4 }),
  });

  const products = productsData?.items || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] font-sans text-[#2D2E2F]">
      <Header />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 flex flex-col items-center justify-center min-h-[520px]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1920"
            className="w-full h-full object-cover"
            alt="Fondo Industrial"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 w-full max-w-[900px] px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-8 tracking-tight drop-shadow-md">
            Encuentra la maquinaria perfecta
          </h1>

          {/* Dual Search Bar */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-[4px] flex flex-col md:flex-row shadow-2xl p-1 md:p-0 overflow-hidden"
          >
            <div className="flex-1 flex items-center px-4 py-3 md:border-r border-[#EBEBEB]">
              <span className="text-[#2D2E2F] font-bold mr-2 text-sm shrink-0">
                Buscar
              </span>
              <input
                type="text"
                placeholder="ej. Excavadoras, Tractores, Komatsu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-[#2D2E2F] placeholder-[#9099A6] focus:outline-none font-medium"
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3 border-t md:border-t-0 border-[#EBEBEB]">
              <span className="text-[#2D2E2F] font-bold mr-2 text-sm shrink-0">
                Cerca de
              </span>
              <input
                type="text"
                placeholder="Ubicación, ej. Monterrey, NL"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full text-[#2D2E2F] placeholder-[#9099A6] focus:outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              className="bg-[#D32323] hover:bg-[#A61A1A] text-white p-4 md:px-8 rounded-b-[4px] md:rounded-r-[4px] md:rounded-bl-none transition-colors flex items-center justify-center cursor-pointer shadow-inner"
            >
              <Search size={24} />
            </button>
          </form>

          {/* Quick Categories */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-white">
            {heroCategories.map((cat) => (
              <Link
                key={cat.name}
                href={`/marketplace?search=${encodeURIComponent(cat.name)}`}
                className="flex items-center gap-2 opacity-90 hover:opacity-100 hover:underline transition-all drop-shadow-sm"
              >
                <cat.icon size={18} />
                <span className="font-bold text-sm">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-[1248px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT: Featured Products */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#D32323] mb-6">
              Equipos Mejor Valorados
            </h2>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 bg-white rounded-[4px] p-4 border border-[#EBEBEB]">
                    <Skeleton className="w-64 aspect-video rounded-md" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-8 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className="text-center mt-10">
              <Link
                href="/marketplace"
                className="text-[#0073BB] font-bold hover:underline inline-flex items-center gap-1"
              >
                Ver más resultados <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Recommended Companies */}
            <div className="bg-white border border-[#EBEBEB] rounded-[4px] p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-[#2D2E2F]">
                Distribuidores Recomendados
              </h3>
              <div className="space-y-5">
                {[
                  { initials: "CA", name: "Caterpillar Distribuidora MX", rating: 5, reviews: 128 },
                  { initials: "TC", name: "Tractores del Centro", rating: 4, reviews: 84 },
                  { initials: "KM", name: "Komatsu México", rating: 4, reviews: 62 },
                ].map((company) => (
                  <div key={company.name} className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-[#F5F5F5] rounded-[4px] border border-[#EBEBEB] flex items-center justify-center font-bold text-[#5C6370] text-sm shrink-0">
                      {company.initials}
                    </div>
                    <div>
                      <a href="#" className="font-bold text-[#0073BB] hover:underline text-sm block mb-0.5">
                        {company.name}
                      </a>
                      <StarRating rating={company.rating} count={company.reviews} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Banner */}
            <div className="bg-white border border-[#EBEBEB] rounded-[4px] p-6 shadow-sm text-center">
              <p className="text-[10px] text-[#9099A6] font-bold uppercase mb-3 tracking-widest">Anuncio</p>
              <div className="w-16 h-16 bg-[#D32323]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D32323]/20">
                <ShieldCheck size={32} className="text-[#D32323]" />
              </div>
              <h4 className="font-bold text-lg mb-2 text-[#2D2E2F]">Asegura tu maquinaria</h4>
              <p className="text-sm text-[#5C6370] mb-5 leading-relaxed">
                Pólizas especiales para maquinaria pesada desde $99/mes.
              </p>
              <button className="w-full bg-[#D32323] hover:bg-[#A61A1A] text-white shadow-md font-bold text-sm py-3 px-5 rounded-[4px] transition-colors cursor-pointer">
                Ver opciones
              </button>
            </div>
          </div>
        </div>

        {/* DIRECTORY LINKS */}
        <div className="mt-20 pt-16 border-t border-[#EBEBEB]">
          <h2 className="text-2xl font-bold text-center mb-10 text-[#2D2E2F]">Explorar por Categoría</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1000px] mx-auto">
            {Object.entries(directoryLinks).map(([key, links]) => {
              const titles: Record<string, string> = {
                construccion: "Maquinaria de Construcción",
                agricultura: "Equipos Agrícolas",
                repuestos: "Piezas y Repuestos",
              };
              return (
                <div key={key}>
                  <h4 className="font-bold text-[#2D2E2F] mb-4 text-sm border-b border-[#EBEBEB] pb-2">
                    {titles[key]}
                  </h4>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link}>
                        <Link
                          href={`/marketplace?search=${encodeURIComponent(link)}`}
                          className="text-[#0073BB] hover:underline text-sm font-medium"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}