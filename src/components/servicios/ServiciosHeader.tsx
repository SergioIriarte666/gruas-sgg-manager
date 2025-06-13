
import { Button } from "@/components/ui/button";
import { Plus, Download, BarChart3 } from "lucide-react";

interface ServiciosHeaderProps {
  showReports: boolean;
  onToggleReports: () => void;
  onExportServices: () => void;
  onNewService: () => void;
}

export function ServiciosHeader({ 
  showReports, 
  onToggleReports, 
  onExportServices, 
  onNewService 
}: ServiciosHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-primary">Servicios</h1>
        <p className="text-muted-foreground">Gestión completa de servicios de grúa</p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={onToggleReports}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Reportes
        </Button>
        <Button 
          variant="outline"
          onClick={onExportServices}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
        <Button 
          onClick={onNewService}
          className="bg-primary hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>
    </div>
  );
}
