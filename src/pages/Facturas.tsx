
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EstadoBadge } from "@/components/EstadoBadge";
import { Plus, FileText, DollarSign, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Facturas() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  // Mock data para facturas
  const facturas = [
    {
      id: 1,
      folio: 'F001-2024',
      fecha: new Date('2024-06-01'),
      fechaVencimiento: new Date('2024-07-01'),
      cliente: 'Transportes López S.A.',
      subtotal: 172269,
      iva: 32731,
      total: 205000,
      estado: 'pendiente' as const,
      diasVencimiento: 9
    },
    {
      id: 2,
      folio: 'F002-2024',
      fecha: new Date('2024-05-15'),
      fechaVencimiento: new Date('2024-06-14'),
      cliente: 'Constructora San Miguel Ltda.',
      subtotal: 285714,
      iva: 54286,
      total: 340000,
      estado: 'vencida' as const,
      diasVencimiento: -4,
      fechaPago: null
    },
    {
      id: 3,
      folio: 'F003-2024',
      fecha: new Date('2024-05-20'),
      fechaVencimiento: new Date('2024-06-19'),
      cliente: 'Rent a Car Premium',
      subtotal: 71429,
      iva: 13571,
      total: 85000,
      estado: 'pagada' as const,
      fechaPago: new Date('2024-06-15')
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Facturas</h1>
          <p className="text-muted-foreground">Gestión de facturación y pagos</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Factura
        </Button>
      </div>

      {/* Alertas de Facturas Vencidas */}
      <Card className="border-red-500/30 bg-red-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Facturas Vencidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {facturas.filter(f => f.estado === 'vencida').map((factura) => (
              <div key={factura.id} className="flex justify-between items-center p-3 bg-background/50 rounded border border-red-500/20">
                <div>
                  <span className="font-medium text-red-400">{factura.folio}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {factura.cliente}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-red-400">{formatCurrency(factura.total)}</div>
                  <div className="text-xs text-red-400">
                    {Math.abs(factura.diasVencimiento)} días vencida
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Facturas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lista de Facturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-muted-foreground">Folio</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Fecha</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Subtotal</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">IVA</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Total</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Vencimiento</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Estado</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((factura) => (
                  <tr key={factura.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-primary">{factura.folio}</td>
                    <td className="p-3">
                      {format(factura.fecha, "dd/MM/yyyy", { locale: es })}
                    </td>
                    <td className="p-3">{factura.cliente}</td>
                    <td className="p-3">{formatCurrency(factura.subtotal)}</td>
                    <td className="p-3">{formatCurrency(factura.iva)}</td>
                    <td className="p-3 font-medium">{formatCurrency(factura.total)}</td>
                    <td className="p-3">
                      <div>
                        {format(factura.fechaVencimiento, "dd/MM/yyyy", { locale: es })}
                        {factura.estado === 'pendiente' && (
                          <div className="text-xs text-muted-foreground">
                            {factura.diasVencimiento > 0 ? `${factura.diasVencimiento} días` : 'Vence hoy'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <EstadoBadge estado={factura.estado} />
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          Ver
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          PDF
                        </Button>
                        {factura.estado === 'pendiente' && (
                          <Button size="sm" className="h-8 px-2 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Gestión de Pagos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Gestión de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {facturas.filter(f => f.estado === 'pendiente').map((factura) => (
              <div key={factura.id} className="border border-border rounded-lg p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-medium text-primary">{factura.folio}</h3>
                    <p className="text-sm text-muted-foreground">{factura.cliente}</p>
                    <p className="text-lg font-bold mt-1">{formatCurrency(factura.total)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Fecha de Pago</label>
                      <input
                        type="date"
                        className="px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        defaultValue={format(new Date(), "yyyy-MM-dd")}
                      />
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700 mt-6">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Pagada
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de Facturación */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary text-sm">Total Facturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facturas.length}</div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/30 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="text-orange-400 text-sm">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {facturas.filter(f => f.estado === 'pendiente').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/30 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-400 text-sm">Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {facturas.filter(f => f.estado === 'vencida').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-400 text-sm">Recaudado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {formatCurrency(facturas.filter(f => f.estado === 'pagada').reduce((acc, f) => acc + f.total, 0))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
