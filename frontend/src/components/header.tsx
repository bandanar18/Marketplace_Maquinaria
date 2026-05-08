"use client";

import Link from "next/link";
import { Search, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header
      className={`${
        isHome
          ? "absolute bg-black/30 backdrop-blur-sm border-b border-white/10"
          : "sticky bg-[#D32323] shadow-md border-b-0"
      } top-0 left-0 w-full z-50`}
    >
      <div className="max-w-[1248px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div
            className={`${
              isHome ? "bg-[#D32323] text-white" : "bg-white text-[#D32323]"
            } w-9 h-9 rounded flex items-center justify-center font-black text-lg shadow-sm`}
          >
            M
          </div>
          <span className="text-xl font-black text-white tracking-tight hidden sm:block">
            maquinaria
          </span>
        </Link>

        {/* Inner Search Bar (non-home pages) */}
        {!isHome && (
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-2xl bg-white rounded items-center p-0.5 shadow-inner"
          >
            <input
              placeholder="Maquinaria (ej. Excavadoras)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 flex-1 outline-none text-sm text-[#2D2E2F] bg-transparent"
            />
            <div className="w-px h-5 bg-gray-300 mx-1" />
            <input
              placeholder="Cerca de (ej. Monterrey)"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="px-3 py-2 flex-1 outline-none text-sm text-[#2D2E2F] bg-transparent"
            />
            <button
              type="submit"
              className="bg-[#D32323] text-white p-2 rounded hover:bg-[#A61A1A] transition-colors"
            >
              <Search size={16} />
            </button>
          </form>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/vende"
            className="text-white font-bold text-sm hover:text-gray-200 hidden md:block"
          >
            Vende tu Maquinaria
          </Link>

          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 py-1 px-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/20"
            >
              <div className="w-7 h-7 bg-[#E85D04] text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
              <span className="text-sm font-semibold text-white hidden md:block">
                {user.firstName}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="text-white font-bold text-sm hover:underline"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/register"
                className="border-2 border-white text-white hover:bg-white hover:text-[#E85D04] font-bold text-sm px-4 py-1.5 rounded-md transition-colors hidden sm:block"
              >
                Registrarse
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Category Sub-Nav (non-home) */}
      {!isHome && (
        <div className="hidden lg:block bg-[#2E4057] border-t border-white/5">
          <div className="max-w-[1248px] mx-auto px-4 flex items-center gap-6 py-2 text-sm">
            {["Construcción", "Agricultura", "Minería", "Metalmecánica", "Energía", "Transporte"].map(
              (cat) => (
                <Link
                  key={cat}
                  href={`/marketplace?search=${encodeURIComponent(cat)}`}
                  className="text-white/70 hover:text-white font-medium transition-colors"
                >
                  {cat}
                </Link>
              )
            )}
            <Link
              href="/distribuidores"
              className="text-white/70 hover:text-white font-bold transition-colors"
            >
              Distribuidores
            </Link>
            <Link
              href="/marketplace"
              className="text-[#FF8C42] hover:text-[#E85D04] font-bold transition-colors"
            >
              + Ver todo
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#D32323] border-t border-white/10 px-4 py-6 space-y-4 shadow-xl absolute w-full top-full left-0">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              placeholder="Buscar maquinaria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 rounded text-sm bg-white text-[#2D2E2F] outline-none"
            />
            <button
              type="submit"
              className="bg-black/20 text-white p-2 rounded"
            >
              <Search size={16} />
            </button>
          </form>

          <Link
            href="/distribuidores"
            className="block text-white font-semibold border-b border-white/10 pb-3"
            onClick={() => setIsMenuOpen(false)}
          >
            Distribuidores
          </Link>
          <Link
            href="/marketplace"
            className="block text-white font-semibold border-b border-white/10 pb-3"
            onClick={() => setIsMenuOpen(false)}
          >
            Marketplace
          </Link>
          <Link
            href="/vende"
            className="block text-white font-semibold border-b border-white/10 pb-3"
            onClick={() => setIsMenuOpen(false)}
          >
            Vende tu Maquinaria
          </Link>
          <Link
            href="/dashboard"
            className="block text-white font-semibold border-b border-white/10 pb-3"
            onClick={() => setIsMenuOpen(false)}
          >
            Mi Cuenta
          </Link>
        </div>
      )}
    </header>
  );
}
