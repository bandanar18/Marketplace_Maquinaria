"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Globe, 
  MessageSquare, 
  Users,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SellPage() {
  return (
    <main className="min-h-screen bg-white font-sans text-[#2D2E2F] selection:bg-[#D32323]/10">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#F5F5F5] -z-10 rounded-l-[100px] hidden lg:block" />
        <div className="max-w-[1248px] mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#FDF2F2] text-[#D32323] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
              <Zap size={14} className="fill-current" /> La plataforma #1 del sector industrial
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-[#1C2B3A] leading-[1.1] tracking-tighter">
              Vende tu <span className="text-[#D32323]">maquinaria</span> a todo el país
            </h1>
            <p className="text-xl text-[#5C6370] leading-relaxed max-w-xl font-medium">
              Únete a la red más grande de distribuidores y llega a miles de compradores calificados cada mes. Gestiona tu inventario con herramientas profesionales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/auth/register?type=company">
                <Button className="bg-[#D32323] hover:bg-[#A61A1A] text-white font-bold h-16 px-10 rounded-[4px] text-lg shadow-xl shadow-red-500/20 active:scale-95 transition-all">
                  EMPEZAR AHORA <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" className="h-16 px-10 border-[#EBEBEB] text-[#1C2B3A] font-bold text-lg hover:bg-gray-50 bg-white">
                VER PLANES
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-6">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                       <Image src={`https://i.pravatar.cc/150?u=${i+10}`} alt="User" width={40} height={40} />
                    </div>
                  ))}
               </div>
               <p className="text-sm font-bold text-[#5C6370]">
                  <span className="text-[#1C2B3A]">+50 empresas</span> ya confían en nosotros
               </p>
            </div>
          </div>
          <div className="relative">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#D32323]/5 rounded-full blur-3xl" />
             <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <Image 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200" 
                  alt="Maquinaria Pesada" 
                  width={800} 
                  height={600}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C2B3A]/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur p-6 rounded-xl border border-white/50 shadow-2xl">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#27AE60] rounded-full flex items-center justify-center text-white shadow-lg">
                         <TrendingUp size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-[#9099A6] uppercase tracking-widest">Incremento en Ventas</p>
                         <p className="text-2xl font-black text-[#1C2B3A]">+35% este trimestre</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#1C2B3A] py-16">
        <div className="max-w-[1248px] mx-auto px-4">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                 <p className="text-4xl font-black text-white mb-2">15k+</p>
                 <p className="text-[#9099A6] text-xs font-bold uppercase tracking-widest">Visitas Mensuales</p>
              </div>
              <div>
                 <p className="text-4xl font-black text-[#D32323] mb-2">800+</p>
                 <p className="text-[#9099A6] text-xs font-bold uppercase tracking-widest">Equipos Vendidos</p>
              </div>
              <div>
                 <p className="text-4xl font-black text-white mb-2">24h</p>
                 <p className="text-[#9099A6] text-xs font-bold uppercase tracking-widest">Tiempo de Respuesta</p>
              </div>
              <div>
                 <p className="text-4xl font-black text-white mb-2">5.0</p>
                 <p className="text-[#9099A6] text-xs font-bold uppercase tracking-widest">Rating Promedio</p>
              </div>
           </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-white">
        <div className="max-w-[1248px] mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-[10px] font-black text-[#D32323] uppercase tracking-[0.3em]">Beneficios Exclusivos</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-[#1C2B3A] tracking-tight">Todo lo que necesitas para crecer</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <BenefitCard 
              icon={Target} 
              title="Audiencia Calificada" 
              description="Llega directamente a constructoras, ingenieros y empresas industriales que buscan exactamente lo que tú vendes."
            />
            <BenefitCard 
              icon={BarChart3} 
              title="Panel de Analíticas" 
              description="Conoce cuántas personas ven tus equipos, quiénes te contactan y qué maquinaria tiene mayor demanda."
            />
            <BenefitCard 
              icon={ShieldCheck} 
              title="Marca Verificada" 
              description="Obtén el sello de 'Vendedor Verificado' para generar confianza inmediata y cerrar tratos más rápido."
            />
            <BenefitCard 
              icon={Globe} 
              title="Alcance Nacional" 
              description="No te limites a tu ciudad. Muestra tu inventario en Caracas, Maracaibo, Valencia y todo el territorio nacional."
            />
            <BenefitCard 
              icon={MessageSquare} 
              title="Gestión de Leads" 
              description="Recibe cotizaciones y mensajes directamente en tu dashboard y responde de forma profesional y organizada."
            />
            <BenefitCard 
              icon={Users} 
              title="Gestión de Equipo" 
              description="Añade a tus vendedores a la plataforma y asigna permisos para que te ayuden a gestionar el inventario."
            />
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-32 bg-[#F5F5F5] rounded-[60px] mx-4 mb-32">
         <div className="max-w-[1248px] mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-10">
                  <h3 className="text-4xl font-black text-[#1C2B3A] tracking-tight">¿Cómo empezar a vender?</h3>
                  <div className="space-y-8">
                     <Step 
                        number="01" 
                        title="Regístrate como Empresa" 
                        description="Completa tus datos comerciales y adjunta tu registro para ser verificado." 
                     />
                     <Step 
                        number="02" 
                        title="Sube tu Inventario" 
                        description="Carga tus equipos de forma manual o utiliza nuestra herramienta de importación masiva." 
                     />
                     <Step 
                        number="03" 
                        title="Recibe Cotizaciones" 
                        description="Los clientes te contactarán directamente. Tú cierras el trato sin comisiones ocultas." 
                     />
                  </div>
               </div>
               <div className="bg-white p-12 rounded-3xl shadow-xl border border-white">
                  <div className="space-y-6">
                     <div className="flex items-center gap-3 mb-8">
                        <div className="w-3 h-3 rounded-full bg-[#D32323]" />
                        <div className="w-3 h-3 rounded-full bg-gray-200" />
                        <div className="w-3 h-3 rounded-full bg-gray-200" />
                     </div>
                     <h4 className="text-2xl font-black text-[#1C2B3A]">¿Listo para el siguiente nivel?</h4>
                     <p className="text-[#5C6370] font-medium leading-relaxed">
                        Cientos de empresas ya están transformando su forma de vender maquinaria. Únete hoy y obtén 3 meses gratis en el plan profesional.
                     </p>
                     <ul className="space-y-4 pt-4">
                        {["Sin comisiones por venta", "Soporte técnico 24/7", "Publicación ilimitada", "Reportes de rendimiento"].map(item => (
                           <li key={item} className="flex items-center gap-3 font-bold text-sm text-[#2D2E2F]">
                              <CheckCircle2 className="text-[#27AE60] w-5 h-5" /> {item}
                           </li>
                        ))}
                     </ul>
                     <Link href="/auth/register?type=company" className="block pt-6">
                        <Button className="w-full bg-[#1C2B3A] hover:bg-[#2d4156] text-white font-bold h-14 rounded-[4px] text-lg">
                           CREAR MI CUENTA AHORA
                        </Button>
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </main>
  );
}

function BenefitCard({ icon: Icon, title, description }: any) {
  return (
    <div className="p-8 rounded-2xl border border-[#EBEBEB] hover:border-[#D32323]/30 hover:bg-[#FDF2F2]/10 transition-all group">
      <div className="w-14 h-14 bg-[#F5F5F5] rounded-xl flex items-center justify-center text-[#5C6370] group-hover:bg-[#D32323] group-hover:text-white transition-all mb-6 shadow-sm">
        <Icon size={28} />
      </div>
      <h4 className="text-xl font-bold text-[#1C2B3A] mb-3">{title}</h4>
      <p className="text-[#5C6370] text-sm leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}

function Step({ number, title, description }: any) {
   return (
      <div className="flex gap-6">
         <span className="text-5xl font-black text-[#D32323]/20">{number}</span>
         <div>
            <h4 className="text-xl font-bold text-[#1C2B3A] mb-1">{title}</h4>
            <p className="text-[#5C6370] text-sm font-medium leading-relaxed max-w-sm">{description}</p>
         </div>
      </div>
   );
}
