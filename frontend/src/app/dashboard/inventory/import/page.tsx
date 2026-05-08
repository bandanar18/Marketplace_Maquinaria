"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { companyService } from "@/services/company.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileUp, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  X,
  Info,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function InventoryImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<any | null>(null);

  const importMutation = useMutation({
    mutationFn: (csvData: string) => companyService.importInventory(csvData),
    onSuccess: (data) => {
      setResults(data);
      if (data.errors.length === 0) {
        toast.success(`¡Éxito! Se importaron ${data.success} equipos.`);
      } else {
        toast.warning(`Importación completada con ${data.errors.length} errores.`);
      }
    },
    onError: () => {
      toast.error("Error crítico durante la importación. Revisa el formato del archivo.");
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast.error("Por favor selecciona un archivo CSV válido.");
        return;
      }
      setFile(selectedFile);
      setResults(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      importMutation.mutate(text);
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const headers = "title,category,brand,model,year,price,currency,condition,availability,description\n";
    const example = "Excavadora Caterpillar 320,Excavadoras,Caterpillar,320,2022,150000,USD,USED,IN_STOCK,Excelente estado poco uso\n";
    const blob = new Blob([headers + example], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_inventario.csv";
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-[#9099A6] uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-[#D32323] transition-colors">Dashboard</Link>
            <ChevronRight size={14} />
            <Link href="/dashboard/inventory" className="hover:text-[#D32323] transition-colors">Inventario</Link>
            <ChevronRight size={14} />
            <span className="text-[#2D2E2F]">Importar</span>
          </div>
          <h1 className="text-3xl font-black text-[#2D2E2F] tracking-tight">Carga Masiva de Inventario</h1>
          <p className="text-[#5C6370] mt-1 font-medium">Sube múltiples equipos a la vez utilizando un archivo CSV.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-8">
          {results ? (
            <Card className="border-[#EBEBEB] shadow-sm overflow-hidden bg-white">
              <CardHeader className={results.errors.length > 0 ? "bg-amber-50" : "bg-emerald-50"}>
                <div className="flex items-center gap-3">
                  {results.errors.length === 0 ? (
                    <CheckCircle2 className="text-[#27AE60] w-6 h-6" />
                  ) : (
                    <AlertCircle className="text-amber-500 w-6 h-6" />
                  )}
                  <CardTitle className="text-lg font-bold">
                    Resultado de la Importación
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F5F5F5] rounded-lg text-center">
                    <p className="text-2xl font-black text-[#27AE60]">{results.success}</p>
                    <p className="text-[10px] font-bold text-[#9099A6] uppercase">Éxitos</p>
                  </div>
                  <div className="p-4 bg-[#F5F5F5] rounded-lg text-center">
                    <p className="text-2xl font-black text-[#D32323]">{results.errors.length}</p>
                    <p className="text-[10px] font-bold text-[#9099A6] uppercase">Errores</p>
                  </div>
                </div>

                {results.errors.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-[#2D2E2F]">Detalle de Errores:</h4>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 max-h-60 overflow-y-auto">
                      <ul className="space-y-2">
                        {results.errors.map((error: string, i: number) => (
                          <li key={i} className="text-xs text-red-600 flex gap-2">
                            <span className="font-bold">•</span> {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={() => setResults(null)} 
                    variant="outline" 
                    className="flex-1 font-bold border-[#EBEBEB]"
                  >
                    SUBIR OTRO ARCHIVO
                  </Button>
                  <Button 
                    onClick={() => router.push("/dashboard/inventory")} 
                    className="flex-1 bg-[#1C2B3A] hover:bg-[#2d4156] font-bold"
                  >
                    VER INVENTARIO
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-[#EBEBEB] shadow-sm overflow-hidden bg-white">
              <CardContent className="pt-10 pb-10 flex flex-col items-center justify-center border-2 border-dashed border-[#EBEBEB] m-6 rounded-xl hover:bg-gray-50 transition-colors group">
                <input 
                  type="file" 
                  id="csv-upload" 
                  accept=".csv" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                
                {file ? (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-[#FDF2F2] rounded-full flex items-center justify-center text-[#D32323] shadow-inner">
                      <FileText size={32} />
                    </div>
                    <div>
                      <p className="font-bold text-[#2D2E2F]">{file.name}</p>
                      <p className="text-xs text-[#9099A6]">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleUpload} 
                        disabled={importMutation.isPending}
                        className="bg-[#D32323] hover:bg-[#A61A1A] font-bold px-8"
                      >
                        {importMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> PROCESANDO...
                          </>
                        ) : (
                          <>
                            <FileUp className="w-4 h-4 mr-2" /> INICIAR CARGA
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setFile(null)}
                        className="text-gray-400 hover:text-[#D32323]"
                      >
                        <X size={20} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center text-center space-y-4 w-full h-full">
                    <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform">
                      <FileUp size={40} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-[#2D2E2F]">Arrastra tu archivo CSV aquí</p>
                      <p className="text-sm text-[#5C6370] font-medium">O haz clic para seleccionar desde tu equipo</p>
                    </div>
                    <div className="pt-4">
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#9099A6] px-3 py-1 bg-gray-100 rounded">SOLO ARCHIVOS .CSV</span>
                    </div>
                  </label>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="border-[#EBEBEB] bg-white shadow-sm overflow-hidden">
             <CardHeader className="bg-gray-50/50 border-b border-[#EBEBEB] py-4">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#9099A6] flex items-center gap-2">
                   <Info className="w-4 h-4 text-[#0073BB]" /> Instrucciones de Formato
                </CardTitle>
             </CardHeader>
             <CardContent className="pt-6">
                <div className="grid sm:grid-cols-2 gap-8 text-sm">
                   <div className="space-y-3">
                      <p className="font-bold text-[#2D2E2F]">Columnas Obligatorias:</p>
                      <ul className="space-y-2 text-[#5C6370]">
                         <li className="flex gap-2"><span className="text-[#D32323]">•</span> <strong>title:</strong> Nombre del equipo.</li>
                         <li className="flex gap-2"><span className="text-[#D32323]">•</span> <strong>category:</strong> Debe coincidir con las del sistema.</li>
                         <li className="flex gap-2"><span className="text-[#D32323]">•</span> <strong>price:</strong> Solo números (ej. 150000).</li>
                      </ul>
                   </div>
                   <div className="space-y-3">
                      <p className="font-bold text-[#2D2E2F]">Valores Permitidos:</p>
                      <ul className="space-y-2 text-[#5C6370]">
                         <li className="flex gap-2"><span className="text-[#D32323]">•</span> <strong>condition:</strong> NEW, USED, REFURBISHED.</li>
                         <li className="flex gap-2"><span className="text-[#D32323]">•</span> <strong>availability:</strong> IN_STOCK, ON_ORDER, SOLD.</li>
                      </ul>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <Card className="bg-[#1C2B3A] text-white border-none shadow-xl overflow-hidden relative">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#D32323] rounded-full opacity-10 blur-3xl" />
              <CardContent className="p-8 relative z-10 space-y-6">
                 <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-[#D32323]">
                    <Download size={24} />
                 </div>
                 <h3 className="text-xl font-bold tracking-tight">Descargar Plantilla</h3>
                 <p className="text-sm text-gray-300 leading-relaxed font-medium">
                    Utiliza nuestro archivo base para asegurarte de que los datos tengan el formato correcto antes de subirlos.
                 </p>
                 <Button 
                   onClick={downloadTemplate}
                   className="w-full bg-[#D32323] hover:bg-[#A61A1A] text-white font-bold h-12 shadow-lg"
                 >
                    DESCARGAR CSV
                 </Button>
              </CardContent>
           </Card>

           <div className="p-6 bg-[#FDF2F2] rounded-xl border border-[#D32323]/10">
              <div className="flex gap-4">
                 <AlertCircle className="text-[#D32323] shrink-0" size={20} />
                 <p className="text-xs text-[#D32323] font-bold leading-relaxed">
                    Los equipos cargados masivamente entrarán en estado de "Revisión Pendiente" hasta que sean validados por un administrador.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
