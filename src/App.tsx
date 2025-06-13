
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PWAProvider, PWAPresets } from '@/contexts/PWAContext';
import { PWAUpdatePrompt } from '@/components/PWAUpdatePrompt';
import { Header } from '@/components/Layout/Header';
import { AppSidebar } from '@/components/AppSidebar';
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PWAProvider initialConfig={PWAPresets.production}>
        <TooltipProvider>
          <BrowserRouter>
            <SidebarProvider defaultOpen={false}>
              <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 text-foreground flex w-full">
                <AppSidebar />
                <SidebarInset className="flex-1">
                  <Header showMenuButton />
                  <main className="flex-1 p-4 bg-gradient-to-br from-background via-background/95 to-primary/10 backdrop-blur-sm">
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
                  
                  {/* PWA Update/Install Prompts */}
                  <PWAUpdatePrompt position="bottom" autoShow />
                  
                  {/* Toast notifications */}
                  <Toaster />
                  <Sonner />
                </SidebarInset>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </PWAProvider>
    </QueryClientProvider>
  );
}

export default App;
