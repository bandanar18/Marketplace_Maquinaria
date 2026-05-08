"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronRight,
  Home,
  MessageSquare,
  Bell,
  Building2,
  User,
  Users,
  Award,
  AlertTriangle,
  History,
  LifeBuoy,
  Megaphone,
  ShieldCheck,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">Cargando...</div>;
  if (!user) return null;

  const menuItems = user.role === 'SUPERADMIN' ? [
    { name: "Panel Control", href: "/dashboard", icon: LayoutDashboard },
    { name: "Empresas Pendientes", href: "/dashboard/admin/companies", icon: Building2 },
    { name: "Equipos Pendientes", href: "/dashboard/admin/products", icon: Package },
    { name: "Categorías", href: "/dashboard/admin/categories", icon: FileText },
    { name: "Marcas", href: "/dashboard/admin/brands", icon: Award },
    { name: "Reportes", href: "/dashboard/admin/reports", icon: AlertTriangle },
    { name: "Auditoría", href: "/dashboard/admin/audit", icon: History },
    { name: "Soporte", href: "/dashboard/admin/support", icon: LifeBuoy },
    { name: "Comunicados", href: "/dashboard/admin/broadcast", icon: Megaphone },
    { name: "Usuarios", href: "/dashboard/admin/users", icon: User },
    { name: "Configuración", href: "/dashboard/settings", icon: Settings },
  ] : user.role === 'COMPANY_MEMBER' || user.companyRole ? [
    { name: "Resumen", href: "/dashboard", icon: LayoutDashboard },
    { name: "Estadísticas", href: "/dashboard/company/analytics", icon: BarChart3 },
    { name: "Inventario", href: "/dashboard/inventory", icon: Package },
    { name: "Cotizaciones", href: "/dashboard/quotes", icon: FileText },
    { name: "Mis Clientes", href: "/dashboard/company/customers", icon: Users },
    { name: "Perfil de Empresa", href: "/dashboard/company/profile", icon: Building2 },
    { name: "Mi Equipo", href: "/dashboard/company/team", icon: ShieldCheck },
    { name: "Mensajes", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Configuración", href: "/dashboard/settings", icon: Settings },
  ] : [
    { name: "Mi Actividad", href: "/dashboard", icon: LayoutDashboard },
    { name: "Cotizaciones", href: "/dashboard/quotes", icon: FileText },
    { name: "Mensajes", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Configuración", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex font-sans text-[#2D2E2F]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#EBEBEB] flex flex-col fixed h-full z-20">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#D32323] text-white w-8 h-8 rounded flex items-center justify-center font-black text-sm shadow-sm">
              M
            </div>
            <span className="text-lg font-black text-[#1C2B3A] tracking-tight">
              maquinaria
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-[#9099A6] uppercase tracking-widest mb-2">Menú Principal</p>
          {menuItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-md text-sm transition-all group",
                pathname === item.href 
                  ? "bg-[#D32323]/5 text-[#D32323] font-bold" 
                  : "text-[#5C6370] hover:bg-gray-50 hover:text-[#2D2E2F]"
              )}
            >
              <div className="flex items-center">
                <item.icon className={cn("w-4 h-4 mr-3", pathname === item.href ? "text-[#D32323]" : "text-[#9099A6] group-hover:text-[#2D2E2F]")} />
                {item.name}
              </div>
              {pathname === item.href && <div className="w-1.5 h-1.5 rounded-full bg-[#D32323]" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <Separator className="bg-[#EBEBEB] mb-4" />
          <button 
            onClick={logout}
            className="flex items-center px-4 py-3 w-full text-sm text-[#5C6370] hover:text-[#D32323] transition-colors font-medium"
          >
            <LogOut className="w-4 h-4 mr-3" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#EBEBEB] flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#9099A6] uppercase tracking-widest">
              {pathname === "/dashboard" ? "Resumen" : pathname.split('/').pop()?.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-4">
               <Link href="/" className="text-[#5C6370] hover:text-[#D32323] transition-colors p-2 rounded-full hover:bg-gray-100">
                  <Home className="w-5 h-5" />
               </Link>
               <button className="text-[#5C6370] hover:text-[#D32323] transition-colors p-2 rounded-full hover:bg-gray-100 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D32323] rounded-full border-2 border-white" />
               </button>
            </div>

            <Separator orientation="vertical" className="h-6 bg-[#EBEBEB]" />

            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-[#2D2E2F] leading-none mb-1">{user.firstName} {user.lastName}</p>
                  <p className="text-[10px] text-[#9099A6] font-bold uppercase tracking-wider">{user.role === 'COMPANY_MEMBER' ? 'Distribuidor' : 'Cliente'}</p>
               </div>
               <div className="w-9 h-9 bg-[#D32323] rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm">
                  {user.firstName[0]}
               </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 max-w-[1200px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
