"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import { 
  AlertTriangle, 
  Trash2, 
  Eye, 
  Package, 
  Building2, 
  Calendar, 
  Loader2,
  CheckCircle,
  MoreVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

export default function AdminReportsPage() {
  const queryClient = useQueryClient();

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: () => reportService.getReports(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reportService.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      toast.success("Reporte archivado");
    },
    onError: () => {
      toast.error("Error al eliminar el reporte");
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#2D2E2F] tracking-tight flex items-center gap-2 uppercase">
          <AlertTriangle className="w-6 h-6 text-[#D32323]" /> Denuncias de Equipos
        </h1>
        <p className="text-sm text-[#5C6370]">Gestiona los reportes de mala conducta o datos falsos en los productos.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-dashed border-[#EBEBEB]">
            <Loader2 className="w-8 h-8 animate-spin text-[#D32323]" />
            <p className="text-sm font-bold text-[#5C6370] uppercase tracking-widest">Cargando denuncias...</p>
          </div>
        ) : reportsData?.items?.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-dashed border-[#EBEBEB]">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <p className="text-sm font-bold text-[#5C6370] uppercase tracking-widest">Todo en orden. No hay denuncias pendientes.</p>
          </div>
        ) : (
          reportsData.items.map((report: any) => (
            <Card key={report.id} className="border-[#EBEBEB] hover:shadow-md transition-shadow">
               <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="p-3 bg-red-50 rounded-xl text-[#D32323]">
                       <AlertTriangle className="w-8 h-8" />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-[#2D2E2F] mb-1">Motivo: {report.reason}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-[#5C6370]">
                            <span className="flex items-center gap-1 font-bold text-[#2D2E2F]"><Package className="w-3.5 h-3.5 text-[#D32323]" /> {report.product.title}</span>
                            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {report.product.company.name}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {format(new Date(report.createdAt), 'dd MMM yyyy, HH:mm', { locale: es })}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                           <Link href={`/marketplace/${report.product.slug}`} target="_blank">
                              <Button variant="outline" size="sm" className="text-xs font-bold border-[#EBEBEB]">
                                 <Eye className="w-4 h-4 mr-2" /> VER EQUIPO
                              </Button>
                           </Link>
                           <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs font-bold text-[#5C6370] hover:text-[#D32323]"
                            onClick={() => {
                              if (confirm("¿Marcar este reporte como resuelto y eliminarlo?")) {
                                deleteMutation.mutate(report.id);
                              }
                            }}
                           >
                              <Trash2 className="w-4 h-4 mr-2" /> DESCARTAR
                           </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg border border-[#EBEBEB]">
                         <p className="text-xs text-[#5C6370] leading-relaxed">
                            Se ha recibido una denuncia sobre este equipo. Como administrador, debes revisar si el contenido infringe las normas de la comunidad o contiene información engañosa.
                         </p>
                      </div>
                    </div>
                  </div>
               </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
