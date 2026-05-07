"use client";

import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { quotesService } from "@/services/products.service";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowRight, Clock, CheckCircle2, MoreVertical } from "lucide-react";
import Link from "next/link";

export default function QuotesPage() {
  const { user } = useAuth();
  const isCompany = user?.role === 'COMPANY_MEMBER' || user?.companyRole;

  const { data: quotes, isLoading } = useQuery({
    queryKey: ['my-quotes'],
    queryFn: () => quotesService.getMyQuotes(),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#2D2E2F]">Cotizaciones</h1>
        <p className="text-sm text-[#5C6370] font-medium mt-1">Gestiona tus solicitudes de precio y mensajes con clientes.</p>
      </div>

      <Card className="border-[#EBEBEB] shadow-sm overflow-hidden bg-white rounded-lg">
        <Table>
          <TableHeader className="bg-[#F5F5F5] border-b border-[#EBEBEB]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-[#2D2E2F] py-4">ID</TableHead>
              <TableHead className="font-bold text-[#2D2E2F] py-4">{isCompany ? 'Cliente' : 'Equipo'}</TableHead>
              <TableHead className="font-bold text-[#2D2E2F] py-4 text-center">Estado</TableHead>
              <TableHead className="font-bold text-[#2D2E2F] py-4 text-center">Respuesta</TableHead>
              <TableHead className="text-right font-bold text-[#2D2E2F] py-4">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-[#5C6370]">Cargando cotizaciones...</TableCell>
              </TableRow>
            ) : quotes?.length > 0 ? (
              quotes.map((quote: any) => (
                <TableRow key={quote.id} className="hover:bg-[#F5F5F5]/50 border-[#EBEBEB] transition-colors">
                  <TableCell className="font-mono text-[11px] text-[#9099A6]">
                    #{quote.id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell className="py-4">
                    {isCompany ? (
                      <div className="space-y-1">
                        <p className="font-bold text-[#2D2E2F]">{quote.client.firstName} {quote.client.lastName}</p>
                        <p className="text-xs text-[#0073BB] font-medium">{quote.product.title}</p>
                        <p className="text-[11px] text-[#9099A6] italic line-clamp-1 max-w-[250px]">"{quote.message}"</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Link href={`/marketplace/${quote.product.slug}`} className="font-bold text-[#0073BB] hover:underline block">
                          {quote.product.title}
                        </Link>
                        <p className="text-xs text-[#2D2E2F] font-bold uppercase tracking-wider">{quote.company.name}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={quote.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    {quote.responseAt ? (
                      <div className="inline-flex items-center text-[#27AE60] text-xs font-bold bg-[#EAFAF1] px-2 py-1 rounded-sm border border-[#27AE60]/10">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Respondida
                      </div>
                    ) : (
                      <div className="inline-flex items-center text-[#9099A6] text-xs font-medium bg-[#F5F5F5] px-2 py-1 rounded-sm border border-[#EBEBEB]">
                        <Clock className="w-3 h-3 mr-1" /> Pendiente
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/dashboard/quotes/${quote.id}`}
                        className="bg-white border border-[#EBEBEB] hover:bg-[#F5F5F5] text-[#2D2E2F] font-bold text-xs px-4 py-2 rounded-[4px] transition-colors flex items-center shadow-sm"
                      >
                        Gestionar <ArrowRight className="ml-2 w-3.5 h-3.5 text-[#D32323]" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20">
                  <div className="max-w-xs mx-auto">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-[#EBEBEB]" />
                    <p className="text-[#2D2E2F] font-bold text-lg mb-1">No hay cotizaciones</p>
                    <p className="text-[#5C6370] text-sm mb-4">Cuando recibas o envíes cotizaciones, aparecerán aquí.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'PENDING':
      return <Badge className="bg-[#F15C00]/10 text-[#F15C00] border-[#F15C00]/20 rounded-sm font-bold text-[10px] uppercase">Pendiente</Badge>;
    case 'ACCEPTED':
      return <Badge className="bg-[#27AE60]/10 text-[#27AE60] border-[#27AE60]/20 rounded-sm font-bold text-[10px] uppercase">Aceptada</Badge>;
    case 'REJECTED':
      return <Badge className="bg-[#D32323]/10 text-[#D32323] border-[#D32323]/20 rounded-sm font-bold text-[10px] uppercase">Rechazada</Badge>;
    case 'EXPIRED':
      return <Badge className="bg-[#9099A6]/10 text-[#9099A6] border-[#9099A6]/20 rounded-sm font-bold text-[10px] uppercase">Expirada</Badge>;
    default:
      return <Badge className="rounded-sm font-bold text-[10px] uppercase">{status}</Badge>;
  }
}
