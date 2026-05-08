"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyService } from "@/services/company.service";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  Trash2, 
  X, 
  Loader2, 
  CheckCircle2, 
  Clock,
  MoreVertical,
  ShieldCheck,
  Building2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/context/auth-context";

export default function CompanyTeamPage() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['company-members'],
    queryFn: () => companyService.getCompanyMembers(),
  });

  const { data: invites, isLoading: isLoadingInvites } = useQuery({
    queryKey: ['company-invites'],
    queryFn: () => companyService.getCompanyInvites(),
  });

  const inviteMutation = useMutation({
    mutationFn: (data: { email: string; role: string }) => companyService.inviteMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-invites'] });
      toast.success("Invitación enviada");
      setIsInviteOpen(false);
      setInviteEmail("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al enviar invitación");
    }
  });

  const cancelInviteMutation = useMutation({
    mutationFn: (id: string) => companyService.cancelInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-invites'] });
      toast.success("Invitación cancelada");
    }
  });

  const removeMemberMutation = useMutation({
    mutationFn: (id: string) => companyService.removeMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-members'] });
      toast.success("Miembro eliminado del equipo");
    }
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    inviteMutation.mutate({ email: inviteEmail, role: inviteRole });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'OWNER': return <Badge className="bg-purple-500 font-bold uppercase text-[9px]">DUEÑO</Badge>;
      case 'ADMIN': return <Badge className="bg-blue-500 font-bold uppercase text-[9px]">ADMIN</Badge>;
      default: return <Badge variant="secondary" className="font-bold uppercase text-[9px]">MIEMBRO</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#2D2E2F] tracking-tight">Gestión de Equipo</h1>
          <p className="text-[#5C6370] mt-1 font-medium">Administra los accesos y roles de tus colaboradores.</p>
        </div>

        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#D32323] hover:bg-[#A61A1A] font-bold h-12 px-6 shadow-lg shadow-red-500/10">
              <UserPlus className="w-4 h-4 mr-2" /> INVITAR MIEMBRO
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Invitar Colaborador</DialogTitle>
              <DialogDescription className="font-medium">
                Envía una invitación por correo electrónico para que se una a tu equipo comercial.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-[#9099A6]">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    type="email" 
                    placeholder="vendedor@empresa.com" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-[#D32323] focus:ring-0"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-[#9099A6]">Rol del Miembro</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="border-gray-200 focus:border-[#D32323] focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBER">Vendedor (Gestiona inventario y cotizaciones)</SelectItem>
                    <SelectItem value="ADMIN">Administrador (Gestión total del perfil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4 gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)} className="font-bold">CANCELAR</Button>
                <Button type="submit" className="bg-[#1C2B3A] hover:bg-[#2d4156] text-white font-bold h-12" disabled={inviteMutation.isPending}>
                  {inviteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                  ENVIAR INVITACIÓN
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Members List */}
        <div className="lg:col-span-2 space-y-4">
           <h2 className="text-sm font-bold uppercase tracking-widest text-[#9099A6] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Miembros Activos
           </h2>
           <div className="grid gap-3">
              {isLoadingMembers ? (
                Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-xl" />)
              ) : members?.map((member: any) => (
                <Card key={member.id} className="border-[#EBEBEB] shadow-sm bg-white overflow-hidden">
                   <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-[#F5F5F5] border border-[#EBEBEB] flex items-center justify-center overflow-hidden">
                            {member.avatarUrl ? (
                              <img src={member.avatarUrl} alt={member.firstName} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-bold text-[#5C6370]">{member.firstName[0]}</span>
                            )}
                         </div>
                         <div>
                            <div className="flex items-center gap-2">
                               <p className="font-bold text-[#2D2E2F]">{member.firstName} {member.lastName}</p>
                               {getRoleBadge(member.companyRole)}
                            </div>
                            <p className="text-xs text-[#9099A6]">{member.email}</p>
                         </div>
                      </div>

                      {member.id !== currentUser?.id && member.companyRole !== 'OWNER' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end" className="bg-white">
                             <DropdownMenuItem 
                               className="text-danger font-bold text-xs"
                               onClick={() => removeMemberMutation.mutate(member.id)}
                             >
                                <Trash2 className="w-4 h-4 mr-2" /> Eliminar del equipo
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                   </CardContent>
                </Card>
              ))}
           </div>
        </div>

        {/* Pending Invites */}
        <div className="space-y-4">
           <h2 className="text-sm font-bold uppercase tracking-widest text-[#9099A6] flex items-center gap-2">
              <Clock className="w-4 h-4" /> Invitaciones Pendientes
           </h2>
           <div className="space-y-3">
              {isLoadingInvites ? (
                <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-300" /></div>
              ) : invites?.length === 0 ? (
                <div className="p-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-[#EBEBEB]">
                   <p className="text-xs text-[#9099A6] font-medium">No hay invitaciones pendientes.</p>
                </div>
              ) : (
                invites.map((invite: any) => (
                  <div key={invite.id} className="p-4 rounded-xl border border-[#EBEBEB] bg-white space-y-3">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                           <Mail className="w-3.5 h-3.5 text-[#D32323]" />
                           <span className="text-xs font-bold text-[#2D2E2F] truncate max-w-[150px]">{invite.email}</span>
                        </div>
                        <Badge variant="outline" className="text-[8px] font-bold">{invite.role}</Badge>
                     </div>
                     <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                        <span className="text-[10px] text-[#9099A6]">Expira el {format(new Date(invite.expiresAt), 'dd/MM')}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-[10px] font-bold text-danger hover:bg-red-50"
                          onClick={() => cancelInviteMutation.mutate(invite.id)}
                        >
                           CANCELAR
                        </Button>
                     </div>
                  </div>
                ))
              )}
           </div>

           <Card className="bg-[#2D2E2F] text-white border-none mt-10">
              <CardContent className="p-6">
                 <Building2 className="w-8 h-8 text-[#D32323] mb-4" />
                 <h3 className="font-bold mb-2 uppercase text-sm">Escalabilidad Empresarial</h3>
                 <p className="text-xs text-[#9099A6] leading-relaxed">
                    Invita a tus agentes de ventas para que respondan cotizaciones y suban equipos sin compartir tu contraseña maestra.
                 </p>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
