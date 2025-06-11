
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

interface ReportesHeaderProps {
  onExportDashboard: () => void;
}

export function ReportesHeader({ onExportDashboard }: ReportesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-primary">Reportes y Estadísticas</h1>
        <p className="text-muted-foreground">Dashboard ejecutivo y reportes del sistema</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExportDashboard}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Datos
        </Button>
        <Button className="bg-primary hover:bg-primary-dark text-white" onClick={onExportDashboard}>
          <Eye className="h-4 w-4 mr-2" />
          Generar Reporte
        </Button>
      </div>
    </div>
  );
}
