
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, FileText, DollarSign, Eye, Download, CheckCircle } from "lucide-react";
import { formatSafeDate } from "@/lib/utils";
import { useCierres } from "@/hooks/useCierres";
import { useCreateFactura } from "@/hooks/useCreateFactura";
import { useClientes } from "@/hooks/useClientes";
import { useServicios } from "@/hooks/useServicios";
import { ServiciosSelectionModal } from "@/components/ServiciosSelectionModal";

export default function Cierres() {
  const [showServiciosModal, setShowServiciosModal] = useState(false);

  const { data: cierres = [], isLoading } = useCierres();
  const { data: clientes = [] } = useClientes();
  const { data: servicios = [] } = useServicios();
  const createFactura = useCreateFactura();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const handleCreateFactura = (cierreId: string) => {
    createFactura.mutate(cierreId);
  };

  // Servicios elegibles para cierre
  const serviciosElegibles = servicios.filter(s => 
    s.estado === 'cerrado' && !s.cierreId
  );

  // Estadísticas
  const totalCierres = cierres.length;
  const pendientesFacturar = cierres.filter(c => !c.facturado).length;
  const yaFacturados = cierres.filter(c => c.facturado).length;
  const valorTotal = cierres.reduce((sum, cierre) => sum + Number(cierre.total), 0);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Cargando cierres...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Cierres de Servicios</h1>
          <p className="text-muted-foreground">Generación de cierres para facturación</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary-dark"
          onClick={() => setShowServiciosModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Generar Nuevo Cierre
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary text-sm">Total Cierres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCierres}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-blue-400 text-sm">Pendientes Facturar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendientesFacturar}</div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-400 text-sm">Ya Facturados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yaFacturados}</div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-yellow-400 text-sm">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatCurrency(valorTotal)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Info de Servicios Elegibles */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-400">
            <Calendar className="h-5 w-5" />
            Servicios Disponibles para Cierre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-medium">
                {serviciosElegibles.length} servicios cerrados sin asignar a cierre
              </span>
              <p className="text-sm text-muted-foreground">
                Total disponible: {formatCurrency(serviciosElegibles.reduce((sum, s) => sum + Number(s.valor), 0))}
              </p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowServiciosModal(true)}
              disabled={serviciosElegibles.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Seleccionar Servicios
            </Button>
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
          {cierres.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay cierres generados aún. Crea tu primer cierre seleccionando servicios.
            </div>
          ) : (
            <div className="space-y-4">
              {cierres.map((cierre) => (
                <div key={cierre.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-medium text-primary">{cierre.folio}</h3>
                      <p className="text-sm text-muted-foreground">
                        Del {formatSafeDate(cierre.fecha_inicio)} al {formatSafeDate(cierre.fecha_fin)}
                        {cierre.clientes && ` • ${cierre.clientes.razon_social}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{formatCurrency(Number(cierre.total))}</div>
                        <div className="text-xs text-muted-foreground">Total</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                        {!cierre.facturado ? (
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleCreateFactura(cierre.id)}
                            disabled={createFactura.isPending}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Facturar
                          </Button>
                        ) : (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Facturado
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Selección de Servicios */}
      <ServiciosSelectionModal
        isOpen={showServiciosModal}
        onClose={() => setShowServiciosModal(false)}
      />
    </div>
  );
}
