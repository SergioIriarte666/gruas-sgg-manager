
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { MigracionEstadisticas } from '@/types/migracion';

interface EstadisticasCardsProps {
  estadisticas: MigracionEstadisticas;
}

export const EstadisticasCards: React.FC<EstadisticasCardsProps> = ({ estadisticas }) => {
  const tasaExito = estadisticas.serviciosProcesados > 0 
    ? ((estadisticas.exitos / estadisticas.serviciosProcesados) * 100).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-400 flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Total Migraciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.totalMigraciones}</div>
          <p className="text-xs text-muted-foreground">
            Última: {estadisticas.ultimaMigracion}
          </p>
        </CardContent>
      </Card>

      <Card className="border-green-500/30 bg-green-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Servicios Procesados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.serviciosProcesados.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {estadisticas.exitos.toLocaleString()} exitosos
          </p>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-yellow-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Errores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.errores}</div>
          <p className="text-xs text-muted-foreground">
            En todas las migraciones
          </p>
        </CardContent>
      </Card>

      <Card className="border-purple-500/30 bg-purple-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-400 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tasa de Éxito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tasaExito}%</div>
          <p className="text-xs text-muted-foreground">
            Promedio general
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
