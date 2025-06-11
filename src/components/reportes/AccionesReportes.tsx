
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, DollarSign, Users, BarChart3 } from "lucide-react";

interface AccionesReportesProps {
  onExportReport: (type: 'servicios' | 'financiero' | 'clientes' | 'dashboard') => void;
}

export function AccionesReportes({ onExportReport }: AccionesReportesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar Reportes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-16 flex-col"
            onClick={() => onExportReport('servicios')}
          >
            <FileText className="h-6 w-6 mb-2" />
            Reporte de Servicios
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col"
            onClick={() => onExportReport('financiero')}
          >
            <DollarSign className="h-6 w-6 mb-2" />
            Reporte Financiero
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col"
            onClick={() => onExportReport('clientes')}
          >
            <Users className="h-6 w-6 mb-2" />
            Reporte de Clientes
          </Button>
          <Button 
            variant="outline" 
            className="h-16 flex-col"
            onClick={() => onExportReport('dashboard')}
          >
            <BarChart3 className="h-6 w-6 mb-2" />
            Dashboard Ejecutivo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
