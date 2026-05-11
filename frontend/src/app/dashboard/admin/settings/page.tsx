"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settings.service";
import { 
  Settings, 
  Save, 
  Mail, 
  Phone, 
  Globe, 
  ThumbsUp, 
  Camera, 
  MessageCircle, 
  Search, 
  Info,
  Loader2,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-global-settings'],
    queryFn: () => settingsService.getSettings(),
  });

  useEffect(() => {
    if (settings) {
      setFormValues(settings);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: (data: Record<string, string>) => settingsService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-global-settings'] });
      toast.success("Configuración global actualizada");
    },
    onError: () => {
      toast.error("Error al guardar la configuración");
    }
  });

  const handleInputChange = (key: string, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    mutation.mutate(formValues);
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#D32323]" />
        <p className="text-sm font-bold text-[#5C6370] uppercase tracking-widest">Cargando configuración...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#2D2E2F] tracking-tight flex items-center gap-2 uppercase">
            <Settings className="w-6 h-6 text-[#D32323]" /> Configuración del Sitio
          </h1>
          <p className="text-sm text-[#5C6370]">Gestiona los datos de contacto, redes sociales y SEO global.</p>
        </div>
        <Button 
          className="bg-[#D32323] hover:bg-[#A61A1A] font-bold shadow-lg" 
          onClick={handleSave}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          GUARDAR CAMBIOS
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-white border border-[#EBEBEB] p-1 h-12 shadow-sm mb-6">
          <TabsTrigger value="general" className="px-6 font-bold data-[state=active]:bg-gray-100 data-[state=active]:text-[#D32323]">GENERAL</TabsTrigger>
          <TabsTrigger value="social" className="px-6 font-bold data-[state=active]:bg-gray-100 data-[state=active]:text-[#D32323]">REDES SOCIALES</TabsTrigger>
          <TabsTrigger value="seo" className="px-6 font-bold data-[state=active]:bg-gray-100 data-[state=active]:text-[#D32323]">SEO & METADATA</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-[#EBEBEB] shadow-sm">
              <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#D32323]" /> Contacto Principal
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[#9099A6]">Email de Soporte</Label>
                  <Input 
                    placeholder="soporte@maquinaria.com" 
                    value={formValues.contactEmail || ""}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="border-[#EBEBEB] focus:ring-[#D32323]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[#9099A6]">Teléfono de Contacto</Label>
                  <Input 
                    placeholder="+58 412 0000000" 
                    value={formValues.contactPhone || ""}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="border-[#EBEBEB] focus:ring-[#D32323]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#EBEBEB] shadow-sm">
              <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#D32323]" /> Información del Footer
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[#9099A6]">Texto de Copyright</Label>
                  <Input 
                    placeholder="© 2026 Maquinaria Marketplace. Todos los derechos reservados." 
                    value={formValues.footerCopyright || ""}
                    onChange={(e) => handleInputChange('footerCopyright', e.target.value)}
                    className="border-[#EBEBEB] focus:ring-[#D32323]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[#9099A6]">Dirección Física</Label>
                  <Input 
                    placeholder="Av. Francisco de Miranda, Caracas, Venezuela" 
                    value={formValues.officeAddress || ""}
                    onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                    className="border-[#EBEBEB] focus:ring-[#D32323]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card className="border-[#EBEBEB] shadow-sm max-w-2xl">
             <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#D32323]" /> Enlaces Externos
                </CardTitle>
                <CardDescription>Configura los links que aparecerán en los iconos de redes sociales.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                 <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded bg-[#1877F2]/10 flex items-center justify-center shrink-0">
                           <ThumbsUp className="w-5 h-5 text-[#1877F2]" />
                       </div>
                       <Input 
                        placeholder="https://facebook.com/..." 
                        value={formValues.socialFacebook || ""}
                        onChange={(e) => handleInputChange('socialFacebook', e.target.value)}
                        className="border-[#EBEBEB]"
                       />
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded bg-[#E4405F]/10 flex items-center justify-center shrink-0">
                           <Camera className="w-5 h-5 text-[#E4405F]" />
                       </div>
                       <Input 
                        placeholder="https://instagram.com/..." 
                        value={formValues.socialInstagram || ""}
                        onChange={(e) => handleInputChange('socialInstagram', e.target.value)}
                        className="border-[#EBEBEB]"
                       />
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded bg-[#1DA1F2]/10 flex items-center justify-center shrink-0">
                           <MessageCircle className="w-5 h-5 text-[#1DA1F2]" />
                       </div>
                       <Input 
                        placeholder="https://twitter.com/..." 
                        value={formValues.socialTwitter || ""}
                        onChange={(e) => handleInputChange('socialTwitter', e.target.value)}
                        className="border-[#EBEBEB]"
                       />
                    </div>
                 </div>
              </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card className="border-[#EBEBEB] shadow-sm max-w-2xl">
             <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#D32323]" /> Optimización para Buscadores
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[#9099A6]">Título del Sitio (Home)</Label>
                  <Input 
                    placeholder="Maquinaria Marketplace | Compra y Alquiler de Equipos Pesados" 
                    value={formValues.seoTitle || ""}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    className="border-[#EBEBEB]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-[#9099A6]">Meta Descripción</Label>
                  <Textarea 
                    placeholder="La plataforma líder en Venezuela para la comercialización de maquinaria pesada..." 
                    value={formValues.seoDescription || ""}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    className="border-[#EBEBEB] h-32"
                  />
                </div>
              </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
