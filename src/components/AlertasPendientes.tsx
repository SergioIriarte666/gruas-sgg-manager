

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock } from "lucide-react";
import { mockServicios } from "@/lib/mockData";

export function AlertasPendientes() {
  // Simular servicios pendientes de facturación (más de 30 días)
  const serviciosPendientes = mockServicios.filter(s => {
    const diasTranscurridos = (new Date().getTime() - s.createdAt.getTime()) / (24 * 60 * 60 * 1000);
    
    return (
      s.estado === 'en_curso' && 
      diasTranscurridos > 30 &&
      diasTranscurridos < 365 // Filtrar servicios muy antiguos (probablemente datos de prueba)
    );
  });

  // No mostrar el componente si no hay servicios pendientes válidos
  if (serviciosPendientes.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-500/30 bg-orange-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-400">
          <AlertTriangle className="h-5 w-5" />
          Servicios Pendientes de Facturación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="border-orange-500/30 bg-orange-500/10">
          <Clock className="h-4 w-4" />
          <AlertTitle>Atención Requerida</AlertTitle>
          <AlertDescription>
            Hay {serviciosPendientes.length} servicio(s) sin facturar después de 30 días.
            Revisar para proceder con la facturación correspondiente.
          </AlertDescription>
        </Alert>
        
        <div className="mt-4 space-y-2">
          {serviciosPendientes.map((servicio) => (
            <div key={servicio.id} className="flex justify-between items-center p-2 bg-background/50 rounded">
              <div>
                <span className="font-medium">{servicio.folio}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  {servicio.cliente?.razonSocial}
                </span>
              </div>
              <span className="text-sm text-orange-400">
                {Math.floor((new Date().getTime() - servicio.createdAt.getTime()) / (24 * 60 * 60 * 1000))} días
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

