"use client";

import { useQuery } from "@tanstack/react-query";
import { auditService } from "@/services/audit.service";
import { 
  History, 
  User as UserIcon, 
  Shield, 
  Clock, 
  FileText, 
  Info,
  Loader2,
  Filter,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminAuditPage() {
  const { data: logsData, isLoading } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: () => auditService.getLogs(),
  });

  const getActionColor = (action: string) => {
    if (action.includes('BAN') || action.includes('REJECT') || action.includes('DELETE')) return 'text-red-600 bg-red-50 border-red-100';
    if (action.includes('APPROVE') || action.includes('ACTIVE')) return 'text-green-600 bg-green-50 border-green-100';
    if (action.includes('UPDATE')) return 'text-blue-600 bg-blue-50 border-blue-100';
    return 'text-gray-600 bg-gray-50 border-gray-100';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#2D2E2F] tracking-tight flex items-center gap-2 uppercase">
          <History className="w-6 h-6 text-[#D32323]" /> Registro de Auditoría
        </h1>
        <p className="text-sm text-[#5C6370]">Historial completo de acciones administrativas y cambios en el sistema.</p>
      </div>

      <Card className="border-[#EBEBEB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-[#EBEBEB]">
                <th className="px-6 py-4 text-[10px] font-bold text-[#9099A6] uppercase tracking-wider">Administrador</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#9099A6] uppercase tracking-wider">Acción</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#9099A6] uppercase tracking-wider">Entidad</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#9099A6] uppercase tracking-wider">Detalles</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#9099A6] uppercase tracking-wider text-right">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                     <Loader2 className="w-8 h-8 animate-spin text-[#D32323] mx-auto mb-2" />
                     <p className="text-xs font-bold text-[#5C6370] uppercase">Cargando logs...</p>
                  </td>
                </tr>
              ) : logsData?.items?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-[#5C6370] italic">
                     No hay registros de auditoría aún.
                  </td>
                </tr>
              ) : (
                logsData.items.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold text-xs border border-purple-100">
                           {log.user.firstName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#2D2E2F] leading-none mb-1">{log.user.firstName} {log.user.lastName}</p>
                          <p className="text-[10px] text-[#9099A6] font-bold uppercase">{log.user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#2D2E2F]">{log.entity}</span>
                        <span className="text-[9px] font-mono text-[#9099A6]">{log.entityId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[300px] truncate">
                        <p className="text-xs text-[#5C6370]">
                           {JSON.stringify(log.metadata)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col text-[10px] font-medium text-[#5C6370]">
                        <span className="font-bold">{format(new Date(log.createdAt), 'dd MMM yyyy', { locale: es })}</span>
                        <span className="text-[#9099A6]">{format(new Date(log.createdAt), 'HH:mm:ss', { locale: es })}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
