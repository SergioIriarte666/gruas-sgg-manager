
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface ProcesamientoEstado {
  iniciado: boolean;
  completado: boolean;
  progreso: number;
  procesados: number;
  exitos: number;
  errores: number;
  registroActual?: string;
  resultados?: Array<{ exito: boolean; error?: string; folio?: string }>;
}

interface ProcesamientoEstadoProps {
  estado: ProcesamientoEstado;
  totalRegistros: number;
}

export const ProcesamientoEstadoCard: React.FC<ProcesamientoEstadoProps> = ({
  estado,
  totalRegistros
}) => {
  const getIcon = () => {
    if (!estado.iniciado) return <Play className="h-5 w-5" />;
    if (estado.completado) return <CheckCircle className="h-5 w-5 text-green-400" />;
    return <Clock className="h-5 w-5 text-yellow-400" />;
  };

  const getTitle = () => {
    if (!estado.iniciado) return 'Listo para Procesar';
    if (estado.completado) return 'Migración Completada';
    return 'Procesando Migración';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon()}
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Información previa al procesamiento */}
          {!estado.iniciado && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Datos a procesar:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• {totalRegistros} registros de servicios</li>
                    <li>• Validación de datos completa</li>
                    <li>• Creación real en base de datos</li>
                    <li>• Verificación de integridad</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Proceso a ejecutar:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Creación de registros de servicios</li>
                    <li>• Asignación de folios automáticos</li>
                    <li>• Validación de referencias (clientes, grúas, etc.)</li>
                    <li>• Actualización de estadísticas</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-400">Importante</div>
                    <div className="text-sm text-muted-foreground">
                      Este proceso creará servicios reales en la base de datos. Asegúrate de que los datos son correctos.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progreso del procesamiento */}
          {estado.iniciado && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso general</span>
                  <span>{estado.progreso}%</span>
                </div>
                <Progress value={estado.progreso} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <div className="text-lg font-bold">{estado.procesados}</div>
                  <div className="text-xs text-muted-foreground">Procesados</div>
                </div>
                <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="text-lg font-bold text-green-400">{estado.exitos}</div>
                  <div className="text-xs text-muted-foreground">Éxitos</div>
                </div>
                <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                  <div className="text-lg font-bold text-red-400">{estado.errores}</div>
                  <div className="text-xs text-muted-foreground">Errores</div>
                </div>
              </div>

              {estado.registroActual && !estado.completado && (
                <div className="text-center p-2 bg-muted/20 rounded border">
                  <div className="text-sm text-muted-foreground">Procesando:</div>
                  <div className="font-medium">{estado.registroActual}</div>
                </div>
              )}
            </div>
          )}

          {/* Resultados finales */}
          {estado.completado && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                estado.errores === 0 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-yellow-500/10 border-yellow-500/30'
              }`}>
                <div className={`flex items-center gap-2 ${
                  estado.errores === 0 ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">
                    {estado.errores === 0 
                      ? 'Migración completada exitosamente' 
                      : 'Migración completada con errores'
                    }
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Se crearon {estado.exitos} servicios de {totalRegistros} registros procesados.
                  {estado.errores > 0 && ` ${estado.errores} registros fallaron.`}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="text-xl font-bold text-green-400">{estado.exitos}</div>
                  <div className="text-sm text-muted-foreground">Servicios Creados</div>
                </div>
                <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                  <div className="text-xl font-bold text-red-400">{estado.errores}</div>
                  <div className="text-sm text-muted-foreground">Errores</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
