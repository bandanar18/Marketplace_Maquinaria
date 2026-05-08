"use client";

import { useState, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { companyService } from "@/services/company.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  FileText, 
  Package, 
  BarChart3, 
  ArrowUpRight,
  ChevronRight,
  Loader2,
  Calendar
} from "lucide-react";
import Link from "next/link";

const MOCK_MONTHLY_DATA = [
  { name: "Ene", vistas: 400, leads: 24 },
  { name: "Feb", vistas: 300, leads: 18 },
  { name: "Mar", vistas: 600, leads: 40 },
  { name: "Abr", vistas: 800, leads: 52 },
  { name: "May", vistas: 700, leads: 48 },
  { name: "Jun", vistas: 900, leads: 60 },
];

export default function CompanyAnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { data: stats, isLoading } = useQuery({
    queryKey: ['company-stats'],
    queryFn: () => companyService.getCompanyStats(),
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading || !isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-[#D32323] animate-spin" />
        <p className="text-sm font-medium text-[#5C6370]">Procesando datos de inteligencia...</p>
      </div>
    );
  }

  const statusData = stats ? Object.entries(stats.statusDistribution).map(([name, value]) => ({ 
    name: name === 'ACTIVE' ? 'Activo' : name === 'DRAFT' ? 'Borrador' : name === 'REJECTED' ? 'Rechazado' : 'Vendido', 
    value 
  })) : [];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-[#9099A6] uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-[#D32323] transition-colors">Dashboard</Link>
            <ChevronRight size={14} />
            <span className="text-[#2D2E2F]">Inteligencia de Negocio</span>
          </div>
          <h1 className="text-3xl font-black text-[#1C2B3A] tracking-tight">Análisis de Rendimiento</h1>
          <p className="text-[#5C6370] mt-1 font-medium">Métricas clave para entender el crecimiento de tu inventario.</p>
        </div>
        
        <div className="bg-white border border-[#EBEBEB] rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
           <Calendar className="w-4 h-4 text-[#D32323]" />
           <span className="text-xs font-bold text-[#2D2E2F]">Últimos 30 días</span>
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Vistas Totales" value={stats?.totalViews || 0} icon={Eye} trend="+12.5%" isPositive={true} />
        <StatCard title="Leads Generados" value={stats?.totalQuotes || 0} icon={FileText} trend="+4.2%" isPositive={true} />
        <StatCard title="Mensajes" value={stats?.totalMessages || 0} icon={MessageSquare} trend="-2.1%" isPositive={false} />
        <StatCard title="Equipos Activos" value={stats?.activeProducts || 0} icon={Package} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Growth Chart */}
        <Card className="lg:col-span-2 border-[#EBEBEB] shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-gray-50/30 border-b border-gray-100 py-6">
             <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Crecimiento de Audiencia</CardTitle>
                  <CardDescription>Visualizaciones únicas de tus equipos en el tiempo.</CardDescription>
                </div>
                <div className="flex gap-2">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#D32323]">
                      <div className="w-2 h-2 rounded-full bg-[#D32323]" /> Vistas
                   </div>
                </div>
             </div>
          </CardHeader>
          <CardContent className="pt-10 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_MONTHLY_DATA}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D32323" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#D32323" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9099A6' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9099A6' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="vistas" 
                  stroke="#D32323" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Status Distribution */}
        <Card className="border-[#EBEBEB] shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-gray-50/30 border-b border-gray-100 py-6">
            <CardTitle className="text-lg font-bold">Estado del Inventario</CardTitle>
            <CardDescription>Distribución por estado de publicación.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 h-[350px] flex flex-col items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.name === 'Activo' ? '#27AE60' : 
                      entry.name === 'Borrador' ? '#9099A6' : 
                      entry.name === 'Rechazado' ? '#D32323' : '#F15C00'
                    } />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-[#1C2B3A]">
                  {statusData.reduce((acc, curr) => acc + curr.value, 0)}
                </span>
                <span className="text-[10px] font-black text-[#9099A6] uppercase">EQUIPOS</span>
            </div>
            <div className="w-full mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 px-4 pb-4">
               {statusData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 
                        entry.name === 'Activo' ? '#27AE60' : 
                        entry.name === 'Borrador' ? '#9099A6' : 
                        entry.name === 'Rechazado' ? '#D32323' : '#F15C00'
                     }} />
                     <span className="text-[10px] font-bold text-[#5C6370] uppercase">{entry.name}</span>
                  </div>
               ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Products */}
        <Card className="lg:col-span-3 border-[#EBEBEB] shadow-sm bg-white overflow-hidden">
           <CardHeader className="bg-gray-50/30 border-b border-gray-100 py-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Equipos con Mayor Tracción</CardTitle>
                <CardDescription>Los 5 productos más vistos de tu catálogo.</CardDescription>
              </div>
              <BarChart3 className="text-[#D32323] w-6 h-6" />
           </CardHeader>
           <CardContent className="p-0">
              <div className="divide-y divide-gray-50">
                 {stats?.topProducts?.map((product: any, idx: number) => (
                    <div key={product.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                       <div className="flex items-center gap-6">
                          <span className="text-2xl font-black text-gray-100 group-hover:text-[#D32323]/20 transition-colors">0{idx + 1}</span>
                          <div>
                             <h4 className="font-bold text-[#1C2B3A] group-hover:text-[#D32323] transition-colors">{product.title}</h4>
                             <p className="text-xs text-[#9099A6] font-medium uppercase tracking-wider">{product.price} {product.currency}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-10">
                          <div className="text-center">
                             <p className="text-xl font-black text-[#1C2B3A] leading-none">{product.viewsCount}</p>
                             <p className="text-[9px] font-black text-[#9099A6] uppercase mt-1 tracking-tighter">Vistas</p>
                          </div>
                          <div className="w-px h-8 bg-gray-100" />
                          <div className="text-center">
                             <p className="text-xl font-black text-[#27AE60] leading-none">{Math.floor(product.viewsCount * 0.05)}</p>
                             <p className="text-[9px] font-black text-[#9099A6] uppercase mt-1 tracking-tighter">Leads</p>
                          </div>
                          <Link href={`/marketplace/${product.slug}`} target="_blank" className="p-3 bg-[#F5F5F5] rounded-full text-gray-400 hover:text-[#D32323] hover:bg-[#FDF2F2] transition-all">
                             <ArrowUpRight size={20} />
                          </Link>
                       </div>
                    </div>
                 ))}
                 {(!stats?.topProducts || stats.topProducts.length === 0) && (
                    <div className="p-20 text-center text-[#9099A6] font-medium">
                       Aún no hay suficientes datos para mostrar el ranking de equipos.
                    </div>
                 )}
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, isPositive }: any) {
  return (
    <Card className="border-[#EBEBEB] shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-[#F5F5F5] rounded-xl border border-[#EBEBEB]">
            <Icon className="w-5 h-5 text-[#D32323]" />
          </div>
          {trend && (
            <div className={`flex items-center text-[10px] font-black px-2 py-1 rounded-full border ${
              isPositive 
                ? "bg-emerald-50 text-[#27AE60] border-emerald-100" 
                : "bg-red-50 text-[#D32323] border-red-100"
            }`}>
              {isPositive ? "+" : ""}{trend}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-black text-[#9099A6] uppercase tracking-widest mb-1">{title}</p>
          <p className="text-4xl font-black text-[#1C2B3A] tracking-tight">{new Intl.NumberFormat().format(value)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
