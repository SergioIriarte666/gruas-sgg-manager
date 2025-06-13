
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Implementación completamente independiente de tabs
interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | null>(null);

function SimpleTabs({ defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="space-y-6">
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex border-b border-border">
      {children}
    </div>
  );
}

function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const context = React.useContext(TabsContext);
  if (!context) return null;
  
  const { activeTab, setActiveTab } = context;
  
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        activeTab === value
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const context = React.useContext(TabsContext);
  if (!context) return null;
  
  const { activeTab } = context;
  
  if (activeTab !== value) return null;
  
  return <div>{children}</div>;
}

export default function Settings() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('Settings: Component mounting...');
    // Pequeña demora para asegurar que todo esté inicializado
    const timer = setTimeout(() => {
      console.log('Settings: Component ready');
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    console.log('Settings: Not ready, showing loading...');
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  console.log('Settings: Rendering main content');

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
          <TabsList>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="general">
              <Globe className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications">
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
          </TabsContent>
          
          <TabsContent value="general">
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
          </TabsContent>
        </SimpleTabs>
      </div>
    </div>
  );
}
