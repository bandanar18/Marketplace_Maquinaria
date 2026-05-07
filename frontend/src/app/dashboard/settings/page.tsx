"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "@/services/auth.service";
import { companyService } from "@/services/company.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, User, Building2, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().min(2, "Nombre muy corto"),
  lastName: z.string().min(2, "Apellido muy corto"),
  phone: z.string().optional(),
  country: z.string().min(2, "País requerido"),
  city: z.string().min(2, "Ciudad requerida"),
});

const companySchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  description: z.string().min(10, "Descripción muy corta"),
  phone: z.string().min(7, "Teléfono requerido"),
  email: z.string().email("Correo inválido"),
  address: z.string().min(5, "Dirección requerida"),
  city: z.string().min(2, "Ciudad requerida"),
  country: z.string().min(2, "País requerido"),
  website: z.string().optional(),
});

export default function SettingsPage() {
  const { user, fetchUser } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);

  const isCompanyUser = user?.role === 'COMPANY_MEMBER' || user?.companyRole;

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      country: user?.country || "",
      city: user?.city || "",
    },
  });

  const {
    register: registerCompany,
    handleSubmit: handleSubmitCompany,
    reset: resetCompany,
    formState: { errors: companyErrors },
  } = useForm({
    resolver: zodResolver(companySchema),
  });

  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || "",
        country: user.country,
        city: user.city,
      });
    }

    if (isCompanyUser) {
      loadCompany();
    }
  }, [user]);

  const loadCompany = async () => {
    setIsLoadingCompany(true);
    try {
      const data = await companyService.getMyCompany();
      setCompany(data);
      resetCompany({
        name: data.name,
        description: data.description,
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        country: data.country,
        website: data.website || "",
      });
    } catch (error) {
      console.error("Error loading company:", error);
    } finally {
      setIsLoadingCompany(false);
    }
  };

  const onProfileSubmit = async (data: any) => {
    setIsPending(true);
    try {
      await authService.updateMe(data);
      await fetchUser();
      toast.success("Perfil actualizado correctamente");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al actualizar perfil");
    } finally {
      setIsPending(false);
    }
  };

  const onCompanySubmit = async (data: any) => {
    setIsPending(true);
    try {
      await companyService.updateMyCompany(data);
      await loadCompany();
      toast.success("Perfil de empresa actualizado");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al actualizar empresa");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-barlow font-bold uppercase tracking-tight">Configuración</h1>
        <p className="text-steel">Gestiona tu información personal y de empresa.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 h-12 bg-surface border border-steel/10">
          <TabsTrigger value="profile" className="font-bold uppercase text-xs">
            <User className="w-4 h-4 mr-2" /> Perfil Personal
          </TabsTrigger>
          {isCompanyUser && (
            <TabsTrigger value="company" className="font-bold uppercase text-xs">
              <Building2 className="w-4 h-4 mr-2" /> Empresa
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-steel/10 shadow-sm">
            <CardHeader>
              <CardTitle className="font-barlow">Información Personal</CardTitle>
              <CardDescription>Actualiza tus datos de contacto y ubicación.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input {...registerProfile("firstName")} />
                    {profileErrors.firstName && <p className="text-xs text-danger">{profileErrors.firstName.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Apellido</Label>
                    <Input {...registerProfile("lastName")} />
                    {profileErrors.lastName && <p className="text-xs text-danger">{profileErrors.lastName.message as string}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Correo Electrónico</Label>
                    <Input value={user?.email} disabled className="bg-surface cursor-not-allowed opacity-70" />
                    <p className="text-[10px] text-steel italic">El correo no puede ser modificado por seguridad.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <Input {...registerProfile("phone")} placeholder="+1 234 567 890" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>País</Label>
                    <Input {...registerProfile("country")} />
                    {profileErrors.country && <p className="text-xs text-danger">{profileErrors.country.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Ciudad</Label>
                    <Input {...registerProfile("city")} />
                    {profileErrors.city && <p className="text-xs text-danger">{profileErrors.city.message as string}</p>}
                  </div>
                </div>

                <div className="pt-4 border-t border-steel/10">
                  <Button type="submit" className="bg-primary text-white font-bold" disabled={isPending}>
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    GUARDAR CAMBIOS
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {isCompanyUser && (
          <TabsContent value="company">
            <Card className="border-steel/10 shadow-sm">
              <CardHeader>
                <CardTitle className="font-barlow">Perfil Empresarial</CardTitle>
                <CardDescription>Esta información es pública en el marketplace.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCompany ? (
                  <div className="py-20 text-center">Cargando datos de empresa...</div>
                ) : (
                  <form onSubmit={handleSubmitCompany(onCompanySubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Nombre de la Empresa</Label>
                        <Input {...registerCompany("name")} />
                        {companyErrors.name && <p className="text-xs text-danger">{companyErrors.name.message as string}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Sitio Web</Label>
                        <Input {...registerCompany("website")} placeholder="https://www.tuempresa.com" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea {...registerCompany("description")} rows={4} className="resize-none" />
                      {companyErrors.description && <p className="text-xs text-danger">{companyErrors.description.message as string}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Correo de Contacto</Label>
                        <Input {...registerCompany("email")} />
                        {companyErrors.email && <p className="text-xs text-danger">{companyErrors.email.message as string}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Teléfono Corporativo</Label>
                        <Input {...registerCompany("phone")} />
                        {companyErrors.phone && <p className="text-xs text-danger">{companyErrors.phone.message as string}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Dirección Física</Label>
                      <Input {...registerCompany("address")} />
                      {companyErrors.address && <p className="text-xs text-danger">{companyErrors.address.message as string}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>País</Label>
                        <Input {...registerCompany("country")} />
                        {companyErrors.country && <p className="text-xs text-danger">{companyErrors.country.message as string}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Ciudad</Label>
                        <Input {...registerCompany("city")} />
                        {companyErrors.city && <p className="text-xs text-danger">{companyErrors.city.message as string}</p>}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-steel/10">
                      <Button type="submit" className="bg-primary text-white font-bold" disabled={isPending}>
                        {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        ACTUALIZAR EMPRESA
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
