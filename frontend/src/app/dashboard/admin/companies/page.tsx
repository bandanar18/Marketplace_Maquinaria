"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyService } from "@/services/company.service";
import { adminService } from "@/services/admin.service";
import { 
  Building2, 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Filter,
  Check,
  X,
  Loader2,
  FileText,
  Download
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

export default function AdminCompaniesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING_REVIEW");
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<"APPROVE" | "REJECT" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: companiesData, isLoading } = useQuery({
    queryKey: ['admin-companies', statusFilter, search],
    queryFn: () => companyService.getAdminCompanies({ 
      status: statusFilter, 
      search: search || undefined 
    }),
  });

  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("BASIC");
  const [planExpiry, setPlanExpiry] = useState("");

  const mutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string, status: string, reason?: string }) => 
      companyService.updateCompanyStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
      toast.success("Estado de la empresa actualizado correctamente");
      setSelectedCompany(null);
      setReviewAction(null);
      setRejectionReason("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al actualizar estado");
    }
  });

  const planMutation = useMutation({
    mutationFn: ({ id, plan, expiresAt }: { id: string, plan: string, expiresAt?: string }) => 
      companyService.updateCompanyPlan(id, plan, expiresAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
      toast.success("Plan actualizado correctamente");
      setIsPlanDialogOpen(false);
      setSelectedCompany(null);
    },
    onError: (error: any) => {
      toast.error("Error al actualizar el plan");
    }
  });

  const handleReview = (status: "ACTIVE" | "REJECTED") => {
    if (!selectedCompany) return;
    mutation.mutate({ 
      id: selectedCompany.id, 
      status, 
      reason: status === 'REJECTED' ? rejectionReason : undefined 
    });
  };

  const handlePlanUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;
    planMutation.mutate({
      id: selectedCompany.id,
      plan: selectedPlan,
      expiresAt: planExpiry || undefined
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D2E2F] tracking-tight flex items-center gap-2 uppercase">
            <Building2 className="w-6 h-6 text-[#D32323]" /> Verificación de Empresas
          </h1>
          <p className="text-sm text-[#5C6370]">Valida la identidad y documentos de los nuevos distribuidores.</p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="font-bold border-[#EBEBEB] text-[#5C6370] hover:text-[#D32323]"
          onClick={() => adminService.exportData('companies')}
        >
          <Download className="w-4 h-4 mr-2" /> EXPORTAR CSV
        </Button>

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
            VERIFICADAS
          </Button>
          <Button 
            variant={statusFilter === 'REJECTED' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setStatusFilter('REJECTED')}
            className={statusFilter === 'REJECTED' ? 'bg-[#D32323] hover:bg-[#A61A1A] font-bold' : 'text-xs font-bold'}
          >
            RECHAZADAS
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9099A6]" />
        <Input 
          placeholder="Buscar por nombre o RIF/TaxID..." 
          className="pl-10 bg-white border-[#EBEBEB] focus:ring-[#D32323]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-dashed border-[#EBEBEB]">
            <Loader2 className="w-8 h-8 animate-spin text-[#D32323]" />
            <p className="text-sm font-bold text-[#5C6370] uppercase tracking-widest">Cargando empresas...</p>
          </div>
        ) : companiesData?.items?.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-dashed border-[#EBEBEB]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-[#9099A6]" />
            </div>
            <p className="text-sm font-bold text-[#5C6370] uppercase tracking-widest">No hay empresas {statusFilter === 'PENDING_REVIEW' ? 'pendientes' : 'en esta categoría'}</p>
          </div>
        ) : (
          companiesData.items.map((company: any) => (
            <Card key={company.id} className="overflow-hidden border-[#EBEBEB] hover:shadow-md transition-shadow">
               <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-[#D32323] font-black text-2xl border border-[#EBEBEB] shrink-0">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        company.name[0]
                      )}
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-[#2D2E2F]">{company.name}</h3>
                            <div className="flex items-center gap-2">
                               <Badge variant={
                                 company.status === 'ACTIVE' ? 'success' : 
                                 company.status === 'PENDING_REVIEW' ? 'warning' : 'destructive'
                               } className="text-[10px] font-bold uppercase">
                                 {company.status === 'ACTIVE' ? 'Verificada' : 
                                  company.status === 'PENDING_REVIEW' ? 'En Revisión' : 'Rechazada'}
                               </Badge>
                               <Badge variant="outline" className="text-[10px] font-bold uppercase border-[#D32323] text-[#D32323]">
                                 PLAN {company.plan}
                               </Badge>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-[#5C6370]">
                            <span className="flex items-center gap-1 font-mono bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold">ID: {company.taxId}</span>
                            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {company.email}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {company.phone}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {company.city}, {company.country}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 text-right">
                           <div className="flex items-center gap-1 text-[10px] font-bold text-[#9099A6] uppercase tracking-wider">
                              <Calendar className="w-3 h-3" /> Registrada: {format(new Date(company.createdAt), 'dd MMM yyyy', { locale: es })}
                           </div>
                           {company.planExpiresAt && (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-[#D32323] uppercase tracking-wider">
                                <Clock className="w-3 h-3" /> Expira: {format(new Date(company.planExpiresAt), 'dd MMM yyyy', { locale: es })}
                              </div>
                           )}
                        </div>
                      </div>

                      <p className="text-sm text-[#5C6370] line-clamp-2 italic">
                        "{company.description}"
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex gap-4">
                           <Button variant="ghost" size="sm" className="text-[10px] font-bold text-[#5C6370] hover:text-[#D32323]">
                              <FileText className="w-3.5 h-3.5 mr-2" /> VER DOCUMENTOS
                           </Button>
                           <Button 
                            onClick={() => {
                              setSelectedCompany(company);
                              setSelectedPlan(company.plan);
                              setPlanExpiry(company.planExpiresAt ? format(new Date(company.planExpiresAt), 'yyyy-MM-dd') : "");
                              setIsPlanDialogOpen(true);
                            }}
                            variant="ghost" 
                            size="sm" 
                            className="text-[10px] font-bold text-[#D32323]"
                           >
                              <Award className="w-3.5 h-3.5 mr-2" /> GESTIONAR PLAN
                           </Button>
                        </div>
                           {company.website && (
                             <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[10px] font-bold text-[#5C6370] hover:text-[#D32323]">
                                <Eye className="w-3.5 h-3.5 mr-2" /> VISITAR SITIO WEB
                             </a>
                           )}
                        </div>

                        <div className="flex items-center gap-2">
                          {company.status === 'PENDING_REVIEW' && (
                            <>
                              <Button 
                                onClick={() => { setSelectedCompany(company); setReviewAction('REJECT'); }} 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs font-bold text-[#D32323] hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-2" /> RECHAZAR
                              </Button>
                              <Button 
                                onClick={() => { setSelectedCompany(company); setReviewAction('APPROVE'); }} 
                                className="text-xs font-bold bg-[#D32323] hover:bg-[#A61A1A] text-white px-6"
                                size="sm"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" /> VERIFICAR EMPRESA
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
               </CardContent>
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
                <><CheckCircle className="text-success w-6 h-6" /> Verificar Empresa</>
              ) : (
                <><XCircle className="text-danger w-6 h-6" /> Rechazar Registro</>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {reviewAction === 'APPROVE' ? 
                "¿Has validado la identidad y solvencia de esta empresa? Una vez verificada podrá publicar equipos." : 
                "Indica por qué no se puede verificar esta empresa (ej: documentos incompletos, datos falsos)."
              }
            </DialogDescription>
          </DialogHeader>

          {reviewAction === 'REJECT' && (
            <div className="py-4">
              <Textarea 
                placeholder="Ej: El RIF adjunto no coincide con el nombre de la empresa..." 
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
              {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (reviewAction === 'APPROVE' ? "CONFIRMAR VERIFICACIÓN" : "CONFIRMAR RECHAZO")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Management Dialog */}
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border-none shadow-2xl">
          <form onSubmit={handlePlanUpdate}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold uppercase flex items-center gap-2">
                <Award className="text-[#D32323] w-6 h-6" /> Gestionar Plan: {selectedCompany?.name}
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Cambia el nivel de suscripción y la fecha de vencimiento de la empresa.
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#9099A6]">Nivel de Plan</Label>
                <div className="grid grid-cols-3 gap-2">
                  {['BASIC', 'PROFESSIONAL', 'ENTERPRISE'].map((p) => (
                    <Button
                      key={p}
                      type="button"
                      variant={selectedPlan === p ? 'default' : 'outline'}
                      className={selectedPlan === p ? 'bg-[#D32323] hover:bg-[#A61A1A] font-bold' : 'font-bold border-[#EBEBEB]'}
                      onClick={() => setSelectedPlan(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-[10px] font-black uppercase tracking-widest text-[#9099A6]">Fecha de Vencimiento</Label>
                <Input 
                  id="expiry"
                  type="date"
                  className="border-[#EBEBEB] focus:ring-[#D32323]"
                  value={planExpiry}
                  onChange={(e) => setPlanExpiry(e.target.value)}
                />
                <p className="text-[10px] text-[#9099A6]">Deja en blanco para plan vitalicio o sin vencimiento definido.</p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPlanDialogOpen(false)} className="font-bold border-[#EBEBEB]">
                CANCELAR
              </Button>
              <Button type="submit" className="bg-[#D32323] hover:bg-[#A61A1A] font-bold text-white" disabled={planMutation.isPending}>
                {planMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ACTUALIZAR PLAN"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
