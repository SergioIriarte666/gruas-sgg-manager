
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiciosReportesProps {
  showReports: boolean;
  estadisticas: any;
  formatCurrency: (amount: number) => string;
}

export function ServiciosReportes({ showReports, estadisticas, formatCurrency }: ServiciosReportesProps) {
  if (!showReports) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes y Estadísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{estadisticas?.serviciosFacturados || 0}</div>
            <div className="text-sm text-muted-foreground">Servicios Facturados</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {((estadisticas?.serviciosCerrados || 0) / (estadisticas?.totalServicios || 1) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Tasa de Finalización</div>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold text-blue-600">
              {formatCurrency((estadisticas?.ingresosTotales || 0) / (estadisticas?.totalServicios || 1))}
            </div>
            <div className="text-sm text-muted-foreground">Valor Promedio</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
