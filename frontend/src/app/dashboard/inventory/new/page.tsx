"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products.service";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Loader2, 
  Plus, 
  X, 
  Upload,
  Info,
  MapPin
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/map-picker"), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-steel">Cargando Mapa...</div>
});

const productSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  price: z.number().min(0, "El precio es requerido"),
  brand: z.string().min(1, "La marca es requerida"),
  model: z.string().min(1, "El modelo es requerido"),
  year: z.number().min(1900).max(new Date().getFullYear()),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),
  categoryId: z.string().min(1, "La categoría es requerida"),
  city: z.string().min(2, "La ciudad es requerida"),
  country: z.string().min(2, "El país es requerido"),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  availability: z.enum(["IN_STOCK", "ON_ORDER", "QUOTE_ONLY"]),
  transactionType: z.enum(["SALE", "RENTAL", "BOTH"]),
  pricePerDay: z.number().optional(),
  pricePerWeek: z.number().optional(),
  pricePerMonth: z.number().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([""]); // URLs simple
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([{ label: "", value: "" }]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsService.getCategories(),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { 
      condition: "USED", 
      country: "Colombia", 
      availability: "IN_STOCK",
      transactionType: "SALE",
      price: 0
    }
  });

  const transactionType = watch("transactionType");

  const onSubmit = async (data: ProductFormValues) => {
    setIsPending(true);
    setError(null);
    
    // Convert specs array to object
    const specsObject = specs.reduce((acc, spec) => {
      if (spec.label.trim() && spec.value.trim()) {
        acc[spec.label.trim()] = spec.value.trim();
      }
      return acc;
    }, {} as Record<string, string>);

    try {
      const response = await api.post('/products', {
        ...data,
        images: images.filter(url => url.trim() !== ""),
        specs: specsObject
      });
      router.push("/dashboard/inventory");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al publicar el producto.");
    } finally {
      setIsPending(false);
    }
  };

  const addImageField = () => setImages([...images, ""]);
  const removeImageField = (index: number) => setImages(images.filter((_, i) => i !== index));
  const updateImageField = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    setImages(newImages);
  };

  const addSpecField = () => setSpecs([...specs, { label: "", value: "" }]);
  const removeSpecField = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const updateSpecField = (index: number, field: 'label' | 'value', value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/dashboard/inventory" className="inline-flex items-center text-sm font-bold text-steel hover:text-[#D32323] transition-colors mb-2 uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Inventario
          </Link>
          <h1 className="text-4xl font-barlow font-black text-[#2D2E2F] tracking-tight">PUBLICAR NUEVO EQUIPO</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="border-[#EBEBEB] font-bold">DESCARTAR</Button>
          <Button onClick={handleSubmit(onSubmit)} className="bg-[#D32323] text-white font-bold hover:bg-[#A61A1A] px-10 h-12 shadow-lg shadow-red-500/20" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "PUBLICAR AHORA"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {error && <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl flex items-center gap-3">
          <Info className="w-5 h-5" /> {error}
        </div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* General Info */}
            <Card className="border-steel/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#2D2E2F]">Información General</CardTitle>
                <CardDescription>Detalles principales de la maquinaria.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Título del Anuncio</Label>
                  <Input placeholder="Ej: Excavadora Caterpillar 320D 2018" {...register("title")} className="border-[#EBEBEB] focus:border-[#D32323]" />
                  {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Descripción Detallada</Label>
                  <Textarea placeholder="Describe el estado técnico, horas de uso, mantenimiento..." className="h-40 border-[#EBEBEB] focus:border-[#D32323]" {...register("description")} />
                  {errors.description && <p className="text-xs text-danger">{errors.description.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label>Marca</Label>
                      <Input placeholder="Ej: Caterpillar" {...register("brand")} className="border-[#EBEBEB] focus:border-[#D32323]" />
                   </div>
                   <div className="space-y-2">
                      <Label>Modelo</Label>
                      <Input placeholder="Ej: 320D" {...register("model")} className="border-[#EBEBEB] focus:border-[#D32323]" />
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Specs */}
            <Card className="border-steel/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#2D2E2F]">Especificaciones Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Año de Fabricación</Label>
                  <Input type="number" {...register("year", { valueAsNumber: true })} className="border-[#EBEBEB] focus:border-[#D32323]" />
                </div>
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <select 
                    {...register("categoryId")}
                    className="w-full h-10 px-3 rounded-md border border-[#EBEBEB] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#D32323]"
                  >
                    <option value="">Seleccionar categoría...</option>
                    {categories?.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Condición</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" value="NEW" {...register("condition")} className="accent-[#D32323]" />
                      <span className="text-sm">Nueva</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" value="USED" {...register("condition")} className="accent-[#D32323]" />
                      <span className="text-sm">Usada</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" value="REFURBISHED" {...register("condition")} className="accent-[#D32323]" />
                      <span className="text-sm">Reacondicionada</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Disponibilidad</Label>
                  <select 
                    {...register("availability")}
                    className="w-full h-10 px-3 rounded-md border border-[#EBEBEB] bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#D32323]"
                  >
                    <option value="IN_STOCK">En Stock</option>
                    <option value="ON_ORDER">Bajo Pedido</option>
                    <option value="QUOTE_ONLY">Consultar</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Custom Specs */}
            <Card className="border-steel/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#2D2E2F]">Especificaciones Adicionales</CardTitle>
                <CardDescription>Añade detalles específicos como HP, Peso, Capacidad, etc.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1 space-y-1">
                      <Input 
                        placeholder="Propiedad (ej: Motor)" 
                        value={spec.label}
                        onChange={(e) => updateSpecField(index, 'label', e.target.value)}
                        className="border-[#EBEBEB] focus:border-[#D32323]"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Input 
                        placeholder="Valor (ej: Cummins QSB6.7)" 
                        value={spec.value}
                        onChange={(e) => updateSpecField(index, 'value', e.target.value)}
                        className="border-[#EBEBEB] focus:border-[#D32323]"
                      />
                    </div>
                    {specs.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecField(index)} className="shrink-0">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" className="w-full text-xs font-bold border-[#EBEBEB] border-dashed py-6" onClick={addSpecField}>
                  <Plus className="w-4 h-4 mr-2" /> AÑADIR ESPECIFICACIÓN PERSONALIZADA
                </Button>
              </CardContent>
            </Card>

            {/* Transaction Type & Pricing */}
            <Card className="border-steel/10 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#2D2E2F]">Tipo de Transacción y Precios</CardTitle>
                <CardDescription>Define si el equipo es para venta, renta o ambos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Tipo de Transacción</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" value="SALE" {...register("transactionType")} className="accent-[#D32323]" />
                      <span className="text-sm font-medium">Venta</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" value="RENTAL" {...register("transactionType")} className="accent-[#D32323]" />
                      <span className="text-sm font-medium">Renta</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="radio" value="BOTH" {...register("transactionType")} className="accent-[#D32323]" />
                      <span className="text-sm font-medium">Ambos</span>
                    </label>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {(transactionType === "SALE" || transactionType === "BOTH") && (
                    <div className="space-y-2">
                      <Label>Precio de Venta (USD)</Label>
                      <Input type="number" {...register("price", { valueAsNumber: true })} className="border-[#EBEBEB] focus:border-[#D32323]" />
                      {errors.price && <p className="text-xs text-danger">{errors.price.message}</p>}
                    </div>
                  )}

                  {(transactionType === "RENTAL" || transactionType === "BOTH") && (
                    <div className="space-y-2">
                      <Label>Precio por Día (USD)</Label>
                      <Input type="number" {...register("pricePerDay", { valueAsNumber: true })} className="border-[#EBEBEB] focus:border-[#D32323]" />
                    </div>
                  )}

                  {(transactionType === "RENTAL" || transactionType === "BOTH") && (
                    <div className="space-y-2">
                      <Label>Precio por Semana (USD)</Label>
                      <Input type="number" {...register("pricePerWeek", { valueAsNumber: true })} className="border-[#EBEBEB] focus:border-[#D32323]" />
                    </div>
                  )}

                  {(transactionType === "RENTAL" || transactionType === "BOTH") && (
                    <div className="space-y-2">
                      <Label>Precio por Mes (USD)</Label>
                      <Input type="number" {...register("pricePerMonth", { valueAsNumber: true })} className="border-[#EBEBEB] focus:border-[#D32323]" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location with Map */}
            <Card className="border-steel/10 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-[#EBEBEB] bg-gray-50/50">
                <CardTitle className="text-lg font-bold text-[#2D2E2F] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#D32323]" /> Ubicación Física del Equipo
                </CardTitle>
                <CardDescription>Indica exactamente dónde se encuentra la maquinaria.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ciudad</Label>
                      <Input placeholder="Ej: Bogotá" {...register("city")} className="border-[#EBEBEB] focus:border-[#D32323]" />
                    </div>
                    <div className="space-y-2">
                      <Label>País</Label>
                      <Input placeholder="Ej: Colombia" {...register("country")} className="border-[#EBEBEB] focus:border-[#D32323]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Dirección o Referencia</Label>
                    <Input placeholder="Ej: Av. Industrial 123 o Parque Industrial Norte" {...register("address")} className="border-[#EBEBEB] focus:border-[#D32323]" />
                  </div>

                  <div className="space-y-3">
                    <Label className="flex justify-between items-center">
                      <span>Seleccionar en el mapa</span>
                      <span className="text-[10px] font-bold text-[#D32323] uppercase">Haz clic para marcar la ubicación</span>
                    </Label>
                    <MapPicker 
                      onChange={(lat, lng) => {
                        setValue("latitude", lat);
                        setValue("longitude", lng);
                      }}
                    />
                    <div className="flex gap-4 text-[10px] font-mono text-[#5C6370] bg-gray-50 p-2 rounded border border-[#EBEBEB]">
                      <span>LAT: {watch("latitude")?.toFixed(6) || "---"}</span>
                      <span>LNG: {watch("longitude")?.toFixed(6) || "---"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Images & Metadata (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-steel/10 shadow-sm sticky top-8">
              <CardHeader className="bg-gray-50/50 border-b border-[#EBEBEB]">
                <CardTitle className="text-lg font-bold text-[#2D2E2F] flex items-center justify-between">
                  <div className="flex items-center">
                    <Upload className="w-4 h-4 mr-2" /> Galería de Imágenes
                  </div>
                  <span className="text-[10px] bg-[#D32323] text-white px-2 py-0.5 rounded-full font-bold">REQUERIDO</span>
                </CardTitle>
                <CardDescription>Sube las mejores fotos de tu equipo.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {images.map((url, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="https://url-de-la-imagen.jpg" 
                        value={url} 
                        onChange={(e) => updateImageField(index, e.target.value)}
                        className="border-[#EBEBEB] focus:border-[#D32323] text-xs"
                      />
                      {images.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeImageField(index)} className="hover:bg-red-50 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {url && (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-[#EBEBEB] bg-gray-50 group">
                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="text-white text-[10px] font-bold">VISTA PREVIA</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" className="w-full text-xs font-black border-[#EBEBEB] border-dashed py-8 hover:bg-gray-50 flex flex-col gap-2" onClick={addImageField}>
                  <Plus className="w-5 h-5" /> AÑADIR OTRA IMAGEN
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#2D2E2F] text-white overflow-hidden">
               <CardContent className="p-6">
                  <div className="flex gap-3 mb-4">
                    <Info className="w-6 h-6 text-[#D32323] shrink-0" />
                    <h3 className="font-bold">Consejos para una venta rápida</h3>
                  </div>
                  <ul className="space-y-3 text-xs text-gray-300">
                    <li className="flex gap-2">
                      <span className="text-[#D32323] font-bold">•</span>
                      <span>Describe el historial de mantenimiento y horas reales.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#D32323] font-bold">•</span>
                      <span>Usa fotos de alta calidad y con buena iluminación.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#D32323] font-bold">•</span>
                      <span>Define un precio competitivo basado en el mercado actual.</span>
                    </li>
                  </ul>
                  <div className="mt-8 pt-6 border-t border-white/10">
                     <p className="text-[10px] text-gray-400 leading-relaxed italic">
                      Su publicación será revisada por nuestro equipo técnico antes de ser visible en el marketplace (máximo 24h).
                    </p>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
