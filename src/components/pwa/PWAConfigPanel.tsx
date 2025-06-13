
import React from 'react';
import { Settings, Smartphone, Wifi, Bell, Info, RefreshCw, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { usePWAConfig, PWAPresets } from '@/contexts/PWAContext';

interface PWAConfigPanelProps {
  className?: string;
}

export function PWAConfigPanel({ className }: PWAConfigPanelProps) {
  const { config, updateConfig, toggleComponent, resetConfig } = usePWAConfig();
  const { toast } = useToast();

  const handlePresetApply = (presetName: keyof typeof PWAPresets) => {
    updateConfig(PWAPresets[presetName]);
    toast({
      title: "Preset aplicado",
      description: `Configuración ${presetName} aplicada exitosamente.`,
    });
  };

  const handleReset = () => {
    resetConfig();
    toast({
      title: "Configuración restablecida",
      description: "Se ha restablecido la configuración por defecto.",
    });
  };

  const getConfigBadge = () => {
    const activeComponents = Object.entries(config)
      .filter(([key, value]) => key.startsWith('show') && value)
      .length;
    
    if (activeComponents === 0) return { text: 'Minimal', variant: 'secondary' as const };
    if (activeComponents <= 2) return { text: 'Basic', variant: 'outline' as const };
    if (activeComponents <= 4) return { text: 'Standard', variant: 'default' as const };
    return { text: 'Full', variant: 'default' as const };
  };

  const configBadge = getConfigBadge();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Configuración PWA</CardTitle>
          </div>
          <Badge variant={configBadge.variant}>{configBadge.text}</Badge>
        </div>
        <CardDescription>
          Personaliza la experiencia PWA y controla qué componentes se muestran
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Presets */}
        <div>
          <Label className="text-sm font-medium">Configuraciones Predefinidas</Label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {Object.keys(PWAPresets).map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => handlePresetApply(preset as keyof typeof PWAPresets)}
              >
                {preset.charAt(0).toUpperCase() + preset.slice(1)}
              </Button>
            ))}
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        <Separator />

        {/* Componentes Visibles */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Componentes Visibles
          </Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Botón Instalar</span>
              </div>
              <Switch
                checked={config.showInstallButton}
                onCheckedChange={() => toggleComponent('showInstallButton')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Prompt Actualización</span>
              </div>
              <Switch
                checked={config.showUpdatePrompt}
                onCheckedChange={() => toggleComponent('showUpdatePrompt')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Estado Conexión</span>
              </div>
              <Switch
                checked={config.showConnectionStatus}
                onCheckedChange={() => toggleComponent('showConnectionStatus')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Indicador Offline</span>
              </div>
              <Switch
                checked={config.showOfflineIndicator}
                onCheckedChange={() => toggleComponent('showOfflineIndicator')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Botón Notificaciones</span>
              </div>
              <Switch
                checked={config.showNotificationButton}
                onCheckedChange={() => toggleComponent('showNotificationButton')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Info Versión</span>
              </div>
              <Switch
                checked={config.showVersionInfo}
                onCheckedChange={() => toggleComponent('showVersionInfo')}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Comportamientos */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Comportamientos</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-prompt Instalación</span>
              <Switch
                checked={config.autoPromptInstall}
                onCheckedChange={() => toggleComponent('autoPromptInstall')}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Cache Offline</span>
              <Switch
                checked={config.enableOfflineCache}
                onCheckedChange={() => toggleComponent('enableOfflineCache')}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Push Notifications</span>
              <Switch
                checked={config.enablePushNotifications}
                onCheckedChange={() => toggleComponent('enablePushNotifications')}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Background Sync</span>
              <Switch
                checked={config.enableBackgroundSync}
                onCheckedChange={() => toggleComponent('enableBackgroundSync')}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Configuración UI */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Configuración UI</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Posición de Prompts</Label>
              <Select
                value={config.promptPosition}
                onValueChange={(value: 'top' | 'bottom') => updateConfig({ promptPosition: value })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Superior</SelectItem>
                  <SelectItem value="bottom">Inferior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Delay Instalación (ms)</Label>
              <Select
                value={config.installPromptDelay.toString()}
                onValueChange={(value) => updateConfig({ installPromptDelay: parseInt(value) })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5000">5 segundos</SelectItem>
                  <SelectItem value="10000">10 segundos</SelectItem>
                  <SelectItem value="30000">30 segundos</SelectItem>
                  <SelectItem value="60000">1 minuto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Modo Compacto</span>
              <Switch
                checked={config.compactMode}
                onCheckedChange={() => toggleComponent('compactMode')}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Mostrar Animaciones</span>
              <Switch
                checked={config.showAnimations}
                onCheckedChange={() => toggleComponent('showAnimations')}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
