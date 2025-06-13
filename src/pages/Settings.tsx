
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Componente simple de Tabs sin dependencias de Radix por ahora
function SimpleTabs({ children, defaultValue }: { children: React.ReactNode; defaultValue: string }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <div className="space-y-6">
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'notifications'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Bell className="h-4 w-4 mr-2 inline" />
          Notificaciones
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'general'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Globe className="h-4 w-4 mr-2 inline" />
          General
        </button>
      </div>
      
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Configuración de Notificaciones
            </CardTitle>
            <CardDescription>
              Gestiona cómo y cuándo recibes notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Configuración de Notificaciones</h3>
                <p>Las configuraciones de notificaciones estarán disponibles próximamente.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Configuración General
            </CardTitle>
            <CardDescription>
              Configuraciones generales del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <SettingsIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Configuraciones Generales</h3>
                <p>Las configuraciones adicionales estarán disponibles próximamente.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Settings() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Pequeña demora para asegurar que todo esté inicializado
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <SettingsIcon className="h-8 w-8" />
              Configuración
            </h1>
            <p className="text-muted-foreground mt-1">
              Personaliza la experiencia de SGG Grúa Manager
            </p>
          </div>
          <Badge variant="outline">Sistema</Badge>
        </div>

        {/* Tabs de configuración */}
        <SimpleTabs defaultValue="general">
          {/* Los tabs se renderizan internamente en SimpleTabs */}
        </SimpleTabs>
      </div>
    </div>
  );
}
