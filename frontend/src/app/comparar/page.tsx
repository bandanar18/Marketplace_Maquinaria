"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useCompare } from "@/context/compare-context";
import { Button } from "@/components/ui/button";
import { 
  X, 
  MapPin, 
  Calendar, 
  Tag, 
  Building2, 
  ChevronLeft,
  FileText,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  const specsKeys = Array.from(new Set(
    compareList.flatMap(p => Object.keys(p.specs || {}))
  ));

  if (compareList.length === 0) {
    return (
      <main className="min-h-screen bg-[#F5F5F5]">
        <Header />
        <div className="max-w-4xl mx-auto pt-40 pb-20 px-4 text-center space-y-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
             <AlertCircle size={40} />
          </div>
          <h1 className="text-2xl font-black text-[#1C2B3A]">Tu comparador está vacío</h1>
          <p className="text-[#5C6370]">Añade equipos desde el marketplace para compararlos lado a lado.</p>
          <Link href="/marketplace">
             <Button className="bg-[#D32323] hover:bg-[#A61A1A] text-white font-black px-8">
                IR AL MARKETPLACE
             </Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5]">
      <Header />
      
      <div className="max-w-[1400px] mx-auto pt-32 pb-20 px-4">
        <div className="flex items-center justify-between mb-8">
           <div className="space-y-1">
              <Link href="/marketplace" className="text-[#D32323] font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:underline mb-2">
                 <ChevronLeft size={14} /> Volver al Marketplace
              </Link>
              <h1 className="text-3xl font-black text-[#1C2B3A]">Comparativa de Maquinaria</h1>
           </div>
           <Button variant="ghost" onClick={clearCompare} className="text-[#5C6370] font-bold text-xs">
              BORRAR TODO
           </Button>
        </div>

        <div className="bg-white rounded-xl shadow-xl border border-[#EBEBEB] overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#EBEBEB]">
                <th className="p-6 text-left w-64 bg-gray-50/50 sticky left-0 z-10 font-black text-xs uppercase text-[#9099A6] tracking-widest">
                   Características
                </th>
                {compareList.map((product) => (
                  <th key={product.id} className="p-6 min-w-[280px] relative group border-l border-[#EBEBEB]">
                    <button 
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-[#D32323] p-1 transition-colors"
                    >
                      <X size={18} />
                    </button>
                    <div className="space-y-4 text-left">
                       <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-[#EBEBEB]">
                          <Image 
                             src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1579412691970-ef9b60cff9ad?q=80&w=400"} 
                             alt={product.title} 
                             fill 
                             className="object-cover"
                          />
                       </div>
                       <div>
                          <h3 className="font-bold text-[#1C2B3A] leading-tight line-clamp-2 min-h-[40px] mb-2">{product.title}</h3>
                          <p className="text-xl font-black text-[#D32323]">
                             {product.currency} {new Intl.NumberFormat().format(product.price)}
                          </p>
                       </div>
                       <Link href={`/marketplace/${product.slug}`}>
                          <Button className="w-full bg-[#1C2B3A] hover:bg-black text-white text-[10px] font-black h-9">
                             VER DETALLES
                          </Button>
                       </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Basic Specs */}
              <tr className="bg-gray-50/30">
                 <td colSpan={compareList.length + 1} className="p-4 px-6 font-black text-[10px] uppercase text-[#D32323] tracking-widest border-y border-[#EBEBEB]">
                    Información Básica
                 </td>
              </tr>
              <tr className="border-b border-gray-50">
                 <td className="p-4 px-6 text-xs font-bold text-[#5C6370] bg-gray-50/50 sticky left-0 z-10 border-r border-[#EBEBEB]">Marca</td>
                 {compareList.map(p => <td key={p.id} className="p-4 text-sm font-bold text-[#1C2B3A] border-l border-gray-50">{p.brand}</td>)}
              </tr>
              <tr className="border-b border-gray-50">
                 <td className="p-4 px-6 text-xs font-bold text-[#5C6370] bg-gray-50/50 sticky left-0 z-10 border-r border-[#EBEBEB]">Modelo</td>
                 {compareList.map(p => <td key={p.id} className="p-4 text-sm font-bold text-[#1C2B3A] border-l border-gray-50">{p.model}</td>)}
              </tr>
              <tr className="border-b border-gray-50">
                 <td className="p-4 px-6 text-xs font-bold text-[#5C6370] bg-gray-50/50 sticky left-0 z-10 border-r border-[#EBEBEB]">Año</td>
                 {compareList.map(p => <td key={p.id} className="p-4 text-sm font-bold text-[#1C2B3A] border-l border-gray-50">{p.year}</td>)}
              </tr>
              <tr className="border-b border-gray-50">
                 <td className="p-4 px-6 text-xs font-bold text-[#5C6370] bg-gray-50/50 sticky left-0 z-10 border-r border-[#EBEBEB]">Ubicación</td>
                 {compareList.map(p => (
                    <td key={p.id} className="p-4 text-xs font-medium text-[#1C2B3A] border-l border-gray-50">
                       <span className="flex items-center gap-1"><MapPin size={12} className="text-[#D32323]" /> {p.city}, {p.country}</span>
                    </td>
                 ))}
              </tr>
              <tr className="border-b border-[#EBEBEB]">
                 <td className="p-4 px-6 text-xs font-bold text-[#5C6370] bg-gray-50/50 sticky left-0 z-10 border-r border-[#EBEBEB]">Distribuidor</td>
                 {compareList.map(p => (
                    <td key={p.id} className="p-4 text-xs font-bold text-[#0073BB] border-l border-gray-50">
                       <span className="flex items-center gap-1"><Building2 size={12} /> {p.company?.name}</span>
                    </td>
                 ))}
              </tr>

              {/* Technical Specs Header */}
              {specsKeys.length > 0 && (
                 <>
                   <tr className="bg-gray-50/30">
                      <td colSpan={compareList.length + 1} className="p-4 px-6 font-black text-[10px] uppercase text-[#D32323] tracking-widest border-y border-[#EBEBEB]">
                         Especificaciones Técnicas
                      </td>
                   </tr>
                   {specsKeys.map(key => (
                      <tr key={key} className="border-b border-gray-50 last:border-0">
                         <td className="p-4 px-6 text-xs font-bold text-[#5C6370] bg-gray-50/50 sticky left-0 z-10 border-r border-[#EBEBEB] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                         {compareList.map(p => (
                            <td key={p.id} className="p-4 text-sm font-medium text-[#1C2B3A] border-l border-gray-50">
                               {p.specs?.[key] || <span className="text-gray-300">—</span>}
                            </td>
                         ))}
                      </tr>
                   ))}
                 </>
              )}
            </tbody>
            <tfoot>
               <tr className="border-t-2 border-[#EBEBEB] bg-gray-50/10">
                  <td className="p-6 bg-gray-50/50 sticky left-0 z-10 border-r border-[#EBEBEB]"></td>
                  {compareList.map(p => (
                     <td key={p.id} className="p-6 border-l border-gray-50">
                        <Link href={`/marketplace/${p.slug}`}>
                           <Button className="w-full bg-[#D32323] hover:bg-[#A61A1A] text-white font-black text-xs h-11">
                              SOLICITAR COTIZACIÓN
                           </Button>
                        </Link>
                     </td>
                  ))}
               </tr>
            </tfoot>
          </table>
        </div>
        
        <div className="mt-8 p-6 bg-white rounded-xl border border-[#EBEBEB] flex items-start gap-4">
           <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0073BB] shrink-0">
              <FileText size={20} />
           </div>
           <div>
              <h4 className="font-black text-[#1C2B3A] mb-1 text-sm uppercase">Consejo Maquinaria</h4>
              <p className="text-xs text-[#5C6370] leading-relaxed">
                 Te recomendamos comparar equipos con años y horas de uso similares para obtener una mejor perspectiva del valor de mercado. Si tienes dudas, puedes contactar directamente a nuestros distribuidores certificados.
              </p>
           </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
