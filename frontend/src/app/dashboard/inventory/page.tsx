"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "@/services/products.service";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Eye,
  Archive,
  Package,
  ExternalLink,
  FileUp,
  Star,
  Zap,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function InventoryPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const boostMutation = useMutation({
    mutationFn: (id: string) => productsService.boostProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-inventory'] });
      toast.success("Estado de promoción actualizado");
    },
    onError: () => toast.error("Error al promocionar equipo")
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['my-inventory', user?.companyId || user?.company?.id, debouncedSearch],
    queryFn: () => productsService.getProducts({ 
      companyId: user?.companyId || user?.company?.id,
      search: debouncedSearch,
      limit: 100 
    }),
    enabled: !!(user?.companyId || user?.company?.id),
  });

  return (
    <TooltipProvider>
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2D2E2F]">Gestión de Inventario</h1>
          <p className="text-sm text-[#5C6370] font-medium mt-1">Administra tus equipos publicados en el marketplace.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/inventory/import">
            <Button variant="outline" className="font-bold h-11 px-6 border-[#EBEBEB] text-[#5C6370] hover:text-[#D32323]">
              <FileUp className="w-4 h-4 mr-2" /> IMPORTAR CSV
            </Button>
          </Link>
          <Link 
            href="/dashboard/inventory/new"
            className="bg-[#D32323] hover:bg-[#A61A1A] text-white font-bold h-11 px-6 rounded-[4px] flex items-center justify-center transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Publicar Equipo
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-[#EBEBEB] shadow-sm rounded-lg overflow-hidden bg-white">
        <CardContent className="p-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9099A6] w-5 h-5" />
            <Input 
              placeholder="Buscar por nombre, marca o modelo..." 
              className="pl-11 h-11 border-[#EBEBEB] focus:border-[#D32323] focus:ring-[#D32323] font-medium" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="border-[#EBEBEB] shadow-sm overflow-hidden bg-white rounded-lg">
        <Table>
          <TableHeader className="bg-[#F5F5F5] border-b border-[#EBEBEB]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-[#2D2E2F] py-4">Equipo</TableHead>
              <TableHead className="font-bold text-[#2D2E2F] py-4">Tipo</TableHead>
              <TableHead className="font-bold text-[#2D2E2F] py-4">Precio</TableHead>
              <TableHead className="font-bold text-[#2D2E2F] py-4 text-center">Estado</TableHead>
              <TableHead className="font-bold text-[#2D2E2F] py-4 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-[#D32323] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-[#5C6370] font-medium">Cargando inventario...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : productsData?.items?.length > 0 ? (
              productsData.items.map((product: any) => (
                <TableRow key={product.id} className="group hover:bg-[#F5F5F5]/50 border-[#EBEBEB] transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-[4px] overflow-hidden border border-[#EBEBEB] shrink-0">
                        <Image 
                          src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1579412691970-ef9b60cff9ad?q=80&w=200"} 
                          alt={product.title} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link href={`/marketplace/${product.slug}`} target="_blank" className="font-bold text-[#0073BB] hover:underline flex items-center gap-1.5">
                            {product.title}
                            <ExternalLink size={12} className="opacity-50" />
                          </Link>
                          {product.featured && (
                            <Star className="w-3.5 h-3.5 text-[#F1C40F] fill-[#F1C40F]" />
                          )}
                        </div>
                        <p className="text-xs text-[#9099A6] font-bold uppercase tracking-wider mt-0.5">{product.brand} · {product.year}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-[#F5F5F5] text-[#5C6370] border-[#EBEBEB] text-[10px] font-bold py-0.5 px-2 rounded-sm uppercase">
                      {product.transactionType === 'SALE' ? 'Venta' : product.transactionType === 'RENTAL' ? 'Renta' : 'Mixto'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-[#2D2E2F]">
                    {product.transactionType === 'RENTAL' ? (
                      `$${new Intl.NumberFormat().format(Number(product.pricePerDay))} / día`
                    ) : (
                      `$${new Intl.NumberFormat().format(product.price)}`
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={`rounded-sm font-bold text-[10px] uppercase px-2 py-1 ${
                      product.status === 'ACTIVE' ? 'bg-[#27AE60]/10 text-[#27AE60] border-[#27AE60]/20' : 'bg-[#9099A6]/10 text-[#9099A6] border-[#9099A6]/20'
                    }`}>
                      {product.status === 'ACTIVE' ? 'Activo' : 'Archivado'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex justify-end gap-2">
                       <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              onClick={() => boostMutation.mutate(product.id)}
                              disabled={boostMutation.isPending}
                              className={`p-2 rounded-[4px] border border-[#EBEBEB] transition-all ${
                                product.featured 
                                  ? 'bg-[#F1C40F]/10 text-[#F1C40F] border-[#F1C40F]/20' 
                                  : 'hover:bg-gray-50 text-[#9099A6]'
                              }`}
                            >
                               {boostMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#2D2E2F] text-white border-none text-[10px] font-bold">
                             {product.featured ? "QUITAR DE DESTACADOS" : "DESTACAR EQUIPO (BOOST)"}
                          </TooltipContent>
                       </Tooltip>

                       <Link href={`/dashboard/inventory/edit/${product.id}`} className="p-2 hover:bg-[#F5F5F5] rounded-[4px] text-[#5C6370] hover:text-[#0073BB] transition-colors border border-[#EBEBEB]">
                         <Edit className="w-4 h-4" />
                       </Link>
                       <button className="p-2 hover:bg-[#F5F5F5] rounded-[4px] text-[#5C6370] hover:text-[#D32323] transition-colors border border-transparent hover:border-[#EBEBEB]">
                         <Archive className="w-4 h-4" />
                       </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                   <div className="max-w-xs mx-auto">
                    <Package className="w-12 h-12 mx-auto mb-4 text-[#EBEBEB]" />
                    <p className="text-[#2D2E2F] font-bold text-lg mb-1">No hay equipos en tu inventario</p>
                    <p className="text-[#5C6370] text-sm mb-6">Empieza publicando tu primer equipo para recibir cotizaciones.</p>
                    <Link 
                      href="/dashboard/inventory/new"
                      className="bg-[#D32323] hover:bg-[#A61A1A] text-white font-bold h-10 px-6 rounded-[4px] inline-flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Publicar mi primer equipo
                    </Link>
                   </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
    </TooltipProvider>
  );
}
