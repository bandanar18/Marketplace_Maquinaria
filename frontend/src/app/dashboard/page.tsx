"use client";

import { useAuth } from "@/context/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quotesService } from "@/services/products.service";
import { favoritesService } from "@/services/favorites.service";
import { companyService } from "@/services/company.service";
import { productsService } from "@/services/products.service";
import { adminService } from "@/services/admin.service";
import { userService } from "@/services/user.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Heart, 
  Eye, 
  MessageSquare,
  ArrowRight,
  Package,
  TrendingUp,
  Award,
  Clock,
  Users,
  Building2,
  ShieldAlert,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  BarChart2
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
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
  Pie
} from "recharts";

export default function DashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: quotes, isLoading: isLoadingQuotes } = useQuery({
    queryKey: ['my-quotes'],
    queryFn: () => quotesService.getMyQuotes(),
  });

  const isCompany = user?.role === 'COMPANY_MEMBER' || user?.companyRole;
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  // Stats for Company
  const { data: companyStats } = useQuery({
    queryKey: ['company-stats'],
    queryFn: () => companyService.getCompanyStats(),
    enabled: !!isCompany,
  });

  // Stats for SuperAdmin
  const { data: adminStats } = useQuery({
    queryKey: ['admin-global-stats'],
    queryFn: () => adminService.getGlobalStats(),
    enabled: isSuperAdmin,
  });

  // Profile for Company (to get slug)
  const { data: myCompany } = useQuery({
    queryKey: ['my-company-profile'],
    queryFn: () => companyService.getMyCompany(),
    enabled: !!isCompany,
  });

  // Pending Companies for SuperAdmin
  const { data: pendingCompaniesData } = useQuery({
    queryKey: ['admin-pending-companies'],
    queryFn: () => companyService.getAdminCompanies({ status: 'PENDING_REVIEW', limit: 5 }),
    enabled: isSuperAdmin,
  });

  const updateCompanyStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      companyService.updateCompanyStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-companies'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success("Empresa actualizada correctamente");
    },
  });

  const { data: favorites } = useQuery({
    queryKey: ['my-favorites'],
    queryFn: () => favoritesService.getMyFavorites(),
    enabled: !!(user && user.role === 'CLIENT'),
  });

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#2D2E2F] mb-2 tracking-tight">
            Hola, {user?.firstName}
          </h1>
          <p className="text-[#5C6370] font-medium">
            {isSuperAdmin 
              ? "Panel de administración global del marketplace." 
              : isCompany 
                ? "Aquí tienes un resumen del rendimiento de tu negocio hoy."
                : "Gestiona tus cotizaciones y equipos favoritos desde aquí."}
          </p>
        </div>

        {isCompany && myCompany?.slug && (
          <Link href={`/company/${myCompany.slug}`} target="_blank">
            <Button variant="outline" className="font-bold border-[#EBEBEB] text-[#5C6370] hover:text-[#D32323] shadow-sm">
              <ExternalLink className="w-4 h-4 mr-2" /> VER MI TIENDA PÚBLICA
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isSuperAdmin ? (
          <>
            <StatCard title="Empresas Pendientes" value={adminStats?.overview?.pendingCompanies || 0} icon={Building2} trend="Nuevas solicitudes" />
            <StatCard title="Equipos a Revisar" value={adminStats?.overview?.pendingProducts || 0} icon={Package} trend="Moderación pendiente" />
            <StatCard title="Usuarios Totales" value={adminStats?.overview?.totalUsers || 0} icon={Users} trend="Comunidad total" />
            <StatCard title="Cotizaciones Hoy" value={adminStats?.overview?.totalQuotes || 0} icon={TrendingUp} trend="Interés comercial" />
          </>
        ) : isCompany ? (
          <>
            <StatCard title="Equipos Activos" value={companyStats?.activeProducts || 0} icon={Package} trend="+2 este mes" />
            <StatCard title="Cotizaciones" value={companyStats?.totalQuotes || 0} icon={FileText} trend="+5 nuevas" />
            <StatCard title="Mensajes" value={companyStats?.totalMessages || 0} icon={MessageSquare} />
            <StatCard title="Vistas Totales" value={companyStats?.totalViews || 0} icon={Eye} trend="+12% vs ayer" />
          </>
        ) : (
          <>
            <StatCard title="Mis Cotizaciones" value={quotes?.length || 0} icon={FileText} />
            <StatCard title="Favoritos" value={favorites?.length || 0} icon={Heart} />
            <StatCard title="Mensajes" value="0" icon={MessageSquare} />
            <StatCard title="Búsquedas" value="12" icon={TrendingUp} />
          </>
        )}
      </div>

      {/* Analytics Section (Only for Company) */}
      {isCompany && companyStats && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[#EBEBEB] shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-gray-50 bg-gray-50/30 py-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-[#9099A6] flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#D32323]" /> Equipos Más Vistos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyStats.topProducts}>
                  <XAxis dataKey="title" hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    itemStyle={{ fontWeight: 'bold', color: '#D32323' }}
                    cursor={{ fill: '#F5F5F5' }}
                  />
                  <Bar dataKey="viewsCount" fill="#D32323" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-[#EBEBEB] shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-gray-50 bg-gray-50/30 py-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-[#9099A6] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#D32323]" /> Distribución de Inventario
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 h-[300px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(companyStats.statusDistribution).map(([name, value]) => ({ name, value }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {Object.entries(companyStats.statusDistribution).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        entry[0] === 'ACTIVE' ? '#27AE60' : 
                        entry[0] === 'DRAFT' ? '#9099A6' : 
                        entry[0] === 'REJECTED' ? '#D32323' : '#F15C00'
                      } />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-3xl font-black text-[#2D2E2F]">
                     {Object.values(companyStats.statusDistribution).reduce((a: number, b) => a + Number(b), 0)}
                 </span>
                 <span className="text-[9px] font-black text-[#9099A6] uppercase tracking-tighter">EQUIPOS</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-10">
        {/* Recent Activity List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#2D2E2F]">
              {isSuperAdmin ? "Empresas Pendientes" : "Actividad Reciente"}
            </h2>
            <Link href={isSuperAdmin ? "/dashboard/admin/companies" : "/dashboard/quotes"} className="text-sm font-bold text-[#0073BB] hover:underline">
              Ver todo
            </Link>
          </div>

          <Card className="border-[#EBEBEB] shadow-sm rounded-lg overflow-hidden bg-white">
            <CardContent className="p-0">
              {isSuperAdmin ? (
                /* SuperAdmin Approval View (Real Data) */
                pendingCompaniesData?.items?.length > 0 ? (
                  <div className="divide-y divide-[#EBEBEB]">
                    {pendingCompaniesData.items.map((company: any) => (
                      <div key={company.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#F5F5F5] rounded-md flex items-center justify-center border border-[#EBEBEB]">
                            <Building2 className="w-6 h-6 text-[#5C6370]" />
                          </div>
                          <div>
                            <p className="font-bold text-[#2D2E2F]">{company.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-[#9099A6] font-medium">{company.city}, {company.country}</span>
                              <span className="text-[#EBEBEB]">·</span>
                              <span className="text-xs text-[#9099A6] font-medium">Tax ID: {company.taxId}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateCompanyStatusMutation.mutate({ id: company.id, status: 'ACTIVE' })}
                            className="p-2 hover:bg-[#EAFAF1] rounded-[4px] text-[#27AE60] border border-transparent hover:border-[#27AE60]/20 transition-all"
                            title="Aprobar"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => updateCompanyStatusMutation.mutate({ id: company.id, status: 'REJECTED' })}
                            className="p-2 hover:bg-[#FDF2F2] rounded-[4px] text-[#D32323] border border-transparent hover:border-[#D32323]/20 transition-all"
                            title="Rechazar"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Building2 className="w-12 h-12 text-[#EBEBEB] mx-auto mb-4" />
                    <p className="text-[#5C6370] font-medium">No hay empresas pendientes de aprobación.</p>
                  </div>
                )
              ) : (
                /* Standard Activity View */
                isLoadingQuotes ? (
                  <div className="p-8 text-center text-[#5C6370]">Cargando actividad...</div>
                ) : quotes?.length > 0 ? (
                  <div className="divide-y divide-[#EBEBEB]">
                    {quotes.slice(0, 5).map((quote: any) => (
                      <div key={quote.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#F5F5F5] rounded-md flex items-center justify-center border border-[#EBEBEB] group-hover:bg-white transition-colors">
                            <FileText className="w-6 h-6 text-[#5C6370]" />
                          </div>
                          <div>
                            <p className="font-bold text-[#2D2E2F]">{quote.product?.title || 'Producto'}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-[#9099A6] font-medium">
                                {isCompany ? `Cliente: ${quote.client?.firstName}` : `Tienda: ${quote.company?.name}`}
                              </span>
                              <span className="text-[#EBEBEB]">·</span>
                              <span className="text-xs text-[#9099A6] font-medium">Hace 2 horas</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={`rounded-sm font-bold text-[10px] uppercase px-2 py-1 ${
                            quote.status === 'PENDING' ? 'bg-[#F15C00]/10 text-[#F15C00] border-[#F15C00]/20' : 'bg-[#27AE60]/10 text-[#27AE60] border-[#27AE60]/20'
                          }`}>
                            {quote.status}
                          </Badge>
                          <Link href={`/dashboard/quotes/${quote.id}`}>
                            <div className="p-2 hover:bg-white rounded-full border border-transparent hover:border-[#EBEBEB] transition-all">
                              <ArrowRight className="w-4 h-4 text-[#9099A6]" />
                            </div>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <FileText className="w-12 h-12 text-[#EBEBEB] mx-auto mb-4" />
                    <p className="text-[#5C6370] font-medium">No hay actividad reciente para mostrar.</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {isSuperAdmin ? (
            /* SuperAdmin Top Products Widget */
            <Card className="border-[#EBEBEB] bg-white shadow-sm rounded-lg overflow-hidden">
              <CardHeader className="bg-gray-50/50 border-b border-[#EBEBEB]">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-[#9099A6] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#D32323]" /> Top Equipos Más Vistos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-[#EBEBEB]">
                  {adminStats?.topProducts?.map((product: any) => (
                    <div key={product.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#2D2E2F] truncate">{product.title}</p>
                        <p className="text-[10px] text-[#9099A6] font-medium uppercase">{product.company.name}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs font-black text-[#D32323]">{product.viewsCount}</p>
                        <p className="text-[9px] text-[#9099A6] font-bold uppercase">Vistas</p>
                      </div>
                    </div>
                  ))}
                  {(!adminStats?.topProducts || adminStats.topProducts.length === 0) && (
                    <div className="p-8 text-center text-xs text-[#9099A6] font-medium">
                      No hay datos suficientes aún.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Plan Status Widget */}
              <Card className="bg-[#1C2B3A] text-white border-none shadow-lg overflow-hidden relative">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#D32323] rounded-full opacity-20 blur-2xl" />
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-2 text-[#D32323] mb-1">
                    <Award size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Plan {isCompany ? 'Profesional' : 'Básico'}</span>
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight">Potencia tu Negocio</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 space-y-6">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {isCompany 
                      ? "Tu plan actual te permite publicar inventario ilimitado y recibir estadísticas detalladas."
                      : "Sube de nivel para publicar equipos y recibir cotizaciones directas."}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <Clock size={14} className="text-[#D32323]" /> VENCE EN 12 DÍAS
                  </div>
                  <Button className="w-full bg-[#D32323] hover:bg-[#A61A1A] text-white font-bold h-12 shadow-md">
                    {isCompany ? "RENOVAR AHORA" : "VER PLANES PRO"}
                  </Button>
                </CardContent>
              </Card>

              {/* Tips Widget */}
              <Card className="border-[#EBEBEB] bg-white shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#2D2E2F]">Consejos de Éxito</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EAFAF1] flex items-center justify-center shrink-0">
                      <TrendingUp size={16} className="text-[#27AE60]" />
                    </div>
                    <p className="text-sm text-[#5C6370] font-medium">
                      Las empresas con fotos reales venden un <span className="text-[#2D2E2F] font-bold">40% más rápido</span>.
                    </p>
                  </div>
                  <Separator className="bg-[#F5F5F5]" />
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#EBF5FB] flex items-center justify-center shrink-0">
                      <MessageSquare size={16} className="text-[#2980B9]" />
                    </div>
                    <p className="text-sm text-[#5C6370] font-medium">
                      Responde a las cotizaciones en menos de <span className="text-[#2D2E2F] font-bold">4 horas</span> para mayor conversión.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend }: any) {
  return (
    <Card className="border-[#EBEBEB] shadow-sm hover:shadow-md transition-all bg-white rounded-lg">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 bg-[#F5F5F5] rounded-lg border border-[#EBEBEB]">
            <Icon className="w-5 h-5 text-[#D32323]" />
          </div>
          {trend && (
            <span className="text-[10px] font-bold text-[#27AE60] bg-[#EAFAF1] px-2 py-1 rounded-sm border border-[#27AE60]/10">
              {trend}
            </span>
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-[#9099A6] uppercase tracking-widest mb-1">{title}</p>
          <p className="text-3xl font-bold text-[#2D2E2F] tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
