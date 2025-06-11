
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BarChart3 } from "lucide-react";
import { Servicio } from "@/types";

interface EstadisticasPeriodoProps {
  servicios: Servicio[];
  formatCurrency: (amount: number) => string;
}

export function EstadisticasPeriodo({ servicios, formatCurrency }: EstadisticasPeriodoProps) {
  // Calcular estadísticas de la semana actual
  const inicioSemana = new Date();
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
  inicioSemana.setHours(0, 0, 0, 0);
  
  const serviciosSemana = servicios.filter(s => s.fecha >= inicioSemana);
  const totalServiciosSemana = serviciosSemana.length;
  const ingresosSemana = serviciosSemana.reduce((acc, s) => acc + s.valor, 0);

  // Calcular estadísticas del mes actual
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);
  
  const serviciosMes = servicios.filter(s => s.fecha >= inicioMes);
  const totalServiciosMes = serviciosMes.length;
  const ingresosMes = serviciosMes.reduce((acc, s) => acc + s.valor, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Esta Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold">{totalServiciosSemana}</div>
              <div className="text-sm text-muted-foreground">Servicios</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{formatCurrency(ingresosSemana)}</div>
              <div className="text-sm text-muted-foreground">Ingresos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-500/30 bg-purple-500/5">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Este Mes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold">{totalServiciosMes}</div>
              <div className="text-sm text-muted-foreground">Servicios</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{formatCurrency(ingresosMes)}</div>
              <div className="text-sm text-muted-foreground">Ingresos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
