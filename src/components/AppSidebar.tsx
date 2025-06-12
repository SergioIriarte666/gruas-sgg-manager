import { Truck, Users, FileText, DollarSign, BarChart3, Settings, Home, UserCheck, Wrench, Calendar, Upload } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const mainMenuItems = [{
  title: "Servicios",
  url: "/",
  icon: Home
}, {
  title: "Cierres",
  url: "/cierres",
  icon: Calendar
}, {
  title: "Facturas",
  url: "/facturas",
  icon: FileText
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

export function AppSidebar() {
  const location = useLocation();
  return <Sidebar>
      <SidebarContent className="bg-black">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-lime-400">SGG</h1>
              <p className="text-xs text-muted-foreground">Sistema de Gestión de Grúas</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Gestión Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url} className="transition-colors">
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Datos Maestros</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {maestrosItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url} className="transition-colors">
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground text-center">
            SGG v1.0 - Sistema de Gestión de Grúas
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>;
}
