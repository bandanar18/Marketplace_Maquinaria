"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quotesService } from "@/services/products.service";
import api from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Send,
  User as UserIcon,
  Building2
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function QuoteDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [responseModal, setResponseModal] = useState<{ open: boolean, type: 'ACCEPTED' | 'REJECTED' }>({ open: false, type: 'ACCEPTED' });
  const [responsePrice, setResponsePrice] = useState<string>("");
  const [responseMsg, setResponseMsg] = useState("");
  
  const isCompany = user?.role === 'COMPANY_MEMBER' || user?.companyRole;

  const { data: quote, isLoading } = useQuery({
    queryKey: ['quote', id],
    queryFn: async () => {
      const response = await api.get(`/quotes/${id}`);
      console.log('--- QUOTE DETAIL RECEIVED ---', response.data);
      return response.data;
    },
  });
  
  // Chat: get or create thread for this quote
  const { data: thread, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['quote-thread', id],
    queryFn: async () => {
      const res = await api.get(`/messages/quote-thread/${id}`);
      return res.data;
    },
    enabled: !!id,
    refetchInterval: 5000,
  });

  const messages = thread?.messages || [];

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!thread?.id) throw new Error("No hay hilo de chat activo");
      const receiverId = thread?.participantIds?.find((pid: string) => pid !== user?.id);
      if (!receiverId) throw new Error("No se encontró destinatario");
      return api.post('/messages', {
        content,
        quoteId: id,
        receiverId,
      });
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ['quote-thread', id] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al enviar mensaje");
    }
  });
  
  const respondMutation = useMutation({
    mutationFn: async (data: { message: string, status: 'ACCEPTED' | 'REJECTED', price?: number }) => {
      return quotesService.respondToQuote(id as string, data);
    },
    onSuccess: () => {
      toast.success("Respuesta enviada correctamente");
      setResponseModal(prev => ({ ...prev, open: false }));
      queryClient.invalidateQueries({ queryKey: ['quote', id] });
    },
    onError: () => {
      toast.error("Error al enviar la respuesta");
    }
  });

  if (isLoading) return <div className="p-8">Cargando...</div>;
  if (!quote) return <div className="p-8 text-center">Cotización no encontrada</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <Link href="/dashboard/quotes" className="inline-flex items-center text-sm font-medium text-steel hover:text-primary mb-2 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER A MIS COTIZACIONES
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        {/* Detail Info */}
        <div className="space-y-6">
          <Card className="border-steel/10 shadow-sm overflow-hidden">
            <CardHeader className="bg-surface py-6">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-2">ID: #{quote.id.slice(-6).toUpperCase()}</Badge>
                  <CardTitle className="text-3xl font-barlow font-bold uppercase">{quote.product.title}</CardTitle>
                </div>
                <StatusBadge status={quote.status} />
              </div>
            </CardHeader>
            <CardContent className="py-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h3 className="text-xs font-bold text-steel uppercase tracking-widest">Información de Solicitud</h3>
                    <div className="space-y-2">
                       <p className="text-sm flex justify-between"><span className="text-steel">Cantidad:</span> <span className="font-bold">{quote.quantity} unidades</span></p>
                       <p className="text-sm flex justify-between"><span className="text-steel">Fecha:</span> <span className="font-bold">{new Date(quote.createdAt).toLocaleString()}</span></p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-xs font-bold text-steel uppercase tracking-widest">{isCompany ? 'Datos del Cliente' : 'Datos de la Empresa'}</h3>
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center">
                          {isCompany ? <UserIcon className="w-5 h-5 text-primary" /> : <Building2 className="w-5 h-5 text-primary" />}
                       </div>
                       <div>
                          <p className="text-sm font-bold leading-tight">{isCompany ? `${quote.client.firstName} ${quote.client.lastName}` : quote.company.name}</p>
                          <p className="text-xs text-steel">{isCompany ? quote.client.email : quote.company.city}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-steel/5">
                 <h3 className="text-xs font-bold text-steel uppercase tracking-widest">Mensaje Inicial</h3>
                 <div className="p-4 bg-surface rounded-xl italic text-steel text-sm leading-relaxed border border-steel/5">
                    "{quote.message}"
                 </div>
              </div>

              {quote.responseAt && (
                <div className="space-y-4 pt-6 border-t border-accent/20">
                   <div className="flex justify-between items-center">
                      <h3 className="text-xs font-bold text-accent uppercase tracking-widest">Respuesta de la Empresa</h3>
                      <span className="text-[10px] text-steel">{new Date(quote.responseAt).toLocaleString()}</span>
                   </div>
                   <div className={cn(
                     "p-6 rounded-2xl border-2",
                     quote.status === 'ACCEPTED' ? "bg-success/5 border-success/20" : "bg-danger/5 border-danger/20"
                   )}>
                      {quote.responsePrice && (
                        <div className="mb-4">
                           <p className="text-xs text-steel uppercase font-bold mb-1">Precio Propuesto:</p>
                           <p className="text-2xl font-bold text-primary">{quote.product.currency} {new Intl.NumberFormat().format(quote.responsePrice)}</p>
                        </div>
                      )}
                      <p className="text-sm text-primary leading-relaxed">
                         {quote.responseMessage}
                      </p>
                   </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Section */}
          <Card className="border-steel/10 shadow-sm flex flex-col h-[600px]">
            <CardHeader className="border-b border-steel/5">
              <CardTitle className="text-lg font-barlow flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-accent" /> CHAT DE NEGOCIACIÓN
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
               {isLoadingMessages ? (
                 <div className="text-center text-steel py-10">Cargando mensajes...</div>
               ) : messages?.length > 0 ? (
                 messages.map((msg: any) => (
                   <div key={msg.id} className={cn("flex flex-col max-w-[80%]", msg.senderId === user.id ? "ml-auto items-end" : "mr-auto items-start")}>
                      <div className={cn(
                        "p-4 rounded-2xl text-sm shadow-sm",
                        msg.senderId === user.id ? "bg-primary text-white rounded-tr-none" : "bg-surface border border-steel/10 rounded-tl-none"
                      )}>
                         {msg.content}
                      </div>
                      <span className="text-[10px] text-steel mt-1 uppercase font-bold tracking-tighter">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </div>
                 ))
               ) : (
                 <div className="text-center text-steel py-20 flex flex-col items-center">
                    <MessageSquare className="w-12 h-12 opacity-10 mb-4" />
                    <p>No hay mensajes en esta conversación.</p>
                    <p className="text-xs">Inicia la charla preguntando por disponibilidad o precio.</p>
                 </div>
               )}
            </CardContent>
            <div className="p-6 border-t border-steel/10 bg-surface/30">
               <div className="relative">
                  <Textarea 
                    placeholder="Escribe un mensaje..." 
                    className="pr-14 min-h-[80px] bg-white resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button 
                    size="icon" 
                    className="absolute right-3 bottom-3 bg-accent hover:bg-accent/90 text-primary"
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    onClick={() => sendMessageMutation.mutate(message)}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
               </div>
            </div>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
           <Card className="border-steel/10 shadow-sm">
              <CardHeader>
                 <CardTitle className="text-lg font-barlow">ACCIONES</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                 {isCompany && quote.status === 'PENDING' && (
                   <>
                     <Button 
                       onClick={() => setResponseModal({ open: true, type: 'ACCEPTED' })}
                       className="w-full bg-success text-white font-bold hover:bg-success/90"
                     >
                       ACEPTAR COTIZACIÓN
                     </Button>
                     <Button 
                       onClick={() => setResponseModal({ open: true, type: 'REJECTED' })}
                       variant="outline" 
                       className="w-full text-danger border-danger/20 hover:bg-danger/5 font-bold"
                     >
                       RECHAZAR
                     </Button>
                   </>
                 )}
                 {!isCompany && quote.status === 'RESPONDED' && (
                   <Button className="w-full bg-accent text-primary font-bold">CONFIRMAR COMPRA</Button>
                 )}
                 <Button variant="ghost" className="w-full text-steel text-xs uppercase font-bold">CERRAR SOLICITUD</Button>
              </CardContent>
           </Card>

           <Card className="border-steel/10 shadow-sm">
              <CardHeader>
                 <CardTitle className="text-lg font-barlow">PRODUCTO</CardTitle>
              </CardHeader>
              <CardContent>
                 <Link href={`/marketplace/${quote.product.slug}`} className="flex items-center group">
                    <div className="w-12 h-12 bg-surface rounded-lg mr-4 overflow-hidden relative">
                       {/* Placeholder image */}
                       <div className="bg-primary/5 w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-primary/20" /></div>
                    </div>
                    <div>
                       <p className="font-bold text-xs leading-tight group-hover:text-primary transition-colors">{quote.product.title}</p>
                       <p className="text-[10px] text-accent font-bold uppercase mt-1">Ver en Marketplace</p>
                    </div>
                 </Link>
              </CardContent>
           </Card>
        </div>
      </div>

      <ResponseDialog 
        modal={responseModal}
        setModal={setResponseModal}
        quote={quote}
        price={responsePrice}
        setPrice={setResponsePrice}
        msg={responseMsg}
        setMsg={setResponseMsg}
        onSend={(data: any) => respondMutation.mutate(data)}
        isPending={respondMutation.isPending}
      />
    </div>
  );
}

