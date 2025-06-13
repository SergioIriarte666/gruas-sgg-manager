
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface PWAConfig {
  // Componentes Visibles
  showInstallButton: boolean;
  showUpdatePrompt: boolean;
  showConnectionStatus: boolean;
  showOfflineIndicator: boolean;
  showNotificationButton: boolean;
  showVersionInfo: boolean;
  
  // Comportamientos
  autoPromptInstall: boolean;
  installPromptDelay: number;
  updateCheckInterval: number;
  enableOfflineCache: boolean;
  enablePushNotifications: boolean;
  enableBackgroundSync: boolean;
  
  // Configuración UI
  compactMode: boolean;
  promptPosition: 'top' | 'bottom';
  showAnimations: boolean;
}

interface PWAContextType {
  config: PWAConfig;
  updateConfig: (newConfig: Partial<PWAConfig>) => void;
  enableComponent: (component: keyof PWAConfig) => void;
  disableComponent: (component: keyof PWAConfig) => void;
  toggleComponent: (component: keyof PWAConfig) => void;
  resetConfig: () => void;
  isComponentEnabled: (component: keyof PWAConfig) => boolean;
}

const defaultConfig: PWAConfig = {
  // Componentes Visibles
  showInstallButton: true,
  showUpdatePrompt: true,
  showConnectionStatus: true,
  showOfflineIndicator: true,
  showNotificationButton: false,
  showVersionInfo: false,
  
  // Comportamientos
  autoPromptInstall: false,
  installPromptDelay: 10000,
  updateCheckInterval: 300000,
  enableOfflineCache: true,
  enablePushNotifications: false,
  enableBackgroundSync: true,
  
  // Configuración UI
  compactMode: false,
  promptPosition: 'bottom',
  showAnimations: true,
};

export const PWAPresets = {
  minimal: {
    ...defaultConfig,
    showInstallButton: false,
    showUpdatePrompt: true,
    showConnectionStatus: false,
    showOfflineIndicator: false,
    showNotificationButton: false,
    showVersionInfo: false,
    compactMode: true,
    autoPromptInstall: false,
  } as PWAConfig,
  
  basic: {
    ...defaultConfig,
    showInstallButton: true,
    showUpdatePrompt: true,
    showConnectionStatus: true,
    showOfflineIndicator: true,
    showNotificationButton: false,
    showVersionInfo: false,
    compactMode: false,
    autoPromptInstall: false,
  } as PWAConfig,
  
  full: {
    ...defaultConfig,
    showInstallButton: true,
    showUpdatePrompt: true,
    showConnectionStatus: true,
    showOfflineIndicator: true,
    showNotificationButton: true,
    showVersionInfo: true,
    compactMode: false,
    autoPromptInstall: false,
    enablePushNotifications: true,
  } as PWAConfig,
  
  development: {
    ...defaultConfig,
    showInstallButton: true,
    showUpdatePrompt: true,
    showConnectionStatus: true,
    showOfflineIndicator: true,
    showNotificationButton: true,
    showVersionInfo: true,
    compactMode: false,
    autoPromptInstall: false,
    updateCheckInterval: 10000,
    enablePushNotifications: true,
  } as PWAConfig,
  
  production: {
    ...defaultConfig,
    showInstallButton: true,
    showUpdatePrompt: true,
    showConnectionStatus: true,
    showOfflineIndicator: true,
    showNotificationButton: false,
    showVersionInfo: false,
    compactMode: true,
    autoPromptInstall: false,
    updateCheckInterval: 300000,
    enablePushNotifications: false,
  } as PWAConfig,
};

const PWAContext = createContext<PWAContextType | undefined>(undefined);

interface PWAProviderProps {
  children: ReactNode;
  initialConfig?: PWAConfig;
}

function PWAProvider({ children, initialConfig = defaultConfig }: PWAProviderProps) {
  // Initialize config state directly with defaultConfig first
  const [config, setConfig] = useState<PWAConfig>(defaultConfig);

  // Load saved config from localStorage after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pwa-config');
      if (saved) {
        const parsedConfig = JSON.parse(saved);
        setConfig({ ...defaultConfig, ...parsedConfig });
      } else if (initialConfig !== defaultConfig) {
        setConfig(initialConfig);
      }
    } catch (error) {
      console.warn('Error loading PWA config from localStorage:', error);
      if (initialConfig !== defaultConfig) {
        setConfig(initialConfig);
      }
    }
  }, [initialConfig]);

  // Save config to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('pwa-config', JSON.stringify(config));
    } catch (error) {
      console.warn('Error saving PWA config to localStorage:', error);
    }
  }, [config]);

  const updateConfig = (newConfig: Partial<PWAConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const enableComponent = (component: keyof PWAConfig) => {
    setConfig(prev => ({ ...prev, [component]: true }));
  };

  const disableComponent = (component: keyof PWAConfig) => {
    setConfig(prev => ({ ...prev, [component]: false }));
  };

  const toggleComponent = (component: keyof PWAConfig) => {
    setConfig(prev => ({ ...prev, [component]: !prev[component] }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    try {
      localStorage.removeItem('pwa-config');
    } catch (error) {
      console.warn('Error removing PWA config from localStorage:', error);
    }
  };

  const isComponentEnabled = (component: keyof PWAConfig) => {
    return config[component] as boolean;
  };

  const contextValue: PWAContextType = {
    config,
    updateConfig,
    enableComponent,
    disableComponent,
    toggleComponent,
    resetConfig,
    isComponentEnabled,
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}
    </PWAContext.Provider>
  );
}

function usePWAConfig() {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWAConfig must be used within a PWAProvider');
  }
  return context;
}

function usePWAComponent(component: keyof PWAConfig) {
  const { isComponentEnabled } = usePWAConfig();
  return isComponentEnabled(component);
}

export { PWAProvider, usePWAConfig, usePWAComponent };
