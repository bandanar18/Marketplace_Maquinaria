"use client";

import { useQuery } from "@tanstack/react-query";
import { companyService } from "@/services/company.service";
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  User as UserIcon,
  Loader2,
  ChevronRight,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";

export default function CompanyCustomersPage() {
  const [search, setSearch] = useState("");

  const { data: customers, isLoading } = useQuery({
    queryKey: ['company-customers'],
    queryFn: () => companyService.getCompanyCustomers(),
  });

  const safeFormatDate = (dateString: string, formatStr: string) => {
    try {
      if (!dateString) return 'N/A';
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return 'N/A';
      return format(d, formatStr, { locale: es });
    } catch (e) {
      return 'N/A';
    }
  };

  const filteredCustomers = customers?.filter((c: any) => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D2E2F] tracking-tight flex items-center gap-2 uppercase">
            <Users className="w-6 h-6 text-[#D32323]" /> Mis Clientes
          </h1>
          <p className="text-sm text-[#5C6370]">Directorio de personas que han solicitado cotizaciones de tus equipos.</p>
        </div>
        
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="bg-white font-bold border-[#EBEBEB]">
              {filteredCustomers?.length || 0} LEADS TOTALES
           </Badge>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9099A6]" />
        <Input 
          placeholder="Buscar cliente por nombre o email..." 
          className="pl-10 bg-white border-[#EBEBEB] focus:ring-[#D32323] h-12 font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />
          ))
        ) : filteredCustomers?.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-xl border border-dashed border-[#EBEBEB]">
             <UserIcon className="w-12 h-12 text-[#9099A6] mx-auto mb-4 opacity-20" />
             <p className="text-[#5C6370] font-medium">No se encontraron clientes en tu directorio.</p>
          </div>
        ) : (
          filteredCustomers.map((customer: any) => (
            <Card key={customer.id} className="border-[#EBEBEB] hover:shadow-md transition-all group bg-white overflow-hidden">
               <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center p-5 gap-6">
                     {/* Avatar & Basic Info */}
                     <div className="flex items-center gap-4 min-w-[250px]">
                        <div className="w-12 h-12 rounded-full bg-[#F5F5F5] border border-[#EBEBEB] flex items-center justify-center overflow-hidden shrink-0">
                           {customer.avatarUrl ? (
                             <img src={customer.avatarUrl} alt={customer.firstName} className="w-full h-full object-cover" />
                           ) : (
                             <span className="text-lg font-black text-[#5C6370] uppercase">{customer.firstName[0]}</span>
                           )}
                        </div>
                        <div>
                           <h3 className="font-bold text-[#2D2E2F] group-hover:text-[#D32323] transition-colors">
                              {customer.firstName} {customer.lastName}
                           </h3>
                           <p className="text-xs text-[#9099A6] flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Cliente desde {safeFormatDate(customer.createdAt, 'MMM yyyy')}
                           </p>
                        </div>
                     </div>

                     {/* Contact Info */}
                     <div className="flex flex-col gap-1 flex-1">
                        <div className="flex items-center gap-2 text-sm text-[#5C6370]">
                           <Mail className="w-3.5 h-3.5" /> {customer.email}
                        </div>
                        {customer.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-[#5C6370]">
                             <Phone className="w-3.5 h-3.5" /> {customer.phoneNumber}
                          </div>
                        )}
                     </div>

                     {/* Interaction Stats */}
                     <div className="flex items-center gap-8 px-6 border-l border-r border-[#EBEBEB] hidden lg:flex">
                        <div className="text-center">
                           <p className="text-[10px] font-black text-[#9099A6] uppercase mb-1">Cotizaciones</p>
                           <p className="text-lg font-black text-[#2D2E2F]">{customer.totalQuotes}</p>
                        </div>
                        <div className="text-center">
                           <p className="text-[10px] font-black text-[#9099A6] uppercase mb-1">Último contacto</p>
                           <p className="text-sm font-bold text-[#2D2E2F]">{safeFormatDate(customer.lastInteraction, 'dd/MM/yy')}</p>
                        </div>
                     </div>

                     {/* Interests */}
                     <div className="flex-1 hidden xl:block">
                        <p className="text-[10px] font-black text-[#9099A6] uppercase mb-2">Equipos de interés</p>
                        <div className="flex flex-wrap gap-1.5">
                           {customer.interests.map((interest: string, i: number) => (
                             <Badge key={i} variant="secondary" className="text-[9px] bg-gray-50 text-[#5C6370] border-[#EBEBEB]">
                                {interest}
                             </Badge>
                           ))}
                        </div>
                     </div>

                     {/* Action */}
                     <div className="shrink-0">
                        <Link href={`/dashboard/messages?userId=${customer.id}`}>
                           <Button className="bg-[#D32323] hover:bg-[#A61A1A] font-bold text-xs">
                              <MessageSquare className="w-3.5 h-3.5 mr-2" /> ENVIAR MENSAJE
                           </Button>
                        </Link>
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
