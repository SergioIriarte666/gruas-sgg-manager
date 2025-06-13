
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  generateServiciosReport, 
  generateFinancialReport, 
  generateClientesReport, 
  generateDashboardReport 
} from "@/utils/reportGenerator";
import { ReportesHeader } from "@/components/reportes/ReportesHeader";
import { EstadisticasPeriodo } from "@/components/reportes/EstadisticasPeriodo";
import { EstadisticasGlobales } from "@/components/reportes/EstadisticasGlobales";
import { DistribucionServicios } from "@/components/reportes/DistribucionServicios";
import { IngresosPorCliente } from "@/components/reportes/IngresosPorCliente";
import { RecursosSistema } from "@/components/reportes/RecursosSistema";
import { AccionesReportes } from "@/components/reportes/AccionesReportes";
import { useServicios } from "@/hooks/useServicios";
import { useClientes } from "@/hooks/useClientes";
import { useGruas } from "@/hooks/useGruas";
import { useOperadores } from "@/hooks/useOperadores";

export default function Reportes() {
  const { toast } = useToast();

  const { data: servicios = [], isLoading: serviciosLoading } = useServicios();
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

  if (serviciosLoading || clientesLoading || gruasLoading || operadoresLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Reportes y Estadísticas</h1>
            <p className="text-muted-foreground">Cargando datos...</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ReportesHeader onExportDashboard={() => handleExportReport('dashboard')} />
      
      <EstadisticasPeriodo servicios={servicios} formatCurrency={formatCurrency} />
      
      <EstadisticasGlobales 
        servicios={servicios} 
        clientes={clientes} 
        formatCurrency={formatCurrency} 
      />
      
      <DistribucionServicios servicios={servicios} />
      
      <IngresosPorCliente 
        servicios={servicios} 
        clientes={clientes} 
        formatCurrency={formatCurrency} 
      />
      
      <RecursosSistema 
        gruas={gruas} 
        operadores={operadores} 
        servicios={servicios} 
        formatCurrency={formatCurrency} 
      />
      
      <AccionesReportes onExportReport={handleExportReport} />
    </div>
  );
}
