
import { useToast } from "@/hooks/use-toast";
import { 
  generateServiciosReport, 
  generateFinancialReport, 
  generateClientesReport, 
  generateDashboardReport 
} from "@/utils/reportGenerator";
import { Servicio, Cliente, Grua, Operador } from "@/types";

export const useReportExport = (
  servicios: Servicio[],
  clientes: Cliente[],
  gruas: Grua[],
  operadores: Operador[]
) => {
  const { toast } = useToast();

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

  return { handleExportReport };
};
