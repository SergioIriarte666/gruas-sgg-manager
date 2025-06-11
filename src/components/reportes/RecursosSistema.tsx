
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grua, Operador, Servicio } from "@/types";

interface RecursosSistemaProps {
  gruas: Grua[];
  operadores: Operador[];
  servicios: Servicio[];
  formatCurrency: (amount: number) => string;
}

export function RecursosSistema({ gruas, operadores, servicios, formatCurrency }: RecursosSistemaProps) {
  const gruasActivas = gruas.filter(g => g.activo).length;
  const operadoresActivos = operadores.filter(o => o.activo).length;
  const totalServicios = servicios.length;
  const ingresosTotales = servicios.reduce((acc, s) => acc + s.valor, 0);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Recursos del Sistema</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-blue-400 text-sm">Grúas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gruasActivas}</div>
            <div className="text-sm text-muted-foreground">
              de {gruas.length} registradas
            </div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground mb-1">Por tipo:</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Livianas:</span>
                  <span>{gruas.filter(g => g.tipo === 'Liviana' && g.activo).length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Medianas:</span>
                  <span>{gruas.filter(g => g.tipo === 'Mediana' && g.activo).length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Pesadas:</span>
                  <span>{gruas.filter(g => g.tipo === 'Pesada' && g.activo).length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-400 text-sm">Operadores Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operadoresActivos}</div>
            <div className="text-sm text-muted-foreground">
              de {operadores.length} registrados
            </div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">
                Capacidad de operación al {gruas.length > 0 ? ((operadoresActivos / gruas.length) * 100).toFixed(0) : 0}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardHeader>
            <CardTitle className="text-purple-400 text-sm">Promedio por Servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalServicios > 0 ? formatCurrency(ingresosTotales / totalServicios) : formatCurrency(0)}
            </div>
            <div className="text-sm text-muted-foreground">
              Valor promedio (global)
            </div>
            {servicios.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground">
                  Rango: {formatCurrency(Math.min(...servicios.map(s => s.valor)))} - {formatCurrency(Math.max(...servicios.map(s => s.valor)))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
