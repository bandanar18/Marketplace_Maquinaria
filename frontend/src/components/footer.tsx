"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-[#E2E6EA] pt-10 pb-6 mt-auto">
      <div className="max-w-[1248px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-[#E85D04] mb-4 text-sm">Acerca de</h4>
            <ul className="space-y-2 text-sm text-[#5C6370]">
              <li><Link href="#" className="hover:underline">Acerca de M Maquinaria</Link></li>
              <li><Link href="#" className="hover:underline">Empleo</Link></li>
              <li><Link href="#" className="hover:underline">Prensa</Link></li>
              <li><Link href="#" className="hover:underline">Términos de Servicio</Link></li>
              <li><Link href="#" className="hover:underline">Política de Privacidad</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#E85D04] mb-4 text-sm">Descubrir</h4>
            <ul className="space-y-2 text-sm text-[#5C6370]">
              <li><Link href="#" className="hover:underline">Soporte y Ayuda</Link></li>
              <li><Link href="#" className="hover:underline">Blog Oficial</Link></li>
              <li><Link href="#" className="hover:underline">Guía de Precios</Link></li>
              <li><Link href="/marketplace" className="hover:underline">Marketplace</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#E85D04] mb-4 text-sm">Empresas</h4>
            <ul className="space-y-2 text-sm text-[#5C6370]">
              <li><Link href="/auth/register?type=company" className="hover:underline">Registrar tu empresa</Link></li>
              <li><Link href="#" className="hover:underline">Casos de éxito</Link></li>
              <li><Link href="#" className="hover:underline">Planes y precios</Link></li>
              <li><Link href="#" className="hover:underline">Anúnciate con nosotros</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#E85D04] mb-4 text-sm">Idiomas</h4>
            <select className="border border-[#E2E6EA] rounded p-1.5 text-sm bg-white text-[#1A1A2E] outline-none">
              <option>Español</option>
              <option>English</option>
            </select>
            <div className="mt-6">
              <h4 className="font-bold text-[#E85D04] mb-3 text-sm">Síguenos</h4>
              <div className="flex gap-3 text-sm text-[#0073BB]">
                <a href="#" className="hover:underline">Facebook</a>
                <a href="#" className="hover:underline">LinkedIn</a>
                <a href="#" className="hover:underline">Instagram</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E2E6EA] pt-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#E85D04] rounded flex items-center justify-center text-white font-black text-sm opacity-40">
              M
            </div>
            <span className="text-lg font-black text-[#5C6370]/40 tracking-tight">
              maquinaria
            </span>
          </div>
          <p className="text-xs text-[#9099A6] text-center">
            Copyright © 2024–{new Date().getFullYear()} M Maquinaria. Todos los derechos reservados.
            Las marcas relacionadas son propiedad de sus respectivos dueños.
          </p>
        </div>
      </div>
    </footer>
  );
}
