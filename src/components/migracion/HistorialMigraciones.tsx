
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { HistorialMigracion } from '@/types/migracion';

interface HistorialMigracionesProps {
  historial: HistorialMigracion[];
}

export const HistorialMigraciones: React.FC<HistorialMigracionesProps> = ({ historial }) => {
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'completada':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Completada</Badge>;
      case 'fallida':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Fallida</Badge>;
      case 'en_proceso':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">En Proceso</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getIcono = (estado: string) => {
    switch (estado) {
      case 'completada':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'fallida':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'en_proceso':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historial de Migraciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        {historial.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No hay migraciones registradas
          </div>
        ) : (
          <div className="space-y-4">
            {historial.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {getIcono(item.estado)}
                  <div>
                    <div className="font-medium">{item.archivo}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.fecha.toLocaleDateString('es-CL')} • {item.servicios} servicios
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {getEstadoBadge(item.estado)}
                  <div className="text-sm text-muted-foreground mt-1">
                    {item.exitos} éxitos • {item.errores} errores
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
