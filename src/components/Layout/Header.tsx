
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PWAContainer, PWAOfflineIndicator } from '@/components/pwa';

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    const titles: Record<string, string> = {
      '/': 'Dashboard',
      '/gruas': 'Grúas',
      '/clientes': 'Clientes',
      '/operadores': 'Operadores',
      '/servicios': 'Servicios',
      '/facturas': 'Facturas',
      '/cierres': 'Cierres',
      '/tipos-servicio': 'Tipos de Servicio',
      '/reportes': 'Reportes',
      '/settings': 'Configuración',
      '/pwa-grua': 'PWA Grúa',
      '/migraciones': 'Migraciones',
      '/migracion-nueva': 'Nueva Migración',
    };
    return titles[path] || 'SGG Grúa Manager';
  };

  return (
    <header className="border-b border-primary/20 bg-black backdrop-blur sticky top-0 z-40 shadow-lg shadow-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Menu button + Title */}
          <div className="flex items-center gap-4">
            {showMenuButton && (
              <SidebarTrigger className="hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 border border-primary/20 hover:border-primary/40" />
            )}
            
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-primary drop-shadow-lg">
                {getPageTitle()}
              </h1>
              <Badge variant="outline" className="hidden sm:flex bg-primary/20 text-primary border-primary/30 font-medium shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-200">
                SGG Manager
              </Badge>
            </div>
          </div>

          {/* Right side - PWA Controls + Settings */}
          <div className="flex items-center gap-2">
            {/* PWA Container con controles compactos */}
            <PWAContainer 
              layout="horizontal" 
              spacing="tight" 
              showText={false}
              className="hidden sm:flex"
            />
            
            {/* PWA Container mobile (solo iconos) */}
            <PWAContainer 
              layout="horizontal" 
              spacing="tight" 
              showText={false}
              className="flex sm:hidden"
            />

            {/* Settings button */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 group border border-primary/20 hover:border-primary/40"
            >
              <Link to="/settings">
                <Settings className="h-5 w-5 group-hover:rotate-90 group-hover:text-primary transition-all duration-300 group-hover:drop-shadow-lg group-hover:drop-shadow-primary/50" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Offline indicator - aparece prominente cuando no hay conexión */}
        <PWAOfflineIndicator className="mb-0" />
      </div>
    </header>
  );
}
