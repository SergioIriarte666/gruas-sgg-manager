import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Pages
import Index from "./pages/Index";
import Clientes from "./pages/Clientes";
import Gruas from "./pages/Gruas";
import Operadores from "./pages/Operadores";
import TiposServicio from "./pages/TiposServicio";
import Cierres from "./pages/Cierres";
import Facturas from "./pages/Facturas";
import Reportes from "./pages/Reportes";
import Migraciones from "./pages/Migraciones";
import MigracionNueva from "./pages/MigracionNueva";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();
const App = () => <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1">
              <div className="p-4 bg-inherit">
                <SidebarTrigger className="mb-4" />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/clientes" element={<Clientes />} />
                  <Route path="/gruas" element={<Gruas />} />
                  <Route path="/operadores" element={<Operadores />} />
                  <Route path="/tipos-servicio" element={<TiposServicio />} />
                  <Route path="/cierres" element={<Cierres />} />
                  <Route path="/facturas" element={<Facturas />} />
                  <Route path="/reportes" element={<Reportes />} />
                  <Route path="/migraciones" element={<Migraciones />} />
                  <Route path="/migraciones/nueva" element={<MigracionNueva />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>;
export default App;
