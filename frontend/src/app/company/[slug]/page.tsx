"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { companyService } from "@/services/company.service";
import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  ShieldCheck,
  Package,
  Star,
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Globe,
  Phone,
  ArrowLeft,
  Boxes,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Company {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  description: string;
  website?: string;
  phone: string;
  country: string;
  city: string;
  verifiedAt?: string;
  plan: string;
  _count: { products: number; reviews: number };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductsResponse {
  items: any[];
  categories: Category[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ─── Skeleton loaders ────────────────────────────────────────────────────────

function CompanyHeaderSkeleton() {
  return (
    <div className="bg-surface border-b border-steel/10">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-80" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-[4/3] rounded-xl" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ hasFilters, onReset }: { hasFilters: boolean; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6 bg-surface rounded-2xl border border-dashed border-steel/20">
      <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
        <Boxes className="w-10 h-10 text-steel/30" />
      </div>
      <h3 className="text-2xl font-barlow font-bold mb-2">
        {hasFilters ? "Sin resultados" : "Catálogo vacío"}
      </h3>
      <p className="text-steel text-sm max-w-xs mb-6">
        {hasFilters
          ? "No encontramos productos con los filtros aplicados. Prueba ajustando tu búsqueda."
          : "Este proveedor aún no ha publicado productos. Vuelve pronto."}
      </p>
      {hasFilters && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <X className="w-4 h-4" /> Limpiar filtros
        </button>
      )}
    </div>
  );
}

// ─── Company not found ───────────────────────────────────────────────────────

function NotFoundState() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-24 text-center">
        <AlertCircle className="w-16 h-16 text-danger/50 mx-auto mb-6" />
        <h1 className="text-3xl font-barlow font-bold mb-3">Proveedor no encontrado</h1>
        <p className="text-steel mb-8">La empresa que buscas no existe o no está disponible.</p>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Marketplace
        </Link>
      </div>
    </main>
  );
}

// ─── Storefront page ─────────────────────────────────────────────────────────

