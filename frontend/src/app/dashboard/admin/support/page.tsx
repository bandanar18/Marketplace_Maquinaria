"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportService } from "@/services/support.service";
import { 
  LifeBuoy, 
  User as UserIcon, 
  Clock, 
  MessageCircle, 
  CheckCircle2, 
  XCircle,
  Loader2,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function AdminSupportPage() {
  const queryClient = useQueryClient();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['admin-support-tickets'],
    queryFn: () => supportService.getTickets(),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      supportService.updateTicketStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-support-tickets'] });
      toast.success("Ticket actualizado");
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <Badge className="bg-blue-500 font-bold uppercase">ABIERTO</Badge>;
      case 'IN_PROGRESS': return <Badge className="bg-warning font-bold uppercase">EN PROCESO</Badge>;
      case 'RESOLVED': return <Badge variant="success" className="font-bold uppercase">RESUELTO</Badge>;
      case 'CLOSED': return <Badge variant="secondary" className="font-bold uppercase">CERRADO</Badge>;
      default: return <Badge variant="outline" className="font-bold uppercase">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#2D2E2F] tracking-tight flex items-center gap-2 uppercase">
          <LifeBuoy className="w-6 h-6 text-[#D32323]" /> Centro de Soporte
        </h1>
        <p className="text-sm text-[#5C6370]">Gestiona las solicitudes de ayuda y problemas técnicos de los usuarios.</p>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />
          ))
        ) : tickets?.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-xl border border-dashed border-[#EBEBEB]">
             <MessageCircle className="w-12 h-12 text-[#9099A6] mx-auto mb-4 opacity-20" />
             <p className="text-[#5C6370] font-medium">No hay tickets de soporte pendientes.</p>
          </div>
        ) : (
          tickets.map((ticket: any) => (
            <Card key={ticket.id} className="border-[#EBEBEB] hover:shadow-md transition-shadow bg-white overflow-hidden">
               <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                     <div className="p-6 flex-1">
                        <div className="flex items-center gap-3 mb-4">
                           {getStatusBadge(ticket.status)}
                           <span className="text-[10px] font-bold text-[#9099A6] uppercase tracking-widest flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {format(new Date(ticket.createdAt), 'dd MMM, HH:mm', { locale: es })}
                           </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#2D2E2F] mb-2">{ticket.subject}</h3>
                        <p className="text-sm text-[#5C6370] mb-4 line-clamp-2">{ticket.message}</p>
                        
                        <div className="flex items-center gap-2 text-xs font-bold text-[#9099A6]">
                           <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                              <UserIcon className="w-3 h-3" />
                           </div>
                           {ticket.user.firstName} {ticket.user.lastName} ({ticket.user.email})
                        </div>
                     </div>
                     
                     <div className="bg-gray-50/50 p-6 flex flex-row md:flex-col items-center justify-center gap-2 border-t md:border-t-0 md:border-l border-[#EBEBEB]">
                        {ticket.status !== 'RESOLVED' && (
                          <Button 
                            className="bg-success hover:bg-success/90 font-bold text-white w-full" 
                            size="sm"
                            onClick={() => mutation.mutate({ id: ticket.id, status: 'RESOLVED' })}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" /> MARCAR RESUELTO
                          </Button>
                        )}
                        {ticket.status === 'OPEN' && (
                          <Button 
                            variant="outline" 
                            className="font-bold border-[#EBEBEB] w-full" 
                            size="sm"
                            onClick={() => mutation.mutate({ id: ticket.id, status: 'IN_PROGRESS' })}
                          >
                            TOMAR TICKET
                          </Button>
                        )}
                        <Button variant="ghost" className="font-bold text-[#D32323] w-full" size="sm">
                           VER DETALLES <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
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
