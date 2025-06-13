
import { Card, CardContent } from "@/components/ui/card";

interface MetricaProps {
  label: string;
  value: string | number;
  tipo: 'moneda' | 'numero' | 'porcentaje';
  variacion?: number;
}

interface MetricasCorporativasProps {
  metricas: MetricaProps[];
  titulo: string;
}

export function MetricasCorporativas({ metricas, titulo }: MetricasCorporativasProps) {
  const formatValue = (value: string | number, tipo: MetricaProps['tipo']) => {
    if (typeof value === 'number') {
      switch (tipo) {
        case 'moneda':
          return `$${value.toLocaleString('es-CL')}`;
        case 'porcentaje':
          return `${value}%`;
        default:
          return value.toLocaleString('es-CL');
      }
    }
    return value;
  };

  return (
    <Card className="bg-white border border-gray-300 shadow-sm">
      <CardContent className="p-0">
        <div className="bg-gray-50 border-b border-gray-300 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">{titulo}</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {metricas.map((metrica, index) => (
            <div 
              key={index}
              className="border-r border-gray-200 last:border-r-0 p-4 text-center"
            >
              <div className="text-lg font-bold font-mono text-gray-900">
                {formatValue(metrica.value, metrica.tipo)}
              </div>
              <div className="text-xs text-gray-600 mt-1 font-medium">
                {metrica.label}
              </div>
              {metrica.variacion !== undefined && (
                <div className={`text-xs mt-1 ${metrica.variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrica.variacion > 0 ? '+' : ''}{metrica.variacion}%
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
