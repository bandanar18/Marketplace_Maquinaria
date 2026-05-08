"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { adminService } from "@/services/admin.service";
import { 
  Users, 
  Search, 
  Shield, 
  User as UserIcon, 
  Building2, 
  Mail, 
  Phone, 
  Calendar,
  MoreVertical,
  Ban,
  CheckCircle,
  Clock,
  Filter,
  Loader2,
  AlertTriangle,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [statusAction, setStatusAction] = useState<string | null>(null);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', roleFilter, search],
    queryFn: () => userService.getAdminUsers({ 
      role: roleFilter || undefined, 
      search: search || undefined 
    }),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      userService.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success("Estado del usuario actualizado");
      setSelectedUser(null);
      setStatusAction(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al actualizar usuario");
    }
  });

  const handleStatusChange = (status: string) => {
    if (!selectedUser) return;
    mutation.mutate({ id: selectedUser.id, status });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPERADMIN': return <Badge className="bg-purple-500 hover:bg-purple-600 font-bold">ADMIN</Badge>;
      case 'COMPANY_MEMBER': return <Badge className="bg-[#D32323] hover:bg-[#A61A1A] font-bold">EMPRESA</Badge>;
      default: return <Badge variant="outline" className="font-bold">CLIENTE</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <Badge variant="success" className="font-bold">ACTIVO</Badge>;
      case 'SUSPENDED': return <Badge variant="warning" className="font-bold">SUSPENDIDO</Badge>;
      case 'BANNED': return <Badge variant="destructive" className="font-bold">BANEADO</Badge>;
      default: return <Badge variant="outline" className="font-bold">PENDIENTE</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#2D2E2F] tracking-tight flex items-center gap-2 uppercase">
            <Users className="w-6 h-6 text-[#D32323]" /> Gestión de Usuarios
          </h1>
          <p className="text-sm text-[#5C6370]">Administra los perfiles de clientes y distribuidores del sistema.</p>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="font-bold border-[#EBEBEB] text-[#5C6370] hover:text-[#D32323]"
          onClick={() => adminService.exportData('users')}
        >
          <Download className="w-4 h-4 mr-2" /> EXPORTAR CSV
        </Button>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-[#EBEBEB] shadow-sm">
          <Button 
            variant={roleFilter === '' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setRoleFilter('')}
            className={roleFilter === '' ? 'bg-[#D32323] hover:bg-[#A61A1A] font-bold' : 'text-xs font-bold'}
          >
            TODOS
          </Button>
          <Button 
            variant={roleFilter === 'COMPANY_MEMBER' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setRoleFilter('COMPANY_MEMBER')}
            className={roleFilter === 'COMPANY_MEMBER' ? 'bg-[#D32323] hover:bg-[#A61A1A] font-bold' : 'text-xs font-bold'}
          >
            EMPRESAS
          </Button>
          <Button 
            variant={roleFilter === 'CLIENT' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setRoleFilter('CLIENT')}
            className={roleFilter === 'CLIENT' ? 'bg-[#D32323] hover:bg-[#A61A1A] font-bold' : 'text-xs font-bold'}
          >
            CLIENTES
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9099A6]" />
        <Input 
          placeholder="Buscar por nombre, apellido o email..." 
          className="pl-10 bg-white border-[#EBEBEB] focus:ring-[#D32323]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="border-[#EBEBEB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-[#EBEBEB]">
                <th className="px-6 py-4 text-[10px] font-bold text-[#9099A6] uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#9099A6] uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#9099A6] uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#9099A6] uppercase tracking-wider">Registro</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#9099A6] uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBEB]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                     <Loader2 className="w-8 h-8 animate-spin text-[#D32323] mx-auto mb-2" />
                     <p className="text-xs font-bold text-[#5C6370] uppercase">Cargando usuarios...</p>
                  </td>
                </tr>
              ) : usersData?.items?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-[#5C6370] italic">
                     No se encontraron usuarios.
                  </td>
                </tr>
              ) : (
                usersData.items.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#2D2E2F] font-bold text-sm border border-[#EBEBEB]">
                           {user.avatarUrl ? (
                             <img src={user.avatarUrl} alt={user.firstName} className="w-full h-full rounded-full object-cover" />
                           ) : (
                             user.firstName[0]
                           )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#2D2E2F] leading-none mb-1">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-[#5C6370]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                      {user.company && (
                        <div className="flex items-center gap-1 text-[9px] font-bold text-[#9099A6] mt-1 uppercase">
                          <Building2 className="w-3 h-3" /> {user.company.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-[10px] font-medium text-[#5C6370]">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: es })}</span>
                        {user.lastLoginAt && (
                          <span className="flex items-center gap-1 text-[#9099A6]"><Clock className="w-3 h-3" /> {format(new Date(user.lastLoginAt), 'HH:mm', { locale: es })}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="bg-white border-[#EBEBEB]">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-[#9099A6]">Seguridad</DropdownMenuLabel>
                            {user.status !== 'ACTIVE' && (
                              <DropdownMenuItem onClick={() => { setSelectedUser(user); setStatusAction('ACTIVE'); }} className="text-success font-bold text-xs">
                                <CheckCircle className="w-4 h-4 mr-2" /> Activar Usuario
                              </DropdownMenuItem>
                            )}
                            {user.status === 'ACTIVE' && (
                              <DropdownMenuItem onClick={() => { setSelectedUser(user); setStatusAction('SUSPENDED'); }} className="text-warning font-bold text-xs">
                                <Ban className="w-4 h-4 mr-2" /> Suspender Temporalmente
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setSelectedUser(user); setStatusAction('BANNED'); }} className="text-danger font-bold text-xs">
                              <Shield className="w-4 h-4 mr-2" /> Banear permanentemente
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!statusAction} onOpenChange={() => setStatusAction(null)}>
         <DialogContent className="bg-white border-none shadow-2xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold uppercase flex items-center gap-2">
                 <AlertTriangle className={statusAction === 'BANNED' ? "text-danger" : "text-warning"} />
                 {statusAction === 'ACTIVE' ? "Activar Usuario" : statusAction === 'SUSPENDED' ? "Suspender Usuario" : "Banear Usuario"}
              </DialogTitle>
              <DialogDescription>
                 ¿Estás seguro de que quieres cambiar el estado de <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong> a <strong>{statusAction}</strong>?
                 {statusAction === 'BANNED' && " Esta acción impedirá que el usuario vuelva a acceder al sistema."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <Button variant="outline" onClick={() => setStatusAction(null)} className="font-bold border-[#EBEBEB]">CANCELAR</Button>
               <Button 
                className={statusAction === 'ACTIVE' ? "bg-success hover:bg-success/90 font-bold" : "bg-[#D32323] hover:bg-[#A61A1A] font-bold"}
                onClick={() => handleStatusChange(statusAction!)}
                disabled={mutation.isPending}
               >
                 {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "CONFIRMAR"}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  );
}
