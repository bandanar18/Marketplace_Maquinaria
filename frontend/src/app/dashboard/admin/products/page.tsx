"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "@/services/products.service";
import { 
  Package, 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  Filter,
  Check,
  X,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING_REVIEW");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<"APPROVE" | "REJECT" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products', statusFilter, search],
    queryFn: () => productsService.getAdminProducts({ 
      status: statusFilter, 
      search: search || undefined 
    }),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string, status: string, reason?: string }) => 
      productsService.updateProductStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success("Estado del producto actualizado correctamente");
      setSelectedProduct(null);
      setReviewAction(null);
      setRejectionReason("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al actualizar estado");
    }
  });

  const handleReview = (status: "ACTIVE" | "REJECTED") => {
    if (!selectedProduct) return;
    mutation.mutate({ 
      id: selectedProduct.id, 
      status, 
      reason: status === 'REJECTED' ? rejectionReason : undefined 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D2E2F] tracking-tight flex items-center gap-2 uppercase">
            <Package className="w-6 h-6 text-[#D32323]" /> Moderación de Equipos
          </h1>
          <p className="text-sm text-[#5C6370]">Revisa y aprueba la maquinaria publicada por los distribuidores.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-[#EBEBEB] shadow-sm">
          <Button 
            variant={statusFilter === 'PENDING_REVIEW' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('PENDING_REVIEW')}
            className={statusFilter === 'PENDING_REVIEW' ? 'bg-[#D32323] hover:bg-[#A61A1A] font-bold' : 'text-xs font-bold'}
          >
            PENDIENTES
          </Button>
          <Button 
            variant={statusFilter === 'ACTIVE' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('ACTIVE')}
            className={statusFilter === 'ACTIVE' ? 'bg-[#D32323] hover:bg-[#A61A1A] font-bold' : 'text-xs font-bold'}
          >
            APROBADOS
          </Button>
          <Button 
            variant={statusFilter === 'REJECTED' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('REJECTED')}
            className={statusFilter === 'REJECTED' ? 'bg-[#D32323] hover:bg-[#A61A1A] font-bold' : 'text-xs font-bold'}
          >
            RECHAZADOS
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9099A6]" />
        <Input 
          placeholder="Buscar por título, marca o modelo..." 
          className="pl-10 bg-white border-[#EBEBEB] focus:ring-[#D32323]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-dashed border-[#EBEBEB]">
            <Loader2 className="w-8 h-8 animate-spin text-[#D32323]" />
            <p className="text-sm font-bold text-[#5C6370] uppercase tracking-widest">Cargando equipos...</p>
          </div>
        ) : productsData?.items?.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-dashed border-[#EBEBEB]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#9099A6]" />
            </div>
            <p className="text-sm font-bold text-[#5C6370] uppercase tracking-widest">No hay equipos {statusFilter === 'PENDING_REVIEW' ? 'pendientes' : 'en esta categoría'}</p>
          </div>
        ) : (
          productsData.items.map((product: any) => (
            <Card key={product.id} className="overflow-hidden border-[#EBEBEB] hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-48 h-48 md:h-auto bg-gray-100 shrink-0 relative">
                  {product.images?.[0] ? (
                    <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Package className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant={
                      product.status === 'ACTIVE' ? 'success' : 
                      product.status === 'PENDING_REVIEW' ? 'warning' : 'destructive'
                    } className="text-[10px] font-bold uppercase shadow-sm">
                      {product.status === 'ACTIVE' ? 'Aprobado' : 
                       product.status === 'PENDING_REVIEW' ? 'Pendiente' : 'Rechazado'}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-[#2D2E2F] leading-tight mb-1">{product.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-[#5C6370]">
                           <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {product.company.name}</span>
                           <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(product.createdAt), 'dd MMM yyyy', { locale: es })}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-[#D32323]">${Number(product.price).toLocaleString()}</p>
                        <p className="text-[10px] text-[#9099A6] font-bold uppercase">{product.brand} {product.model}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#5C6370] line-clamp-2 mb-4">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-50">
                    <Button variant="outline" size="sm" className="text-xs font-bold border-[#EBEBEB]">
                       <Eye className="w-4 h-4 mr-2" /> VER DETALLES
                    </Button>
                    {product.status === 'PENDING_REVIEW' && (
                      <>
                        <Button 
                          onClick={() => { setSelectedProduct(product); setReviewAction('REJECT'); }} 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs font-bold text-[#D32323] hover:bg-red-50 hover:text-[#D32323]"
                        >
                          <XCircle className="w-4 h-4 mr-2" /> RECHAZAR
                        </Button>
                        <Button 
                          onClick={() => { setSelectedProduct(product); setReviewAction('APPROVE'); }} 
                          className="text-xs font-bold bg-[#D32323] hover:bg-[#A61A1A] text-white"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" /> APROBAR
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Approve/Reject Dialog */}
      <Dialog open={!!reviewAction} onOpenChange={() => { setReviewAction(null); setRejectionReason(""); }}>
        <DialogContent className="sm:max-w-md bg-white border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase flex items-center gap-2">
              {reviewAction === 'APPROVE' ? (
                <><CheckCircle className="text-success w-6 h-6" /> Aprobar Equipo</>
              ) : (
                <><XCircle className="text-danger w-6 h-6" /> Rechazar Equipo</>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {reviewAction === 'APPROVE' ? 
                "¿Estás seguro de que quieres publicar este equipo en el marketplace?" : 
                "Por favor indica el motivo del rechazo para informar al distribuidor."
              }
            </DialogDescription>
          </DialogHeader>

          {reviewAction === 'REJECT' && (
            <div className="py-4">
              <Textarea 
                placeholder="Ej: Las fotos están borrosas o falta información técnica clave..." 
                className="h-32 border-[#EBEBEB] focus:border-[#D32323]"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setReviewAction(null)} className="font-bold border-[#EBEBEB]">
              CANCELAR
            </Button>
            <Button 
              className={reviewAction === 'APPROVE' ? "bg-success hover:bg-success/90 font-bold text-white" : "bg-[#D32323] hover:bg-[#A61A1A] font-bold text-white"}
              onClick={() => handleReview(reviewAction === 'APPROVE' ? 'ACTIVE' : 'REJECTED')}
              disabled={mutation.isPending || (reviewAction === 'REJECT' && !rejectionReason.trim())}
            >
              {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (reviewAction === 'APPROVE' ? "CONFIRMAR PUBLICACIÓN" : "CONFIRMAR RECHAZO")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
