"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { companyService } from "@/services/company.service";
import { 
  FileUp, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronLeft,
  Info,
  X,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function CompanyImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const res = await companyService.importInventory(text);
      setResults(res);
      if (res.success > 0) {
        toast.success(`${res.success} equipos importados con éxito`);
      }
      if (res.errors.length > 0) {
        toast.error(`Se encontraron ${res.errors.length} errores en el archivo`);
      }
    } catch (error) {
      toast.error("Error al procesar el archivo CSV");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = "title,category,brand,model,year,price,currency,condition,availability,description\n";
    const example = "Excavadora Caterpillar 320,Excavadoras,Caterpillar,320,2018,85000,USD,USED,IN_STOCK,En excelente estado operativo con solo 5000 horas.";
    const blob = new Blob([headers + example], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_inventario_maquinaria.csv';
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/inventory">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#2D2E2F] tracking-tight uppercase">Importación Masiva</h1>
          <p className="text-sm text-[#5C6370]">Carga tu inventario completo usando un archivo CSV.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-[#EBEBEB] shadow-sm bg-white">
            <CardContent className="pt-10 pb-10 flex flex-col items-center">
               <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6 border-2 border-dashed border-[#EBEBEB]">
                  <FileUp className="w-10 h-10 text-[#9099A6]" />
               </div>
               
               <h3 className="text-lg font-bold text-[#2D2E2F] mb-2">Selecciona tu archivo CSV</h3>
               <p className="text-sm text-[#5C6370] text-center max-w-xs mb-8">
                  El archivo debe seguir la estructura de nuestra plantilla oficial para ser procesado.
               </p>

               <div className="w-full max-w-sm">
                  <label className="block">
                     <span className="sr-only">Elegir archivo</span>
                     <input 
                      type="file" 
                      accept=".csv"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-[#5C6370]
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-[4px] file:border-0
                        file:text-sm file:font-bold
                        file:bg-[#F5F5F5] file:text-[#2D2E2F]
                        hover:file:bg-[#EBEBEB] cursor-pointer"
                     />
                  </label>
               </div>

               {file && (
                 <div className="mt-8 w-full max-w-sm p-4 bg-[#EAFAF1] border border-[#27AE60]/20 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <FileText className="w-5 h-5 text-[#27AE60]" />
                       <div className="overflow-hidden">
                          <p className="text-xs font-bold text-[#2D2E2F] truncate">{file.name}</p>
                          <p className="text-[10px] text-[#27AE60] font-medium">{(file.size / 1024).toFixed(1)} KB</p>
                       </div>
                    </div>
                    <button onClick={() => setFile(null)} className="p-1 hover:bg-white rounded-full transition-colors">
                       <X className="w-4 h-4 text-[#5C6370]" />
                    </button>
                 </div>
               )}

               <Button 
                className="mt-10 w-full max-w-sm bg-[#D32323] hover:bg-[#A61A1A] font-bold h-12 shadow-md"
                disabled={!file || isUploading}
                onClick={handleImport}
               >
                 {isUploading ? (
                   <> <Loader2 className="w-4 h-4 animate-spin mr-2" /> PROCESANDO ARCHIVO... </>
                 ) : (
                   "INICIAR IMPORTACIÓN"
                 )}
               </Button>
            </CardContent>
          </Card>

          {results && (
            <Card className="border-[#EBEBEB] shadow-sm bg-white overflow-hidden">
               <CardHeader className="bg-gray-50/50 border-b border-gray-50">
                  <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                     Resultado del Proceso
                  </CardTitle>
               </CardHeader>
               <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#EAFAF1] rounded-lg">
                     <CheckCircle2 className="w-6 h-6 text-[#27AE60]" />
                     <div>
                        <p className="text-sm font-bold text-[#2D2E2F]">{results.success} Equipos importados</p>
                        <p className="text-xs text-[#27AE60]">Los equipos están en estado "Pendiente de Revisión".</p>
                     </div>
                  </div>

                  {results.errors.length > 0 && (
                    <div className="space-y-3">
                       <div className="flex items-center gap-2 text-danger font-bold text-xs uppercase tracking-wider">
                          <AlertCircle className="w-4 h-4" /> Errores encontrados ({results.errors.length})
                       </div>
                       <div className="max-h-40 overflow-y-auto border border-red-50 rounded-lg bg-red-50/20 divide-y divide-red-50">
                          {results.errors.map((err: string, i: number) => (
                            <p key={i} className="p-2 text-[10px] text-[#D32323] font-medium">{err}</p>
                          ))}
                       </div>
                    </div>
                  )}

                  <Button variant="outline" className="w-full font-bold h-11" onClick={() => setResults(null)}>
                     CERRAR RESULTADOS
                  </Button>
               </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
           <Card className="border-[#EBEBEB] shadow-sm bg-white">
              <CardHeader>
                 <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#D32323]" /> Instrucciones
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-3">
                    <p className="text-xs text-[#5C6370] leading-relaxed">
                       Sigue estos pasos para una carga exitosa:
                    </p>
                    <ul className="space-y-2">
                       <li className="flex items-start gap-2 text-xs font-medium text-[#2D2E2F]">
                          <span className="w-4 h-4 rounded-full bg-[#D32323] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                          Descarga la plantilla CSV.
                       </li>
                       <li className="flex items-start gap-2 text-xs font-medium text-[#2D2E2F]">
                          <span className="w-4 h-4 rounded-full bg-[#D32323] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                          Completa los datos de tus equipos.
                       </li>
                       <li className="flex items-start gap-2 text-xs font-medium text-[#2D2E2F]">
                          <span className="w-4 h-4 rounded-full bg-[#D32323] text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                          Asegúrate de que las categorías coincidan exactamente.
                       </li>
                    </ul>
                 </div>

                 <Button 
                  onClick={downloadTemplate}
                  variant="outline" 
                  className="w-full font-bold border-[#EBEBEB] text-[#5C6370] hover:text-[#D32323]"
                 >
                    <Download className="w-4 h-4 mr-2" /> DESCARGAR PLANTILLA
                 </Button>

                 <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#0073BB] shrink-0" />
                    <p className="text-[10px] text-[#0073BB] leading-normal font-medium">
                       <strong>Nota:</strong> Las imágenes deben cargarse manualmente después de la importación editando cada equipo.
                    </p>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