function ResponseDialog({ 
  modal, 
  setModal, 
  quote, 
  price, 
  setPrice, 
  msg, 
  setMsg, 
  onSend, 
  isPending 
}: any) {
  return (
    <Dialog open={modal.open} onOpenChange={(open) => setModal({ ...modal, open })}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-primary/95 shadow-2xl border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-barlow font-bold">
            {modal.type === 'ACCEPTED' ? 'ACEPTAR COTIZACIÓN' : 'RECHAZAR COTIZACIÓN'}
          </DialogTitle>
          <DialogDescription>
            {modal.type === 'ACCEPTED' 
              ? 'Envía una propuesta formal al cliente con el precio final y condiciones.' 
              : 'Indica el motivo por el cual no puedes procesar esta solicitud.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-6">
          {modal.type === 'ACCEPTED' && (
            <div className="grid gap-2">
              <Label htmlFor="price">Precio Final ({quote.product.currency})</Label>
              <Input 
                id="price" 
                type="number" 
                placeholder={quote.product.price.toString()}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="resMsg">Mensaje para el cliente</Label>
            <Textarea 
              id="resMsg" 
              placeholder="Escribe aquí los detalles..." 
              className="h-32"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setModal({ ...modal, open: false })}>CANCELAR</Button>
          <Button 
            className={modal.type === 'ACCEPTED' ? 'bg-success hover:bg-success/90' : 'bg-danger hover:bg-danger/90'}
            disabled={isPending || !msg}
            onClick={() => onSend({
              message: msg,
              status: modal.type,
              price: price ? parseFloat(price) : undefined
            })}
          >
            {isPending ? "ENVIANDO..." : "ENVIAR RESPUESTA"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'PENDING':
      return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20 px-4 py-1">PENDIENTE</Badge>;
    case 'ACCEPTED':
      return <Badge variant="outline" className="bg-success/10 text-success border-success/20 px-4 py-1">ACEPTADA</Badge>;
    case 'REJECTED':
      return <Badge variant="outline" className="bg-danger/10 text-danger border-danger/20 px-4 py-1">RECHAZADA</Badge>;
    default:
      return <Badge className="px-4 py-1">{status}</Badge>;
  }
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

function Package({ className }: any) {
  return <div className={className}>📦</div>;
}
