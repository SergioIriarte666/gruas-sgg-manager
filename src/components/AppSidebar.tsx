
import { Truck, Users, FileText, DollarSign, BarChart3, Settings, Home, UserCheck, Wrench, Calendar, Upload } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const mainMenuItems = [{
  title: "Dashboard",
  url: "/",
  icon: Home
}, {
  title: "Servicios",
  url: "/servicios",
  icon: FileText
}, {
  title: "Cierres",
  url: "/cierres",
  icon: Calendar
}, {
  title: "Facturas",
  url: "/facturas",
  icon: DollarSign
}, {
  title: "Migración Masiva",
  url: "/migraciones",
  icon: Upload
}, {
  title: "Reportes",
  url: "/reportes",
  icon: BarChart3
}];

const maestrosItems = [{
  title: "Clientes",
  url: "/clientes",
  icon: Users
}, {
  title: "Grúas",
  url: "/gruas",
  icon: Truck
}, {
  title: "Operadores",
  url: "/operadores",
  icon: UserCheck
}, {
  title: "Tipos de Servicio",
  url: "/tipos-servicio",
  icon: Wrench
}];

const configItems = [{
  title: "Configuración",
  url: "/settings",
  icon: Settings
}];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar className="border-r-0">
      <SidebarContent className="bg-black border-r border-primary/20">
        <div className="p-4 border-b border-primary/30 bg-black">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Truck className="h-8 w-8 text-primary drop-shadow-lg animate-lime-glow" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary drop-shadow-sm">SGG</h1>
              <p className="text-xs text-primary/70 font-medium">Sistema de Gestión de Grúas</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold tracking-wide border-b border-primary/20 pb-2">Gestión Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url} 
                    className="transition-all duration-200 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20 data-[state=open]:bg-primary/20 group border-l-2 border-transparent hover:border-primary data-[active=true]:border-primary data-[active=true]:bg-primary/20"
                  >
                    <Link to={item.url} className="flex items-center gap-3 text-primary hover:text-primary data-[active=true]:text-primary">
                      <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200 group-hover:drop-shadow-lg group-hover:drop-shadow-primary/50" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold tracking-wide border-b border-primary/20 pb-2">Datos Maestros</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {maestrosItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url} 
                    className="transition-all duration-200 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20 data-[state=open]:bg-primary/20 group border-l-2 border-transparent hover:border-primary data-[active=true]:border-primary data-[active=true]:bg-primary/20"
                  >
                    <Link to={item.url} className="flex items-center gap-3 text-primary hover:text-primary data-[active=true]:text-primary">
                      <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200 group-hover:drop-shadow-lg group-hover:drop-shadow-primary/50" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold tracking-wide border-b border-primary/20 pb-2">Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url} 
                    className="transition-all duration-200 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20 data-[state=open]:bg-primary/20 group border-l-2 border-transparent hover:border-primary data-[active=true]:border-primary data-[active=true]:bg-primary/20"
                  >
                    <Link to={item.url} className="flex items-center gap-3 text-primary hover:text-primary data-[active=true]:text-primary">
                      <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200 group-hover:drop-shadow-lg group-hover:drop-shadow-primary/50" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-black border-t border-primary/30">
        <div className="p-4">
          <div className="flex items-center justify-center">
            <p className="text-xs text-primary/70 text-center font-medium">
              SGG v1.0 - Sistema de Gestión de Grúas
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
