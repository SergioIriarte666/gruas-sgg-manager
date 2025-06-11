
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { Servicio, Cliente } from "@/types";

interface IngresosPorClienteProps {
  servicios: Servicio[];
  clientes: Cliente[];
  formatCurrency: (amount: number) => string;
}

export function IngresosPorCliente({ servicios, clientes, formatCurrency }: IngresosPorClienteProps) {
  const ingresosTotales = servicios.reduce((acc, s) => acc + s.valor, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Ingresos por Cliente (Global)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {servicios.length === 0 || clientes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No hay datos de ingresos por cliente
          </div>
        ) : (
          <div className="space-y-4">
            {clientes.map((cliente) => {
              const serviciosCliente = servicios.filter(s => s.clienteId === cliente.id);
              const ingresoCliente = serviciosCliente.reduce((acc, s) => acc + s.valor, 0);
              const porcentajeIngreso = ingresosTotales > 0 ? (ingresoCliente / ingresosTotales) * 100 : 0;
              
              return (
                <div key={cliente.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                  <div>
                    <div className="font-medium">{cliente.razonSocial}</div>
                    <div className="text-sm text-muted-foreground">
                      {serviciosCliente.length} servicio(s)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{formatCurrency(ingresoCliente)}</div>
                    <div className="text-sm text-muted-foreground">
                      {porcentajeIngreso.toFixed(1)}% del total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
