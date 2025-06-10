
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, FileText, DollarSign } from "lucide-react";

export default function Cierres() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Cierres de Servicios</h1>
          <p className="text-muted-foreground">Generación de cierres para facturación</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cierre
        </Button>
      </div>

      {/* Filtros para Nuevo Cierre */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Generar Nuevo Cierre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fecha Inicio</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fecha Fin</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cliente (Opcional)</label>
              <select className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Todos los clientes</option>
                <option value="1">Transportes López S.A.</option>
                <option value="2">Constructora San Miguel Ltda.</option>
                <option value="3">Rent a Car Premium</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-primary hover:bg-primary-dark">
                Generar Vista Previa
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Cierres Existentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Cierres Generados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Cierre Example 1 */}
            <div className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-medium text-primary">Cierre C001-2024</h3>
                  <p className="text-sm text-muted-foreground">
                    Del 01/06/2024 al 07/06/2024 • Transportes López S.A.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 servicios incluidos
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{formatCurrency(205000)}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Ver</Button>
                    <Button size="sm" variant="outline">PDF</Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Facturar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cierre Example 2 */}
            <div className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-medium text-primary">Cierre C002-2024</h3>
                  <p className="text-sm text-muted-foreground">
                    Del 08/06/2024 al 14/06/2024 • Todos los clientes
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    5 servicios incluidos
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{formatCurrency(340000)}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Ver</Button>
                    <Button size="sm" variant="outline">PDF</Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled>
                      Facturado
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center py-8 text-muted-foreground">
            {/* Placeholder cuando no hay cierres */}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de Cierres */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary text-sm">Total Cierres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-blue-400 text-sm">Pendientes Facturar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-400 text-sm">Ya Facturados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-yellow-400 text-sm">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(545000)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
