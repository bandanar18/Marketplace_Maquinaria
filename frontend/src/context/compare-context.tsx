"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  brand: string;
  model: string;
  year: number;
  images: { url: string }[];
  specs?: any;
  company: { name: string };
  city: string;
  country: string;
}

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('maquinaria_compare');
    if (saved) {
      try {
        setCompareList(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading compare list", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('maquinaria_compare', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (product: Product) => {
    if (compareList.length >= 4) {
      toast.error("Solo puedes comparar hasta 4 equipos a la vez");
      return;
    }
    if (compareList.find(p => p.id === product.id)) {
      toast.info("Este equipo ya está en tu lista de comparación");
      return;
    }
    setCompareList(prev => [...prev, product]);
    toast.success(`${product.title} añadido al comparador`);
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const isInCompare = (productId: string) => {
    return compareList.some(p => p.id === productId);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
