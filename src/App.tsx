
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PWAProvider, PWAPresets } from '@/contexts/PWAContext';
import { Header } from '@/components/Layout/Header';
import { AppSidebar } from '@/components/AppSidebar';
import { SafeToaster } from '@/components/ui/safe-toaster';
import SafeAppWrapper from '@/components/SafeAppWrapper';
import Index from "./pages/Index";
import Gruas from "./pages/Gruas";
import Clientes from "./pages/Clientes";
import Operadores from "./pages/Operadores";
import Servicios from "./pages/Servicios";
import Facturas from "./pages/Facturas";
import Cierres from "./pages/Cierres";
import TiposServicio from "./pages/TiposServicio";
import Reportes from "./pages/Reportes";
import Settings from "./pages/Settings";
import MigracionNueva from "./pages/MigracionNueva";
import Migraciones from "./pages/Migraciones";
import NotFound from "./pages/NotFound";
import SGGGruaPWA from "./components/SGGGruaPWA";

console.log("App.tsx: Creating QueryClient...");
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
console.log("App.tsx: QueryClient created:", queryClient);

function AppContent() {
  console.log("AppContent: Rendering...");
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen bg-black text-primary flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header showMenuButton />
          <main className="flex-1 p-4 bg-black">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/gruas" element={<Gruas />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/operadores" element={<Operadores />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/facturas" element={<Facturas />} />
              <Route path="/cierres" element={<Cierres />} />
              <Route path="/tipos-servicio" element={<TiposServicio />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/migracion-nueva" element={<MigracionNueva />} />
              <Route path="/migraciones" element={<Migraciones />} />
              <Route path="/pwa-grua" element={<SGGGruaPWA />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
      
      {/* Safe Toast notifications - moved outside SidebarInset to avoid conflicts */}
      <SafeToaster />
    </SidebarProvider>
  );
}

function App() {
  console.log("App: Rendering...");
  
  return (
    <SafeAppWrapper>
      <QueryClientProvider client={queryClient}>
        <PWAProvider initialConfig={PWAPresets.production}>
          <TooltipProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </PWAProvider>
      </QueryClientProvider>
    </SafeAppWrapper>
  );
}

export default App;
