
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Header } from '@/components/Layout/Header';
import { AppSidebar } from '@/components/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { ContextErrorBoundary } from '@/components/ContextErrorBoundary';
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

console.log("App.tsx: Creating QueryClient...");
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log("App: Rendering...");
  
  return (
    <ContextErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
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
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </ContextErrorBoundary>
  );
}

export default App;
