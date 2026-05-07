"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, User, Building2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const clientSchema = z.object({
  firstName: z.string().min(2, "Nombre muy corto"),
  lastName: z.string().min(2, "Apellido muy corto"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  country: z.string().min(2, "País requerido"),
  city: z.string().min(2, "Ciudad requerida"),
  terms: z.boolean().refine((val) => val === true, "Debes aceptar los términos"),
});

const companySchema = z.object({
  // User info
  firstName: z.string().min(2, "Nombre muy corto"),
  lastName: z.string().min(2, "Apellido muy corto"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  // Company info
  companyName: z.string().min(2, "Nombre de empresa requerido"),
  taxId: z.string().min(5, "NIT/RUT requerido"),
  phone: z.string().min(7, "Teléfono requerido"),
  website: z.string().optional(),
  country: z.string().min(2, "País requerido"),
  city: z.string().min(2, "Ciudad requerida"),
  address: z.string().min(5, "Dirección requerida"),
  description: z.string().min(10, "Breve descripción requerida"),
  terms: z.boolean().refine((val) => val === true, "Debes aceptar los términos"),
});

type ClientFormValues = z.infer<typeof clientSchema>;
type CompanyFormValues = z.infer<typeof companySchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { registerClient, registerCompany } = useAuth();
  const [isPending, setIsPending] = useState(false);

  const clientForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { terms: false },
  });

  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: { terms: false },
  });

  const onClientSubmit = async (data: ClientFormValues) => {
    setIsPending(true);
    setError(null);
    try {
      await registerClient(data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrar cliente.");
    } finally {
      setIsPending(false);
    }
  };

  const onCompanySubmit = async (data: CompanyFormValues) => {
    setIsPending(true);
    setError(null);
    try {
      await registerCompany({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
        city: data.city,
        companyName: data.companyName,
        taxId: data.taxId,
        phone: data.phone,
        website: data.website,
        address: data.address,
        description: data.description,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrar empresa.");
    } finally {
      setIsPending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-surface">
        <Card className="w-full max-w-md text-center p-8">
          <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-6" />
          <h2 className="text-3xl font-barlow font-bold mb-4">REGISTRO COMPLETADO</h2>
          <p className="text-steel mb-8">
            Hemos enviado un correo de verificación. Por favor revisa tu bandeja de entrada para activar tu cuenta.
          </p>
          <Button asChild className="w-full bg-primary font-bold">
            <Link href="/auth/login">IR AL LOGIN</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-barlow font-bold mb-4 tracking-tight">ÚNETE A LA RED INDUSTRIAL</h1>
          <p className="text-steel max-w-xl mx-auto">
            Selecciona el tipo de cuenta que mejor se adapte a tus necesidades.
          </p>
        </div>

        <Tabs defaultValue="client" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md mx-auto h-14 p-1 bg-surface border border-steel/10">
            <TabsTrigger value="client" className="data-[state=active]:bg-white data-[state=active]:text-primary font-bold">
              <User className="mr-2 w-4 h-4" /> CLIENTE
            </TabsTrigger>
            <TabsTrigger value="company" className="data-[state=active]:bg-white data-[state=active]:text-primary font-bold">
              <Building2 className="mr-2 w-4 h-4" /> EMPRESA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="client">
            <Card className="border-none shadow-xl bg-white dark:bg-primary/5">
              <CardHeader>
                <CardTitle className="font-barlow">Datos Personales</CardTitle>
                <CardDescription>Regístrate como comprador individual para cotizar y seguir equipos.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-6">
                  {error && <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-sm rounded-md">{error}</div>}
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input {...clientForm.register("firstName")} />
                      {clientForm.formState.errors.firstName && <p className="text-xs text-danger">{clientForm.formState.errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Apellido</Label>
                      <Input {...clientForm.register("lastName")} />
                      {clientForm.formState.errors.lastName && <p className="text-xs text-danger">{clientForm.formState.errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Correo Electrónico</Label>
                      <Input type="email" {...clientForm.register("email")} />
                      {clientForm.formState.errors.email && <p className="text-xs text-danger">{clientForm.formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Contraseña</Label>
                      <Input type="password" {...clientForm.register("password")} />
                      {clientForm.formState.errors.password && <p className="text-xs text-danger">{clientForm.formState.errors.password.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>País</Label>
                      <Input {...clientForm.register("country")} />
                      {clientForm.formState.errors.country && <p className="text-xs text-danger">{clientForm.formState.errors.country.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Ciudad</Label>
                      <Input {...clientForm.register("city")} />
                      {clientForm.formState.errors.city && <p className="text-xs text-danger">{clientForm.formState.errors.city.message}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms-client" 
                      onCheckedChange={(checked) => clientForm.setValue("terms", checked === true)} 
                    />
                    <label htmlFor="terms-client" className="text-sm text-steel leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Acepto los <Link href="/terms" className="text-accent underline">términos y condiciones</Link>
                    </label>
                  </div>
                  {clientForm.formState.errors.terms && <p className="text-xs text-danger">{clientForm.formState.errors.terms.message}</p>}

                  <Button type="submit" className="w-full bg-primary font-bold h-12" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "CREAR CUENTA"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card className="border-none shadow-xl bg-white dark:bg-primary/5">
              <CardHeader>
                <CardTitle className="font-barlow">Registro Empresarial</CardTitle>
                <CardDescription>Publica tu inventario, gestiona cotizaciones y accede a reportes avanzados.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-8">
                  {error && <div className="p-3 bg-danger/10 border border-danger/20 text-danger text-sm rounded-md">{error}</div>}
                  
                  {/* Seccion Administrador */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-steel uppercase tracking-wider">Datos del Administrador</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre</Label>
                        <Input {...companyForm.register("firstName")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Apellido</Label>
                        <Input {...companyForm.register("lastName")} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Correo Corporativo</Label>
                        <Input type="email" {...companyForm.register("email")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Contraseña</Label>
                        <Input type="password" {...companyForm.register("password")} />
                      </div>
                    </div>
                  </div>

                  {/* Seccion Empresa */}
                  <div className="space-y-4 pt-4 border-t border-steel/10">
                    <h3 className="text-sm font-bold text-steel uppercase tracking-wider">Datos de la Empresa</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre de la Empresa</Label>
                        <Input {...companyForm.register("companyName")} />
                      </div>
                      <div className="space-y-2">
                        <Label>NIT / RUT / Tax ID</Label>
                        <Input {...companyForm.register("taxId")} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Teléfono de Contacto</Label>
                        <Input {...companyForm.register("phone")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Sitio Web (Opcional)</Label>
                        <Input {...companyForm.register("website")} />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>País</Label>
                        <Input {...companyForm.register("country")} />
                      </div>
                      <div className="space-y-2">
                        <Label>Ciudad</Label>
                        <Input {...companyForm.register("city")} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Dirección Física</Label>
                      <Input {...companyForm.register("address")} />
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción de Actividad</Label>
                      <Input {...companyForm.register("description")} placeholder="Ej: Venta de maquinaria amarilla y repuestos." />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms-company" 
                      onCheckedChange={(checked) => companyForm.setValue("terms", checked === true)} 
                    />
                    <label htmlFor="terms-company" className="text-sm text-steel leading-none">
                      Acepto los <Link href="/terms" className="text-accent underline">términos y condiciones</Link>
                    </label>
                  </div>

                  <Button type="submit" className="w-full bg-primary font-bold h-12" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "REGISTRAR EMPRESA"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <p className="text-center mt-8 text-steel">
          ¿Ya tienes una cuenta? <Link href="/auth/login" className="text-accent font-bold hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
