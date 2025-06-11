
import { EstadisticasCard } from "@/components/EstadisticasCard";
import { FileText, DollarSign, Users, TrendingUp } from "lucide-react";
import { Servicio, Cliente } from "@/types";

interface EstadisticasGlobalesProps {
  servicios: Servicio[];
  clientes: Cliente[];
  formatCurrency: (amount: number) => string;
}

export function EstadisticasGlobales({ servicios, clientes, formatCurrency }: EstadisticasGlobalesProps) {
  const totalServicios = servicios.length;
  const serviciosFacturados = servicios.filter(s => s.estado === 'facturado').length;
  const ingresosTotales = servicios.reduce((acc, s) => acc + s.valor, 0);
  const clientesActivos = clientes.filter(c => c.activo).length;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Estadísticas Globales (Todo el historial)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EstadisticasCard
          title="Total Servicios"
          value={totalServicios}
          icon={FileText}
          className="border-primary/30 bg-primary/5"
        />
        <EstadisticasCard
          title="Ingresos Totales"
          value={formatCurrency(ingresosTotales)}
          icon={DollarSign}
          className="border-green-500/30 bg-green-500/5"
        />
        <EstadisticasCard
          title="Clientes Activos"
          value={clientesActivos}
          icon={Users}
          className="border-blue-500/30 bg-blue-500/5"
        />
        <EstadisticasCard
          title="Eficiencia"
          value={totalServicios > 0 ? `${Math.round((serviciosFacturados / totalServicios) * 100)}%` : "0%"}
          icon={TrendingUp}
          className="border-yellow-500/30 bg-yellow-500/5"
        />
      </div>
    </div>
  );
}
