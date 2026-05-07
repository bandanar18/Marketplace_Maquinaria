"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products.service";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { ReviewListingCard } from "@/components/review-listing-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, LayoutGrid, List as ListIcon, MapPin, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SearchMap = dynamic(() => import("@/components/search-map"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#F5F5F5] animate-pulse flex items-center justify-center text-gray-400 font-bold">Cargando Mapa de Maquinaria...</div>
});

export default function MarketplacePage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const [transactionType, setTransactionType] = useState<"all" | "sale" | "rent">("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState("recommended");
  const [showMap, setShowMap] = useState(true);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  // Filter States
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [suggestedFilters, setSuggestedFilters] = useState<string[]>([]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productsService.getCategories(),
  });

  // Calculate price range based on inputs
  const getEffectivePriceRange = () => {
    return {
      minPrice: minPriceInput ? parseFloat(minPriceInput) : undefined,
      maxPrice: maxPriceInput ? parseFloat(maxPriceInput) : undefined,
    };
  };

  const { minPrice, maxPrice } = getEffectivePriceRange();

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", search, transactionType, minPriceInput, maxPriceInput, selectedCategories, suggestedFilters, sortBy],
    queryFn: () =>
      productsService.getProducts({
        search,
        type: transactionType === "all" ? undefined : transactionType,
        minPrice,
        maxPrice,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
        availability: suggestedFilters.includes("Entrega Inmediata") ? "IN_STOCK" : undefined,
        verifiedOnly: suggestedFilters.includes("Vendedores Verificados") ? true : undefined,
        sortBy,
      }),
  });

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleSuggested = (opt: string) => {
    setSuggestedFilters(prev => 
      prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
    );
  };

  return (
    <main className="bg-white h-screen flex flex-col overflow-hidden">
      <Header />

      {/* Categories Horizontal Bar (Yelp Style) */}
      <div className="border-b border-[#EBEBEB] bg-white z-40 shrink-0">
        <div className="max-w-full mx-auto px-6 h-12 flex items-center gap-6 overflow-x-auto no-scrollbar">
           {categories?.map((cat: any) => (
             <button 
               key={cat.id} 
               onClick={() => toggleCategory(cat.id)}
               className={`text-sm font-bold whitespace-nowrap flex items-center gap-1 transition-colors ${
                 selectedCategories.includes(cat.id) ? "text-[#D32323]" : "text-[#5C6370] hover:text-[#D32323]"
               }`}
             >
               {cat.name} <ChevronDown size={14} />
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT COLUMN: FILTERS (Fixed width) */}
        <aside className="hidden xl:block w-[240px] border-r border-[#EBEBEB] bg-white p-6 overflow-y-auto shrink-0">
          <h2 className="font-bold text-lg text-[#2D2E2F] mb-6">Filtros</h2>
          
          <div className="space-y-8">
            {/* Transaction Type Filter */}
            <div>
              <h3 className="font-bold text-sm text-[#2D2E2F] mb-3">Tipo de Operación</h3>
              <div className="flex flex-col gap-2">
                {[
                  { value: "all", label: "Todos" },
                  { value: "sale", label: "Compra" },
                  { value: "rent", label: "Alquiler" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="transactionType"
                      checked={transactionType === opt.value}
                      onChange={() => setTransactionType(opt.value as any)}
                      className="w-4 h-4 accent-[#D32323]" 
                    />
                    <span className={`text-sm transition-colors ${
                      transactionType === opt.value ? "text-[#D32323] font-bold" : "text-[#2D2E2F] group-hover:text-[#D32323]"
                    }`}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter (Inputs) */}
            <div>
              <h3 className="font-bold text-sm text-[#2D2E2F] mb-3">Rango de Precio ($)</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-[#EBEBEB] rounded-md outline-none focus:border-[#D32323]"
                />
                <span className="text-[#9099A6]">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-[#EBEBEB] rounded-md outline-none focus:border-[#D32323]"
                />
              </div>
            </div>

            {/* Suggested Filters */}
            <div>
              <h3 className="font-bold text-sm text-[#2D2E2F] mb-3">Sugeridos</h3>
              <div className="space-y-2.5">
                {["Entrega Inmediata", "Vendedores Verificados", "Financiamiento", "Garantía Extendida"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={suggestedFilters.includes(opt)}
                      onChange={() => toggleSuggested(opt)}
                      className="w-4 h-4 rounded border-[#EBEBEB] accent-[#D32323]" 
                    />
                    <span className={`text-sm transition-colors ${
                      suggestedFilters.includes(opt) ? "text-[#D32323] font-bold" : "text-[#2D2E2F] group-hover:text-[#D32323]"
                    }`}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Distance Filter */}
            <div>
              <h3 className="font-bold text-sm text-[#2D2E2F] mb-3">Distancia</h3>
              <div className="space-y-2.5">
                {["Cualquier distancia", "Menos de 10 km", "Menos de 50 km", "Menos de 100 km"].map((dist, i) => (
                  <label key={dist} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="radio" name="distance" defaultChecked={i===0} className="w-4 h-4 accent-[#D32323]" />
                    <span className="text-sm text-[#2D2E2F] group-hover:text-[#D32323] transition-colors">{dist}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories List */}
            <div>
              <h3 className="font-bold text-sm text-[#2D2E2F] mb-3">Categorías</h3>
              <div className="space-y-2">
                {categories?.map((cat: any) => (
                  <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="w-4 h-4 rounded border-[#EBEBEB] accent-[#D32323]" 
                    />
                    <span className={`text-sm transition-colors ${
                      selectedCategories.includes(cat.id) ? "text-[#D32323] font-bold" : "text-[#2D2E2F] group-hover:text-[#D32323]"
                    }`}>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* MIDDLE COLUMN: RESULTS */}
        <div className={`flex-1 overflow-y-auto bg-white ${showMap ? 'lg:max-w-[calc(100vw-700px)]' : 'max-w-full'}`}>
          <div className="p-6 md:p-8 min-h-full flex flex-col">
            
            {/* Results Title & Controls */}
            <div className="mb-8 shrink-0">
               <div className="flex items-center justify-between gap-4 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-[#2D2E2F]">
                    {search ? `Maquinaria para "${search}" en Venezuela` : "La Mejor Maquinaria Pesada cerca de ti"}
                  </h1>
                  <div className="flex border border-[#EBEBEB] rounded-[4px] overflow-hidden shrink-0">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#D32323] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    >
                      <ListIcon size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#D32323] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    >
                      <LayoutGrid size={16} />
                    </button>
                  </div>
               </div>
               
               <div className="flex items-center justify-between border-b border-[#EBEBEB] pb-4">
                  <p className="text-sm text-[#5C6370] font-medium">
                    Mostrando todos los resultados ({productsData?.meta?.total || 0})
                  </p>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setShowMap(!showMap)}
                      className="text-sm font-bold text-[#0073BB] hover:underline flex items-center gap-1.5"
                    >
                      <MapPin size={16} /> {showMap ? "Ocultar Mapa" : "Mostrar Mapa"}
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2D2E2F] uppercase">Ordenar:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm font-bold text-[#0073BB] bg-transparent outline-none cursor-pointer"
                      >
                        <option value="recommended">Recomendados</option>
                        <option value="rating">Calificación</option>
                        <option value="price_asc">Menor Precio</option>
                        <option value="price_desc">Mayor Precio</option>
                      </select>
                    </div>
                  </div>
               </div>
            </div>

            {/* Results Grid/List */}
            <div className="flex-1">
              {isLoading ? (
                <div className="space-y-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-6 bg-white border border-[#EBEBEB] rounded-lg p-4 animate-pulse">
                      <Skeleton className="w-64 aspect-video rounded-md bg-gray-100" />
                      <div className="flex-1 space-y-4">
                        <Skeleton className="h-6 w-3/4 bg-gray-100" />
                        <Skeleton className="h-4 w-1/4 bg-gray-100" />
                        <Skeleton className="h-12 w-full bg-gray-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : productsData?.items?.length > 0 ? (
                <div className={viewMode === "list" ? "space-y-10" : "grid sm:grid-cols-2 gap-8"}>
                  {productsData.items.map((product: any, idx: number) => (
                    <div 
                      key={product.id} 
                      className="relative"
                      onMouseEnter={() => setHoveredProductId(product.id)}
                      onMouseLeave={() => setHoveredProductId(null)}
                    >
                      <div className={`absolute -left-4 top-2 w-7 h-7 bg-white border rounded-full flex items-center justify-center text-sm font-bold z-10 shadow-md transition-all duration-300 ${
                        hoveredProductId === product.id ? 'border-[#D32323] bg-[#D32323] text-white scale-110' : 'border-[#EBEBEB] text-[#2D2E2F]'
                      }`}>
                        {idx + 1}
                      </div>
                      {viewMode === "list" ? (
                        <ReviewListingCard product={product} />
                      ) : (
                        <ProductCard product={product} />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-[#F5F5F5] rounded-xl border border-dashed border-[#EBEBEB]">
                  <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-[#2D2E2F]">No se encontraron máquinas</h3>
                  <p className="text-[#5C6370] mt-2">Prueba ajustando los filtros o buscando algo más específico.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {productsData?.items?.length > 0 && (
              <div className="mt-12 mb-8 flex flex-col items-center gap-4 shrink-0">
                <div className="flex items-center gap-2">
                   <button className="px-4 py-2 text-sm font-bold text-[#5C6370] hover:text-[#2D2E2F] disabled:opacity-30" disabled>Anterior</button>
                   {[1, 2, 3, '...', 10].map((p, i) => (
                     <button key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${p === 1 ? 'bg-[#D32323] text-white shadow-lg' : 'text-[#5C6370] hover:bg-gray-100'}`}>
                        {p}
                     </button>
                   ))}
                   <button className="px-4 py-2 text-sm font-bold text-[#0073BB] hover:underline">Siguiente</button>
                </div>
                <p className="text-xs text-[#5C6370] font-medium">1-10 de {productsData.meta.total} resultados</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: MAP (Fixed) */}
        {showMap && (
          <aside className="hidden lg:block w-[460px] border-l border-[#EBEBEB] relative h-full shrink-0">
            <SearchMap products={productsData?.items || []} hoveredProductId={hoveredProductId} />
          </aside>
        )}
      </div>
    </main>
  );
}
