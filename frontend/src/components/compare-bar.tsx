"use client";

import { useCompare } from "@/context/compare-context";
import { Button } from "@/components/ui/button";
import { Scale, X, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="max-w-4xl mx-auto bg-[#1C2B3A] text-white rounded-xl shadow-2xl border border-white/10 p-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-2 px-3 border-r border-white/10 shrink-0">
               <Scale className="text-[#D32323] w-5 h-5" />
               <span className="font-black text-sm uppercase tracking-wider">
                  Comparar <span className="text-[#D32323]">({compareList.length})</span>
               </span>
            </div>
            
            <div className="flex gap-3">
              {compareList.map((product) => (
                <div 
                  key={product.id} 
                  className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border border-white/20 shrink-0 group"
                >
                  <img 
                    src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1579412691970-ef9b60cff9ad?q=80&w=200"} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={() => removeFromCompare(product.id)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={clearCompare}
              className="text-[10px] font-black uppercase text-white/50 hover:text-white transition-colors"
            >
              Limpiar
            </button>
            <Link href="/comparar">
              <Button className="bg-[#D32323] hover:bg-[#A61A1A] text-white font-black text-xs px-6 h-10 shadow-lg group">
                COMPARAR AHORA
                <ArrowRightLeft className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
