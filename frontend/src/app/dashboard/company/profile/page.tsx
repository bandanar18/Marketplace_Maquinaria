"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyService } from "@/services/company.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Camera, 
  Save, 
  ShieldCheck, 
  Loader2,
  ExternalLink,
  ChevronRight,
  Image as ImageIcon,
  Clock,
  Share2,
  Map as MapIcon,
  Info,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function CompanyProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("info");

  const { data: company, isLoading } = useQuery({
    queryKey: ['my-company-profile'],
    queryFn: () => companyService.getMyCompany(),
    enabled: !!user,
  });

  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    website: "",
    phone: "",
    email: "",
    taxId: "",
    address: "",
    city: "",
    country: "",
    logoUrl: "",
    coverUrl: "",
    openingHours: {},
    socialMedia: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: ""
    },
    gallery: []
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        description: company.description || "",
        website: company.website || "",
        phone: company.phone || "",
        email: company.email || "",
        taxId: company.taxId || "",
        address: company.address || "",
        city: company.city || "",
        country: company.country || "",
        logoUrl: company.logoUrl || "",
        coverUrl: company.coverUrl || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200",
        openingHours: company.openingHours || {},
        socialMedia: company.socialMedia || {
          facebook: "",
          instagram: "",
          linkedin: "",
          twitter: ""
        },
        gallery: company.images?.map((img: any) => img.url) || []
      });
    }
  }, [company]);

  const handleSocialChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const updateMutation = useMutation({
    mutationFn: (data: any) => companyService.updateMyCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-company'] });
      toast.success("Perfil actualizado correctamente");
    },
    onError: (error: any) => {
      console.error("Error updating company:", error);
      const message = error.response?.data?.message || "Error al actualizar el perfil";
      toast.error(message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-[#D32323] animate-spin" />
        <p className="text-sm font-medium text-[#5C6370]">Cargando tu perfil de negocio...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Google Business Profile Header */}
      <div className="relative rounded-2xl overflow-hidden border border-[#EBEBEB] bg-white shadow-sm">
        {/* Cover Photo */}
        <div className="h-48 md:h-64 bg-gray-200 relative group">
           <Image 
              src={formData.coverUrl || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200"} 
              alt="Cover" 
              fill 
              className="object-cover"
           />
           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
           <Button variant="secondary" size="sm" className="absolute bottom-4 right-4 bg-white/90 backdrop-blur font-bold text-xs">
              <Camera className="w-3 h-3 mr-2" /> CAMBIAR PORTADA
           </Button>
        </div>
        
        {/* Profile Info Bar */}
        <div className="px-8 pb-8 pt-0 relative">
           <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12 md:-mt-16">
              {/* Logo Container */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden relative group">
                 {formData.logoUrl ? (
                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                 ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                       <Building2 size={48} />
                    </div>
                 )}
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white w-8 h-8" />
                 </div>
              </div>

              {/* Name and Status */}
              <div className="flex-1 space-y-1">
                 <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-black text-[#1C2B3A]">{formData.name || "Nombre de tu Empresa"}</h1>
                    <Badge className="bg-[#27AE60] text-white hover:bg-[#27AE60] font-black text-[10px] py-1">VERIFICADA</Badge>
                 </div>
                 <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-[#5C6370]">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#D32323]" /> {formData.city}, {formData.country}</span>
                    <span className="flex items-center gap-1.5"><Globe size={14} className="text-[#0073BB]" /> {formData.website || "Sin sitio web"}</span>
                    <span className="flex items-center gap-1.5 text-[#27AE60]"><Clock size={14} /> Abierto ahora</span>
                 </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                 <Button variant="outline" className="font-bold border-[#EBEBEB] text-[#5C6370]">
                    <Share2 className="w-4 h-4 mr-2" /> COMPARTIR
                 </Button>
                 <Link href={`/company/${company?.slug}`} target="_blank">
                    <Button className="bg-[#D32323] hover:bg-[#A61A1A] text-white font-bold px-6">
                       VER PERFIL PÚBLICO
                    </Button>
                 </Link>
              </div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          <Tabs defaultValue="info" onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b border-[#EBEBEB] w-full justify-start rounded-none h-12 p-0 gap-8">
              <TabsTrigger 
                value="info" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#D32323] data-[state=active]:bg-transparent data-[state=active]:text-[#1C2B3A] font-bold text-sm h-full px-2"
              >
                Información
              </TabsTrigger>
              <TabsTrigger 
                value="location" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#D32323] data-[state=active]:bg-transparent data-[state=active]:text-[#1C2B3A] font-bold text-sm h-full px-2"
              >
                Ubicación
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#D32323] data-[state=active]:bg-transparent data-[state=active]:text-[#1C2B3A] font-bold text-sm h-full px-2"
              >
                Multimedia
              </TabsTrigger>
              <TabsTrigger 
                value="hours" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#D32323] data-[state=active]:bg-transparent data-[state=active]:text-[#1C2B3A] font-bold text-sm h-full px-2"
              >
                Horarios
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="info" className="pt-6 space-y-6">
                <Card className="border-[#EBEBEB] shadow-sm">
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-[#9099A6]">Nombre Comercial</Label>
                        <Input name="name" value={formData.name} onChange={handleChange} className="border-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-[#9099A6]">RIF / Identificación Fiscal</Label>
                        <Input name="taxId" value={formData.taxId} onChange={handleChange} className="border-gray-200" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-[#9099A6]">Descripción del Negocio</Label>
                      <Textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        rows={5}
                        className="border-gray-200 resize-none"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-[#9099A6]">Sitio Web</Label>
                        <Input name="website" value={formData.website} onChange={handleChange} className="border-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-[#9099A6]">Email Público</Label>
                        <Input name="email" value={formData.email} onChange={handleChange} className="border-gray-200" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                       <Label className="text-xs font-black uppercase text-[#9099A6] mb-4 block">Redes Sociales</Label>
                       <div className="grid md:grid-cols-2 gap-4">
                          <div className="relative">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">FB</span>
                             <Input 
                                placeholder="URL de Facebook" 
                                className="pl-10 text-xs border-gray-200" 
                                value={formData.socialMedia.facebook}
                                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                             />
                          </div>
                          <div className="relative">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">IG</span>
                             <Input 
                                placeholder="URL de Instagram" 
                                className="pl-10 text-xs border-gray-200" 
                                value={formData.socialMedia.instagram}
                                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                             />
                          </div>
                          <div className="relative">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">LI</span>
                             <Input 
                                placeholder="URL de LinkedIn" 
                                className="pl-10 text-xs border-gray-200" 
                                value={formData.socialMedia.linkedin}
                                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                             />
                          </div>
                          <div className="relative">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">X</span>
                             <Input 
                                placeholder="URL de X (Twitter)" 
                                className="pl-10 text-xs border-gray-200" 
                                value={formData.socialMedia.twitter}
                                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                             />
                          </div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="pt-6 space-y-6">
                <Card className="border-[#EBEBEB] shadow-sm">
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase text-[#9099A6]">Dirección Completa</Label>
                      <Input name="address" value={formData.address} onChange={handleChange} className="border-gray-200" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-[#9099A6]">Ciudad</Label>
                        <Input name="city" value={formData.city} onChange={handleChange} className="border-gray-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-[#9099A6]">País</Label>
                        <Input name="country" value={formData.country} onChange={handleChange} className="border-gray-200" />
                      </div>
                    </div>
                    
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-[#EBEBEB] relative overflow-hidden group">
                       <MapIcon className="w-12 h-12 text-gray-300 group-hover:scale-110 transition-transform" />
                       <div className="absolute inset-0 bg-black/5" />
                       <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button className="bg-[#1C2B3A] text-white font-bold">
                             ABRIR SELECTOR DE UBICACIÓN
                          </Button>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hours" className="pt-6 space-y-6">
                 <Card className="border-[#EBEBEB] shadow-sm">
                    <CardContent className="pt-6 space-y-4">
                       {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => (
                          <div key={day} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                             <span className="font-bold text-sm text-[#1C2B3A] w-24">{day}</span>
                             <div className="flex items-center gap-4">
                                <Input type="time" defaultValue="08:00" className="w-32 text-xs border-gray-200" />
                                <span className="text-xs text-gray-400 font-bold">A</span>
                                <Input type="time" defaultValue="18:00" className="w-32 text-xs border-gray-200" />
                                <div className="flex items-center gap-2 ml-4">
                                   <input type="checkbox" defaultChecked className="accent-[#D32323]" />
                                   <span className="text-[10px] font-bold text-[#9099A6] uppercase">Abierto</span>
                                </div>
                             </div>
                          </div>
                       ))}
                    </CardContent>
                 </Card>
              </TabsContent>

              <TabsContent value="media" className="pt-6 space-y-6">
                 <Card className="border-[#EBEBEB] shadow-sm">
                    <CardContent className="pt-6 space-y-10">
                       {/* Logo Management */}
                       <div className="space-y-4">
                          <Label className="text-xs font-black uppercase text-[#9099A6]">Logo de la Empresa</Label>
                          <div className="flex flex-col md:flex-row gap-8 items-start">
                             <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-[#EBEBEB] bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 relative group">
                                {formData.logoUrl ? (
                                   <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                                ) : (
                                   <ImageIcon className="w-8 h-8 text-gray-300" />
                                )}
                             </div>
                             <div className="flex-1 space-y-4 w-full">
                                <div className="flex flex-wrap gap-3">
                                   <Button type="button" variant="outline" className="font-bold border-[#EBEBEB] bg-white">
                                      <Camera className="w-4 h-4 mr-2" /> SUBIR ARCHIVO
                                   </Button>
                                   <Button type="button" variant="ghost" className="text-[#D32323] font-bold hover:bg-red-50">
                                      ELIMINAR
                                   </Button>
                                </div>
                                <div className="space-y-2">
                                   <Label className="text-[10px] font-black text-[#9099A6]">O PEGAR URL EXTERNA</Label>
                                   <Input 
                                      name="logoUrl" 
                                      value={formData.logoUrl} 
                                      onChange={handleChange} 
                                      placeholder="https://ejemplo.com/mi-logo.png" 
                                      className="border-gray-200 text-xs"
                                   />
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="h-px bg-gray-100" />

                       {/* Cover Management */}
                       <div className="space-y-4">
                          <Label className="text-xs font-black uppercase text-[#9099A6]">Foto de Portada (Banner)</Label>
                          <div className="space-y-4">
                             <div className="w-full h-40 rounded-xl border-2 border-dashed border-[#EBEBEB] bg-gray-50 flex items-center justify-center overflow-hidden relative group">
                                {formData.coverUrl ? (
                                   <img src={formData.coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                                ) : (
                                   <ImageIcon className="w-8 h-8 text-gray-300" />
                                )}
                             </div>
                             <div className="flex flex-col md:flex-row gap-6 items-end">
                                <div className="flex-1 space-y-2 w-full">
                                   <Label className="text-[10px] font-black text-[#9099A6]">PEGAR URL DE PORTADA</Label>
                                   <Input 
                                      name="coverUrl" 
                                      value={formData.coverUrl} 
                                      onChange={handleChange} 
                                      placeholder="https://ejemplo.com/mi-portada.jpg" 
                                      className="border-gray-200 text-xs"
                                   />
                                </div>
                                <Button type="button" variant="outline" className="font-bold border-[#EBEBEB] bg-white h-10 px-6">
                                   <Camera className="w-4 h-4 mr-2" /> SUBIR FOTO
                                </Button>
                             </div>
                          </div>
                       </div>
                       
                       {/* Gallery Management */}
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <div>
                                <Label className="text-xs font-black uppercase text-[#9099A6]">Galería de Instalaciones</Label>
                                <p className="text-[10px] text-[#9099A6] font-bold">Muestra tus oficinas, galpones o equipo de trabajo (Máx. 10 fotos)</p>
                             </div>
                             <Badge variant="outline" className="text-[10px] font-bold border-[#EBEBEB]">
                                {formData.gallery?.length || 0} / 10
                             </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                             {formData.gallery?.map((img: string, idx: number) => (
                                <div key={idx} className="aspect-square rounded-xl border border-[#EBEBEB] overflow-hidden relative group bg-gray-50">
                                   <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                   <button 
                                      type="button"
                                      onClick={() => {
                                         const newGallery = [...formData.gallery];
                                         newGallery.splice(idx, 1);
                                         setFormData(prev => ({ ...prev, gallery: newGallery }));
                                      }}
                                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                   >
                                      <span className="bg-white text-[#D32323] text-[10px] font-black px-2 py-1 rounded">ELIMINAR</span>
                                   </button>
                                </div>
                             ))}
                             
                             {(formData.gallery?.length || 0) < 10 && (
                                <div className="aspect-square rounded-xl border-2 border-dashed border-[#EBEBEB] bg-gray-50 flex flex-col items-center justify-center gap-2 p-4 text-center">
                                   <ImageIcon className="w-6 h-6 text-gray-300" />
                                   <p className="text-[9px] font-black text-[#9099A6] uppercase">Añadir Foto</p>
                                </div>
                             )}
                          </div>

                          <div className="flex gap-2">
                             <Input 
                                id="newGalleryUrl"
                                placeholder="Pegar URL de nueva foto para la galería..." 
                                className="border-gray-200 text-xs flex-1"
                                onKeyDown={(e) => {
                                   if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const url = (e.target as HTMLInputElement).value;
                                      if (url && (formData.gallery?.length || 0) < 10) {
                                         setFormData(prev => ({ 
                                            ...prev, 
                                            gallery: [...(prev.gallery || []), url] 
                                         }));
                                         (e.target as HTMLInputElement).value = '';
                                      }
                                   }
                                }}
                             />
                             <Button 
                                type="button"
                                onClick={() => {
                                   const input = document.getElementById('newGalleryUrl') as HTMLInputElement;
                                   const url = input.value;
                                   if (url && (formData.gallery?.length || 0) < 10) {
                                      setFormData(prev => ({ 
                                         ...prev, 
                                         gallery: [...(prev.gallery || []), url] 
                                      }));
                                      input.value = '';
                                   }
                                }}
                                className="bg-[#1C2B3A] text-white font-bold h-10 px-4 text-xs"
                             >
                                AÑADIR
                             </Button>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </TabsContent>

              <div className="pt-6 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                  className="bg-[#D32323] hover:bg-[#A61A1A] text-white font-bold h-14 px-10 shadow-lg"
                >
                  {updateMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> GUARDANDO...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> GUARDAR CAMBIOS</>
                  )}
                </Button>
              </div>
            </form>
          </Tabs>
        </div>

        {/* Sidebar: Search Preview */}
        <div className="space-y-6">
           <div className="sticky top-24">
              <h3 className="text-xs font-black uppercase text-[#9099A6] mb-4 flex items-center gap-2">
                 <Eye className="w-4 h-4" /> Vista Previa en Búsqueda
              </h3>
              
              <Card className="border-[#EBEBEB] shadow-xl overflow-hidden bg-white max-w-[320px] mx-auto">
                 <div className="h-32 bg-gray-200 relative">
                    <Image 
                       src={formData.coverUrl || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200"} 
                       alt="Preview" 
                       fill 
                       className="object-cover"
                    />
                 </div>
                 <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                       <div className="flex-1">
                          <h4 className="font-black text-lg text-[#1C2B3A] leading-tight line-clamp-2">{formData.name || "Nombre de tu Empresa"}</h4>
                          <div className="flex items-center gap-1 text-[#F1C40F] mt-1">
                             {[1,2,3,4,5].map(i => <ShieldCheck key={i} size={10} className="fill-current" />)}
                             <span className="text-[9px] font-bold text-[#5C6370] ml-1">5.0 (24)</span>
                          </div>
                       </div>
                       <div className="w-10 h-10 rounded border border-[#EBEBEB] bg-white shrink-0 overflow-hidden shadow-sm">
                          <img src={formData.logoUrl || ""} alt="Logo" className="w-full h-full object-contain" />
                       </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-gray-50">
                       <p className="text-[11px] text-[#5C6370] flex items-center gap-2">
                          <MapPin size={12} className="text-[#D32323]" /> {formData.city}, {formData.country}
                       </p>
                       <p className="text-[11px] text-[#27AE60] flex items-center gap-2 font-bold">
                          <Clock size={12} /> Abierto ⋅ Cierra a las 18:00
                       </p>
                       <p className="text-[11px] text-[#5C6370] flex items-center gap-2">
                          <Phone size={12} className="text-gray-400" /> {formData.phone || "Sin teléfono"}
                       </p>
                    </div>

                    {/* Social Icons Preview */}
                    <div className="flex gap-2 pt-1">
                       {["facebook", "instagram", "linkedin", "twitter"].map((social) => (
                          <div key={social} className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                             {social === "facebook" && <span className="text-[10px] font-black">f</span>}
                             {social === "instagram" && <span className="text-[10px] font-black">ig</span>}
                             {social === "linkedin" && <span className="text-[10px] font-black">in</span>}
                             {social === "twitter" && <span className="text-[10px] font-black">x</span>}
                          </div>
                       ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                       <Button variant="outline" size="sm" className="h-8 text-[10px] font-black border-[#EBEBEB] text-[#1C2B3A]">LLAMAR</Button>
                       <Button variant="outline" size="sm" className="h-8 text-[10px] font-black border-[#EBEBEB] text-[#1C2B3A]">DIRECCIÓN</Button>
                    </div>
                 </CardContent>
              </Card>

              <div className="mt-8 p-6 bg-[#FDF2F2] rounded-xl border border-[#D32323]/10 space-y-3">
                 <div className="flex items-center gap-2 text-[#D32323]">
                    <Info size={16} />
                    <span className="text-xs font-black uppercase tracking-wider">Consejo Pro</span>
                 </div>
                 <p className="text-xs text-[#5C6370] font-medium leading-relaxed">
                    Las empresas con perfil completo y fotos reales reciben hasta un <span className="font-bold text-[#D32323]">45% más de clics</span> que las que no tienen.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
