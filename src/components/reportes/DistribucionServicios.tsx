
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Clock, FileText, DollarSign } from "lucide-react";
import { Servicio } from "@/types";

interface DistribucionServiciosProps {
  servicios: Servicio[];
}

export function DistribucionServicios({ servicios }: DistribucionServiciosProps) {
  const totalServicios = servicios.length;
  const serviciosEnCurso = servicios.filter(s => s.estado === 'en_curso').length;
  const serviciosCerrados = servicios.filter(s => s.estado === 'cerrado').length;
  const serviciosFacturados = servicios.filter(s => s.estado === 'facturado').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Distribución de Servicios por Estado (Global)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalServicios === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No hay servicios registrados aún
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  En Curso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{serviciosEnCurso}</div>
                <div className="text-sm text-muted-foreground">
                  {((serviciosEnCurso / totalServicios) * 100).toFixed(1)}% del total
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(serviciosEnCurso / totalServicios) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Cerrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{serviciosCerrados}</div>
                <div className="text-sm text-muted-foreground">
                  {((serviciosCerrados / totalServicios) * 100).toFixed(1)}% del total
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(serviciosCerrados / totalServicios) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Facturados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{serviciosFacturados}</div>
                <div className="text-sm text-muted-foreground">
                  {((serviciosFacturados / totalServicios) * 100).toFixed(1)}% del total
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(serviciosFacturados / totalServicios) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
