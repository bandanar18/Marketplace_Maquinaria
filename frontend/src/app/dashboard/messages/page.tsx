"use client";

import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ArrowRight, User as UserIcon, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { user } = useAuth();
  const isCompany = user?.role === 'COMPANY_MEMBER' || user?.companyRole;

  const { data: threads, isLoading } = useQuery({
    queryKey: ['my-threads'],
    queryFn: async () => {
      const response = await api.get('/messages/threads');
      return response.data;
    },
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-barlow font-bold uppercase tracking-tight">Mensajes</h1>
          <p className="text-steel">Gestiona tus conversaciones con {isCompany ? 'clientes' : 'vendedores'}.</p>
        </div>
      </div>

      <Card className="border-steel/10 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-10 text-center text-steel">Cargando conversaciones...</div>
          ) : threads?.length > 0 ? (
            <div className="divide-y divide-steel/5">
              {threads.map((thread: any) => (
                <Link 
                  key={thread.id} 
                  href={thread.quoteId ? `/dashboard/quotes/${thread.quoteId}` : `/dashboard/messages/${thread.id}`}
                  className="flex items-center justify-between p-6 hover:bg-surface transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10">
                      <UserIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-lg">Conversación #{thread.id.slice(-6).toUpperCase()}</p>
                        {thread.quoteId && <span className="text-[10px] bg-accent/20 text-primary font-bold px-2 py-0.5 rounded-full uppercase">Cotización</span>}
                      </div>
                      <p className="text-sm text-steel line-clamp-1 italic">
                        {thread.messages?.[0]?.content || "Inicia la conversación..."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-steel flex items-center justify-end uppercase font-bold">
                        <Clock className="w-3 h-3 mr-1" /> {new Date(thread.lastMessageAt || thread.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-steel group-hover:text-accent transition-all transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-20 text-center space-y-4">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-8 h-8 text-steel/20" />
              </div>
              <p className="text-xl font-barlow font-bold">Sin conversaciones activas</p>
              <p className="text-steel max-w-sm mx-auto">
                {isCompany 
                  ? "Todavía no has recibido mensajes directos de clientes fuera de las cotizaciones." 
                  : "Empieza a contactar vendedores para resolver tus dudas."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