export default function CompanyStorefrontPage() {
  const { slug } = useParams<{ slug: string }>();

  // Filter state
  const [search, setSearch]                   = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange]           = useState([0, 500_000]);
  const [sort, setSort]                       = useState("newest");
  const [transactionType, setTransactionType] = useState<"all" | "sale" | "rent">("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(true);

  // Build query params for the API (no debounce needed — react-query handles re-fetches)
  const productParams = useMemo(() => ({
    search:     search   || undefined,
    categoryId: selectedCategory || undefined,
    minPrice:   priceRange[0] > 0       ? priceRange[0] : undefined,
    maxPrice:   priceRange[1] < 500_000 ? priceRange[1] : undefined,
    sort:       sort !== "newest" ? sort : undefined,
    type:       transactionType !== "all" ? transactionType : undefined,
    limit:      24,
  }), [search, selectedCategory, priceRange, sort, transactionType]);

  const hasActiveFilters =
    !!search ||
    !!selectedCategory ||
    priceRange[0] > 0 ||
    priceRange[1] < 500_000 ||
    sort !== "newest" ||
    transactionType !== "all";

  const resetFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("");
    setPriceRange([0, 500_000]);
    setSort("newest");
    setTransactionType("all");
  }, []);

  // Data fetching
  const {
    data: company,
    isLoading: companyLoading,
    isError: companyError,
  } = useQuery<Company>({
    queryKey: ["company", slug],
    queryFn: () => companyService.getCompanyBySlug(slug),
    retry: false,
  });

  const {
    data: productsData,
    isLoading: productsLoading,
  } = useQuery<ProductsResponse>({
    queryKey: ["company-products", slug, productParams],
    queryFn: () => companyService.getCompanyProducts(slug, productParams),
    enabled: !!company,
    placeholderData: (prev) => prev,
  });

  // ─── Error / Not found ────────────────────────────────────────────────────
  if (companyError) return <NotFoundState />;

  const products   = productsData?.items      ?? [];
  const categories = productsData?.categories ?? [];
  const meta       = productsData?.meta;

  // ─── Sidebar content (shared desktop + mobile) ───────────────────────────
  const Sidebar = (
    <div className="space-y-8">
      {/* Transaction type toggle */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-steel mb-3">Tipo</p>
        <div className="flex bg-background border border-steel/10 rounded-lg p-1 gap-1">
          {(["all", "sale", "rent"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTransactionType(t)}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                transactionType === t
                  ? "bg-primary text-white shadow-sm"
                  : "text-steel hover:text-foreground"
              }`}
            >
              {t === "all" ? "Todos" : t === "sale" ? "Comprar" : "Rentar"}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-steel mb-3">Ordenar por</p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full text-sm border border-steel/20 rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="newest">Más recientes</option>
          <option value="oldest">Más antiguos</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="views">Más vistos</option>
        </select>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-steel mb-3 flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" /> Categorías
          </p>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cat-all"
                checked={!selectedCategory}
                onCheckedChange={() => setSelectedCategory("")}
              />
              <Label htmlFor="cat-all" className="text-sm cursor-pointer hover:text-accent transition-colors font-medium">
                Todas las categorías
              </Label>
            </div>
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`cat-${cat.id}`}
                  checked={selectedCategory === cat.id}
                  onCheckedChange={() =>
                    setSelectedCategory(selectedCategory === cat.id ? "" : cat.id)
                  }
                />
                <Label
                  htmlFor={`cat-${cat.id}`}
                  className="text-sm cursor-pointer hover:text-accent transition-colors"
                >
                  {cat.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price range */}
      <div className="pt-2 border-t border-steel/10">
        <button
          onClick={() => setShowPriceFilter((p) => !p)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest text-steel mb-3"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Rango de Precio
          </span>
          {showPriceFilter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showPriceFilter && (
          <>
            <Slider
              defaultValue={[0, 500_000]}
              max={1_000_000}
              step={1_000}
              value={priceRange}
              onValueChange={(v: number | readonly number[]) =>
                setPriceRange(Array.isArray(v) ? [...v] : [v as number, priceRange[1]])
              }
              className="mb-4"
            />
            <div className="flex justify-between text-xs font-mono text-steel">
              <span>USD {new Intl.NumberFormat().format(priceRange[0])}</span>
              <span>USD {new Intl.NumberFormat().format(priceRange[1])}</span>
            </div>
          </>
        )}
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-steel/20 text-sm font-semibold text-steel hover:text-danger hover:border-danger/30 transition-colors"
        >
          <X className="w-4 h-4" /> Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* ── Company Header ── */}
      {companyLoading ? (
        <CompanyHeaderSkeleton />
      ) : company ? (
        <section className="bg-surface border-b border-steel/10">
          {/* Back link */}
          <div className="container mx-auto px-4 pt-5">
            <Link
              href="/marketplace"
              className="inline-flex items-center text-xs font-semibold text-steel hover:text-primary transition-colors gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al Marketplace
            </Link>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Logo */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-background border border-steel/10 shadow-sm shrink-0 flex items-center justify-center">
                {company.logoUrl ? (
                  <Image
                    src={company.logoUrl}
                    alt={company.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <span className="text-4xl font-barlow font-bold text-primary/40">
                    {company.name[0]}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-3xl font-barlow font-bold tracking-tight leading-none">
                    {company.name}
                  </h1>
                  {company.verifiedAt && (
                    <Badge className="bg-success/10 text-success border-success/20 gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verificada
                    </Badge>
                  )}
                  {company.plan !== "BASIC" && (
                    <Badge className="bg-accent/10 text-accent border-accent/20 uppercase text-[10px] tracking-wider">
                      {company.plan}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mb-3 mt-1">
                  <div className="flex items-center text-[#ffc107]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < 4 ? "fill-current" : "fill-current opacity-30"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-bold ml-1 text-foreground">4.8</span>
                  <span className="text-sm text-steel hover:underline cursor-pointer transition-colors">
                    ({company._count.reviews || 24} reseñas)
                  </span>
                </div>

                <p className="text-sm text-steel line-clamp-2 mb-3 max-w-2xl">{company.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-steel">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {company.city}, {company.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    {company._count.products} producto{company._count.products !== 1 ? "s" : ""}
                  </span>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-accent transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" /> Sitio web
                    </a>
                  )}
                  <a
                    href={`tel:${company.phone}`}
                    className="flex items-center gap-1 hover:text-accent transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> {company.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ── Catalog body ── */}
      <div className="container mx-auto px-4 py-8">
        {/* Search bar + mobile filter toggle */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-steel w-4 h-4 pointer-events-none" />
            <Input
              placeholder="Buscar en este catálogo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 border-steel/20"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-steel hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-steel/20 rounded-lg text-sm font-semibold hover:bg-surface transition-colors"
            onClick={() => setShowMobileFilters(true)}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-accent" />
            )}
          </button>
        </div>

        {/* Results summary */}
        {!productsLoading && meta && (
          <p className="text-sm text-steel mb-5">
            {meta.total === 0
              ? "Sin resultados"
              : `${meta.total} producto${meta.total !== 1 ? "s" : ""} encontrado${meta.total !== 1 ? "s" : ""}`}
            {hasActiveFilters && (
              <button onClick={resetFilters} className="ml-2 text-accent hover:underline text-xs">
                limpiar filtros
              </button>
            )}
          </p>
        )}

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* ── Desktop Sidebar ── */}
          <aside className="hidden lg:block sticky top-24 h-fit">{Sidebar}</aside>

          {/* ── Product grid ── */}
          <section>
            {productsLoading ? (
              <ProductGridSkeleton />
            ) : products.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState hasFilters={hasActiveFilters} onReset={resetFilters} />
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <p className="text-sm text-steel">
                  Página {meta.page} de {meta.totalPages}
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ── Mobile filters overlay ── */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-background p-6 shadow-xl overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-barlow font-bold">FILTROS</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            {Sidebar}
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
            >
              VER RESULTADOS
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
