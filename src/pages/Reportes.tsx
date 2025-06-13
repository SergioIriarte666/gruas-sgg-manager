
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3 } from "lucide-react";
import { 
  generateServiciosReport, 
  generateFinancialReport, 
  generateClientesReport, 
  generateDashboardReport 
} from "@/utils/reportGenerator";
import { ResumenEjecutivo } from "@/components/reportes/ResumenEjecutivo";
import { AnalisisDetallado } from "@/components/reportes/AnalisisDetallado";
import { TablaReporte } from "@/components/reportes/TablaReporte";
import { useSafeServicios } from "@/hooks/useSafeServicios";
import { useClientes } from "@/hooks/useClientes";
import { useGruas } from "@/hooks/useGruas";
import { useOperadores } from "@/hooks/useOperadores";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function ReportesLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white border border-gray-300 p-4">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportesContent() {
  const { toast } = useToast();

  // Use safe hooks to prevent context errors
  const { data: servicios = [], isLoading: serviciosLoading } = useSafeServicios();
  const { data: clientes = [], isLoading: clientesLoading } = useClientes();
  const { data: gruas = [], isLoading: gruasLoading } = useGruas();
  const { data: operadores = [], isLoading: operadoresLoading } = useOperadores();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const handleExportReport = (type: 'servicios' | 'financiero' | 'clientes' | 'dashboard') => {
    try {
      let doc;
      let filename;
      
      switch (type) {
        case 'servicios':
          doc = generateServiciosReport(servicios);
          filename = `reporte-servicios-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        case 'financiero':
          doc = generateFinancialReport(servicios);
          filename = `reporte-financiero-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        case 'clientes':
          doc = generateClientesReport(clientes, servicios);
          filename = `reporte-clientes-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        case 'dashboard':
          doc = generateDashboardReport(servicios, clientes, gruas, operadores);
          filename = `dashboard-ejecutivo-${new Date().toISOString().split('T')[0]}.pdf`;
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }
      
      doc.save(filename);
      
      toast({
        title: "Reporte generado",
        description: `El reporte se ha descargado exitosamente como ${filename}`,
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el reporte. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  // Datos para la tabla de servicios recientes
  const serviciosRecientes = servicios
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 15)
    .map(servicio => [
      servicio.folio,
      new Date(servicio.fecha).toLocaleDateString('es-CL'),
      servicio.cliente?.razonSocial || 'N/A',
      servicio.estado,
      servicio.valor
    ]);

  if (serviciosLoading || clientesLoading || gruasLoading || operadoresLoading) {
    return <ReportesLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header corporativo */}
        <div className="bg-white border border-gray-300 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                SISTEMA DE REPORTES Y ESTADÍSTICAS
              </h1>
              <p className="text-sm text-gray-600">
                Dashboard Corporativo - SGG Gestión de Grúas
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportReport('dashboard')}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Excel
              </Button>
              <Button 
                size="sm"
                onClick={() => handleExportReport('dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generar PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs corporativas */}
        <Tabs defaultValue="resumen" className="space-y-6">
          <TabsList className="bg-white border border-gray-300 p-1">
            <TabsTrigger 
              value="resumen" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Resumen Ejecutivo
            </TabsTrigger>
            <TabsTrigger 
              value="detallado"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Análisis Detallado
            </TabsTrigger>
            <TabsTrigger 
              value="servicios"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Registro de Servicios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="space-y-6">
            <ResumenEjecutivo 
              servicios={servicios}
              clientes={clientes}
              gruas={gruas}
              operadores={operadores}
              formatCurrency={formatCurrency}
            />
          </TabsContent>

          <TabsContent value="detallado" className="space-y-6">
            <AnalisisDetallado 
              servicios={servicios}
              clientes={clientes}
              formatCurrency={formatCurrency}
            />
          </TabsContent>

          <TabsContent value="servicios" className="space-y-6">
            <div className="bg-white border border-gray-300 p-4">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2">
                REGISTRO COMPLETO DE SERVICIOS
              </h2>
            </div>
            
            <TablaReporte
              title="SERVICIOS RECIENTES (ÚLTIMOS 15)"
              headers={['Folio', 'Fecha', 'Cliente', 'Estado', 'Valor ($)']}
              data={serviciosRecientes}
            />

            <div className="bg-white border border-gray-300 p-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Mostrando {serviciosRecientes.length} de {servicios.length} servicios totales
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExportReport('servicios')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Servicios
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExportReport('financiero')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Reporte Financiero
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExportReport('clientes')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Reporte Clientes
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Reportes() {
  const [isContextReady, setIsContextReady] = useState(false);
  
  useEffect(() => {
    // Use a more robust check for QueryClient context
    const checkContext = () => {
      try {
        // Try to access the QueryClient context directly
        const queryClient = useQueryClient();
        if (queryClient) {
          console.log('QueryClient context is available');
          setIsContextReady(true);
          return true;
        }
      } catch (error) {
        console.log('QueryClient context not ready:', error);
        return false;
      }
      return false;
    };

    // Try immediately
    if (!checkContext()) {
      // If not ready, wait a bit and try again
      const timer = setTimeout(() => {
        setIsContextReady(true); // Force ready after timeout
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isContextReady) {
    return <ReportesLoadingSkeleton />;
  }

  return <ReportesContent />;
}
