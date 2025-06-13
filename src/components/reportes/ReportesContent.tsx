
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3 } from "lucide-react";
import { ResumenEjecutivo } from "@/components/reportes/ResumenEjecutivo";
import { AnalisisDetallado } from "@/components/reportes/AnalisisDetallado";
import { TablaReporte } from "@/components/reportes/TablaReporte";
import { useServicios } from "@/hooks/useServicios";
import { useClientes } from "@/hooks/useClientes";
import { useGruas } from "@/hooks/useGruas";
import { useOperadores } from "@/hooks/useOperadores";
import { useReportExport } from "@/hooks/useReportExport";
import { ReportesLoadingSkeleton } from "@/components/reportes/ReportesLoadingSkeleton";

export function ReportesContent() {
  console.log('ReportesContent: Starting to render...');
  
  const { data: servicios = [], isLoading: serviciosLoading, error: serviciosError } = useServicios();
  const { data: clientes = [], isLoading: clientesLoading, error: clientesError } = useClientes();
  const { data: gruas = [], isLoading: gruasLoading, error: gruasError } = useGruas();
  const { data: operadores = [], isLoading: operadoresLoading, error: operadoresError } = useOperadores();

  const { handleExportReport } = useReportExport(servicios, clientes, gruas, operadores);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
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

  // Mostrar loading si los datos están cargando
  if (serviciosLoading || clientesLoading || gruasLoading || operadoresLoading) {
    console.log('ReportesContent: Data loading, showing skeleton...');
    return <ReportesLoadingSkeleton />;
  }

  // Verificar errores
  if (serviciosError || clientesError || gruasError || operadoresError) {
    console.error('ReportesContent: Error loading data:', { serviciosError, clientesError, gruasError, operadoresError });
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Error al cargar datos</h3>
          <p className="text-sm text-muted-foreground mb-4">
            No se pudieron cargar los datos necesarios para generar los reportes
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  console.log('ReportesContent: All ready, rendering main content');

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
