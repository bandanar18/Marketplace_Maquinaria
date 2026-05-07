"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "@/services/products.service";
import { 
  FileText, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryName, setCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => productsService.getCategories(),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => 
      editingCategory 
        ? productsService.updateCategory(editingCategory.id, data)
        : productsService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success(editingCategory ? "Categoría actualizada" : "Categoría creada");
      closeDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al procesar categoría");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success("Categoría eliminada");
    },
    onError: (error: any) => {
      toast.error("No se puede eliminar: tiene subcategorías o productos vinculados.");
    }
  });

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setCategoryName("");
    setParentCategory(null);
  };

  const openEdit = (category: any) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setParentCategory(category.parentId);
    setIsDialogOpen(true);
  };

  const toggleExpand = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    
    // Simple level calculation for this demo
    let level = 1;
    if (parentCategory) {
      // Find parent in the tree to get its level
      const findParent = (list: any[]): any => {
        for (const cat of list) {
          if (cat.id === parentCategory) return cat;
          if (cat.children) {
            const found = findParent(cat.children);
            if (found) return found;
          }
        }
        return null;
      };
      const parent = findParent(categories);
      level = parent ? parent.level + 1 : 1;
    }

    mutation.mutate({
      name: categoryName,
      parentId: parentCategory,
      level
    });
  };

  const renderCategoryRow = (category: any, depth = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedRows.has(category.id);

    return (
      <div key={category.id}>
        <div className="flex items-center justify-between p-4 bg-white border-b border-[#EBEBEB] hover:bg-gray-50 transition-colors">
          <div className="flex items-center" style={{ paddingLeft: `${depth * 24}px` }}>
            <button 
              onClick={() => toggleExpand(category.id)}
              className={`p-1 mr-2 rounded hover:bg-gray-200 transition-colors ${!hasChildren && 'invisible'}`}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <Folder className={`w-4 h-4 mr-3 ${depth === 0 ? 'text-[#D32323]' : 'text-[#9099A6]'}`} />
            <span className={`text-sm ${depth === 0 ? 'font-bold text-[#2D2E2F]' : 'text-[#5C6370]'}`}>
              {category.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-[#D32323]" onClick={() => openEdit(category)}>
              <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-8 h-8 hover:text-[#D32323]" 
              onClick={() => {
                if (confirm(`¿Eliminar categoría "${category.name}"?`)) {
                  deleteMutation.mutate(category.id);
                }
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-[10px] font-black h-7 ml-2 border-[#EBEBEB]"
              onClick={() => {
                 setParentCategory(category.id);
                 setIsDialogOpen(true);
              }}
            >
               SUB-CATEGORÍA
            </Button>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {category.children.map((child: any) => renderCategoryRow(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#2D2E2F] tracking-tight flex items-center gap-2 uppercase">
            <FileText className="w-6 h-6 text-[#D32323]" /> Gestión de Categorías
          </h1>
          <p className="text-sm text-[#5C6370]">Organiza la taxonomía global de maquinaria y equipos.</p>
        </div>
        <Button className="bg-[#D32323] hover:bg-[#A61A1A] font-bold" onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> NUEVA CATEGORÍA RAÍZ
        </Button>
      </div>

      <Card className="border-[#EBEBEB] shadow-sm overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b border-[#EBEBEB] py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-[#9099A6]">Estructura de Categorías</CardTitle>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#9099A6]">
               <AlertCircle className="w-3 h-3" /> Máximo 3 niveles de profundidad
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
             <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-[#D32323]" />
                <p className="text-sm font-bold text-[#5C6370] uppercase tracking-widest">Cargando taxonomía...</p>
             </div>
          ) : (
            <div className="divide-y divide-[#EBEBEB]">
              {categories?.map((cat: any) => renderCategoryRow(cat))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white border-none shadow-2xl sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold uppercase">
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                {parentCategory ? "Esta categoría será una sub-categoría." : "Esta será una categoría principal."}
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Categoría</Label>
                <Input 
                  id="name" 
                  placeholder="Ej: Excavadoras Hidráulicas" 
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="border-[#EBEBEB] focus:ring-[#D32323]"
                  autoFocus
                />
              </div>

              {parentCategory && (
                <div className="p-3 bg-gray-50 rounded-lg border border-[#EBEBEB]">
                   <p className="text-[10px] font-bold text-[#9099A6] uppercase mb-1">Categoría Padre</p>
                   <p className="text-sm font-bold text-[#2D2E2F]">
                      {/* Search for name */}
                      {(() => {
                        const findName = (list: any[]): string => {
                          for (const cat of list) {
                            if (cat.id === parentCategory) return cat.name;
                            if (cat.children) {
                              const found = findName(cat.children);
                              if (found) return found;
                            }
                          }
                          return "No encontrada";
                        };
                        return findName(categories || []);
                      })()}
                   </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} className="font-bold border-[#EBEBEB]">
                CANCELAR
              </Button>
              <Button type="submit" className="bg-[#D32323] hover:bg-[#A61A1A] font-bold text-white" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingCategory ? "GUARDAR CAMBIOS" : "CREAR CATEGORÍA")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
