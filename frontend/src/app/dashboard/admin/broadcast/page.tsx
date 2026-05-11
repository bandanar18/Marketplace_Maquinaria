"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportService } from "@/services/support.service";
import { 
  Megaphone, 
  Send, 
  Users, 
  Building2, 
  User as UserIcon, 
  History, 
  Loader2,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminBroadcastPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("ALL");

  const { data: broadcasts, isLoading } = useQuery({
    queryKey: ['admin-broadcasts'],
    queryFn: () => supportService.getBroadcasts(),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => supportService.createBroadcast(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-broadcasts'] });
      toast.success("Comunicado enviado con éxito");
      setTitle("");
      setMessage("");
    },
    onError: () => {
      toast.error("Error al enviar el comunicado");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    mutation.mutate({ title, message, target });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#2D2E2F] tracking-tight flex items-center gap-2 uppercase">
          <Megaphone className="w-6 h-6 text-[#D32323]" /> Comunicación Masiva
        </h1>
        <p className="text-sm text-[#5C6370]">Envía avisos y notificaciones globales a todos los usuarios o grupos específicos.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[#EBEBEB] shadow-sm bg-white">
            <CardHeader className="border-b border-gray-50">
               <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#D32323]" /> Nuevo Comunicado
               </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-[#9099A6]">Grupo Destinatario</Label>
                    <Select value={target} onValueChange={(value) => value && setTarget(value)}>
                       <SelectTrigger className="border-[#EBEBEB]">
                          <SelectValue placeholder="Seleccionar audiencia" />
                       </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="ALL">Todos los Usuarios</SelectItem>
                          <SelectItem value="COMPANIES">Solo Empresas / Distribuidores</SelectItem>
                          <SelectItem value="CLIENTS">Solo Clientes Finales</SelectItem>
                       </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-[#9099A6]">Título del Aviso</Label>
                    <Input 
                      placeholder="Ej: Mantenimiento programado / Nuevas funciones..." 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border-[#EBEBEB] font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-[#9099A6]">Cuerpo del Mensaje</Label>
                    <Textarea 
                      placeholder="Escribe aquí el contenido de la notificación..." 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[200px] border-[#EBEBEB]"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#D32323] hover:bg-[#A61A1A] font-bold h-12"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    ENVIAR NOTIFICACIÓN GLOBAL
                  </Button>
               </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-[#EBEBEB] shadow-sm bg-white h-full">
            <CardHeader className="border-b border-gray-50">
               <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-[#D32323]" /> Historial de Envíos
               </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
               {isLoading ? (
                 <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-300" /></div>
               ) : broadcasts?.length === 0 ? (
                 <p className="text-xs text-[#5C6370] italic text-center py-10">No has enviado comunicados aún.</p>
               ) : (
                 broadcasts.map((b: any) => (
                   <div key={b.id} className="p-3 rounded-lg border border-[#EBEBEB] bg-gray-50/50 hover:bg-white transition-colors group">
                      <div className="flex justify-between items-start mb-1">
                         <span className="text-[9px] font-black uppercase text-[#D32323] px-1 bg-[#D32323]/5 rounded">
                            {b.target}
                         </span>
                         <span className="text-[9px] font-medium text-[#9099A6]">
                            {format(new Date(b.createdAt), 'dd/MM/yy', { locale: es })}
                         </span>
                      </div>
                      <p className="text-xs font-bold text-[#2D2E2F] line-clamp-1 mb-1">{b.title}</p>
                      <p className="text-[10px] text-[#5C6370] line-clamp-2">{b.message}</p>
                   </div>
                 ))
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
