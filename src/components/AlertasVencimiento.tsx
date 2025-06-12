
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Calendar } from "lucide-react";
import { useVencimientos } from "@/hooks/useVencimientos";

export function AlertasVencimiento() {
  const { data: alertas = [], isLoading } = useVencimientos();

  if (isLoading || alertas.length === 0) {
    return null;
  }

  const alertasVencidas = alertas.filter(a => a.estado === 'vencido');
  const alertasProximas = alertas.filter(a => a.estado === 'proximo');

  return (
    <Card className="border-orange-500/30 bg-orange-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-400">
          <AlertTriangle className="h-5 w-5" />
          Alertas de Vencimiento
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alertasVencidas.length > 0 && (
          <Alert className="border-red-500/30 bg-red-500/10 mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Documentos Vencidos ({alertasVencidas.length})</AlertTitle>
            <AlertDescription>
              Hay documentos que ya han vencido y requieren renovación inmediata.
            </AlertDescription>
          </Alert>
        )}

        {alertasProximas.length > 0 && (
          <Alert className="border-yellow-500/30 bg-yellow-500/10 mb-4">
            <Clock className="h-4 w-4" />
            <AlertTitle>Próximos a Vencer ({alertasProximas.length})</AlertTitle>
            <AlertDescription>
              Documentos que vencen en los próximos 15 días.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {alertas.map((alerta) => (
            <div key={alerta.id} className="flex justify-between items-center p-3 bg-background/50 rounded border">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {alerta.tipo === 'operador' ? 'Operador' : 'Grúa'}
                  </Badge>
                  <span className="font-medium text-sm">{alerta.entidad}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {alerta.campo} - {alerta.fechaVencimiento.toLocaleDateString('es-CL')}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={alerta.estado === 'vencido' ? 'destructive' : 'default'}
                  className={alerta.estado === 'vencido' 
                    ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                    : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  {alerta.diasRestantes < 0 
                    ? `${Math.abs(alerta.diasRestantes)} días vencido`
                    : alerta.diasRestantes === 0 
                    ? 'Vence hoy'
                    : `${alerta.diasRestantes} días`
                  }
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
