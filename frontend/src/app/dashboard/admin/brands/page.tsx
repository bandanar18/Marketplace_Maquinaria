"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandService } from "@/services/brand.service";
import { 
  Award, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  Loader2,
  Package,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminBrandsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [brandName, setBrandName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const { data: brands, isLoading } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: () => brandService.getBrands(),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => 
      editingBrand 
        ? brandService.updateBrand(editingBrand.id, data)
        : brandService.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
      toast.success(editingBrand ? "Marca actualizada" : "Marca creada");
      closeDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al procesar marca");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => brandService.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] });
      toast.success("Marca eliminada");
    },
    onError: (error: any) => {
      toast.error("No se puede eliminar: hay productos vinculados a esta marca.");
    }
  });

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingBrand(null);
    setBrandName("");
    setLogoUrl("");
  };

  const openEdit = (brand: any) => {
    setEditingBrand(brand);
    setBrandName(brand.name);
    setLogoUrl(brand.logoUrl || "");
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    mutation.mutate({ name: brandName, logoUrl: logoUrl || undefined });
  };

  const filteredBrands = brands?.filter((b: any) => 
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#2D2E2F] tracking-tight flex items-center gap-2 uppercase">
            <Award className="w-6 h-6 text-[#D32323]" /> Gestión de Marcas
          </h1>
          <p className="text-sm text-[#5C6370]">Estandariza los fabricantes para mantener un catálogo limpio.</p>
        </div>
        <Button className="bg-[#D32323] hover:bg-[#A61A1A] font-bold" onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> NUEVA MARCA
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9099A6]" />
        <Input 
          placeholder="Buscar marca por nombre..." 
          className="pl-10 bg-white border-[#EBEBEB] focus:ring-[#D32323]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl" />
          ))
        ) : filteredBrands?.length === 0 ? (
          <div className="col-span-full py-20 text-center text-[#5C6370] italic bg-white rounded-xl border border-dashed border-[#EBEBEB]">
             No se encontraron marcas.
          </div>
        ) : (
          filteredBrands?.map((brand: any) => (
            <Card key={brand.id} className="group relative overflow-hidden border-[#EBEBEB] hover:shadow-lg transition-all duration-300 bg-white">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                 <div className="w-16 h-16 bg-gray-50 rounded-lg border border-[#EBEBEB] flex items-center justify-center overflow-hidden">
                    {brand.logoUrl ? (
                      <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain p-2" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-[#9099A6]" />
                    )}
                 </div>
                 <div>
                    <p className="font-bold text-[#2D2E2F] group-hover:text-[#D32323] transition-colors">{brand.name}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                       <Package className="w-3 h-3 text-[#9099A6]" />
                       <span className="text-[10px] font-bold text-[#9099A6] uppercase tracking-wider">{brand._count.products} EQUIPOS</span>
                    </div>
                 </div>

                 <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button variant="secondary" size="icon" className="w-7 h-7 bg-white shadow-sm border border-[#EBEBEB]" onClick={() => openEdit(brand)}>
                       <Edit2 className="w-3 h-3 text-[#5C6370]" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="w-7 h-7 bg-white shadow-sm border border-[#EBEBEB] hover:text-[#D32323]"
                      onClick={() => {
                        if (confirm(`¿Eliminar marca "${brand.name}"?`)) {
                           deleteMutation.mutate(brand.id);
                        }
                      }}
                    >
                       <Trash2 className="w-3 h-3" />
                    </Button>
                 </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white border-none shadow-2xl sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold uppercase">
                {editingBrand ? "Editar Marca" : "Nueva Marca Oficial"}
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Asegúrate de usar el nombre oficial del fabricante.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#9099A6]">Nombre del Fabricante</Label>
                <Input 
                  id="name" 
                  placeholder="Ej: Caterpillar, Komatsu, JCB..." 
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="border-[#EBEBEB] focus:ring-[#D32323]"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo" className="text-xs font-bold uppercase tracking-wider text-[#9099A6]">URL del Logo (Opcional)</Label>
                <div className="flex gap-2">
                  <Input 
                    id="logo" 
                    placeholder="https://..." 
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="border-[#EBEBEB] focus:ring-[#D32323]"
                  />
                  {logoUrl && (
                    <div className="w-10 h-10 rounded border border-[#EBEBEB] p-1 bg-white shrink-0">
                      <img src={logoUrl} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} className="font-bold border-[#EBEBEB]">
                CANCELAR
              </Button>
              <Button type="submit" className="bg-[#D32323] hover:bg-[#A61A1A] font-bold text-white" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingBrand ? "GUARDAR CAMBIOS" : "CREAR MARCA")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
