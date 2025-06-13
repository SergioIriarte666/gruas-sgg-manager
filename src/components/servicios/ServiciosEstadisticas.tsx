
import { EstadisticasCard } from "@/components/EstadisticasCard";
import { FileText, Calendar, CheckCircle, Truck } from "lucide-react";

interface ServiciosEstadisticasProps {
  estadisticas: any;
  formatCurrency: (amount: number) => string;
}

export function ServiciosEstadisticas({ estadisticas, formatCurrency }: ServiciosEstadisticasProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <EstadisticasCard
        title="Total Servicios"
        value={estadisticas?.totalServicios || 0}
        icon={FileText}
      />
      <EstadisticasCard
        title="En Curso"
        value={estadisticas?.serviciosEnCurso || 0}
        icon={Calendar}
      />
      <EstadisticasCard
        title="Finalizados"
        value={estadisticas?.serviciosCerrados || 0}
        icon={CheckCircle}
      />
      <EstadisticasCard
        title="Ingresos Total"
        value={formatCurrency(estadisticas?.ingresosTotales || 0)}
        icon={Truck}
      />
    </div>
  );
}
