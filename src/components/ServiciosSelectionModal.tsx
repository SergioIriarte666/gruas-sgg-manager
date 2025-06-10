
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, DollarSign, CheckCircle } from "lucide-react";
import { formatSafeDate } from "@/lib/utils";
import { useCreateCierre } from "@/hooks/useCierres";
import { useClientes } from "@/hooks/useClientes";

interface ServiciosSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicios: any[];
}

export const ServiciosSelectionModal = ({
  isOpen,
  onClose,
  servicios
}: ServiciosSelectionModalProps) => {
  const [selectedServicios, setSelectedServicios] = useState<string[]>([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [clienteId, setClienteId] = useState("");

  const { data: clientes = [] } = useClientes();
  const createCierre = useCreateCierre();

  // Filtrar servicios cerrados sin cierre asignado
  const serviciosElegibles = servicios.filter(s => 
    s.estado === 'cerrado' && !s.cierreId &&
    (!fechaInicio || s.fecha >= fechaInicio) &&
    (!fechaFin || s.fecha <= fechaFin) &&
    (!clienteId || s.clienteId === clienteId)
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const handleSelectServicio = (servicioId: string, checked: boolean) => {
    if (checked) {
      setSelectedServicios(prev => [...prev, servicioId]);
    } else {
      setSelectedServicios(prev => prev.filter(id => id !== servicioId));
    }
  };

  const handleSelectAll = () => {
    if (selectedServicios.length === serviciosElegibles.length) {
      setSelectedServicios([]);
    } else {
      setSelectedServicios(serviciosElegibles.map(s => s.id));
    }
  };

  const handleCreateCierre = () => {
    if (selectedServicios.length === 0) return;

    const serviciosSeleccionados = serviciosElegibles.filter(s => selectedServicios.includes(s.id));
    const total = serviciosSeleccionados.reduce((sum, s) => sum + Number(s.valor), 0);

    // Convert dates properly to strings
    const servicioFechas = serviciosSeleccionados.map(s => s.fecha);
    const minFecha = fechaInicio || servicioFechas.sort()[0];
    const maxFecha = fechaFin || servicioFechas.sort().reverse()[0];

    createCierre.mutate({
      fechaInicio: String(minFecha),
      fechaFin: String(maxFecha),
      clienteId: clienteId || undefined,
      serviciosIds: selectedServicios,
      total
    }, {
      onSuccess: () => {
        setSelectedServicios([]);
        setFechaInicio("");
        setFechaFin("");
        setClienteId("");
        onClose();
      }
    });
  };

  const totalSeleccionado = serviciosElegibles
    .filter(s => selectedServicios.includes(s.id))
    .reduce((sum, s) => sum + Number(s.valor), 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Seleccionar Servicios para Cierre
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium mb-2">Cliente</label>
                  <select 
                    className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                  >
                    <option value="">Todos los clientes</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.razonSocial}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Servicios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Servicios Elegibles ({serviciosElegibles.length})</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedServicios.length === serviciosElegibles.length ? "Deseleccionar Todo" : "Seleccionar Todo"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {serviciosElegibles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay servicios elegibles para cierre. Los servicios deben estar en estado "Cerrado" y sin cierre asignado.
                  </div>
                ) : (
                  serviciosElegibles.map((servicio) => (
                    <div key={servicio.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedServicios.includes(servicio.id)}
                          onCheckedChange={(checked) => handleSelectServicio(servicio.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-primary">{servicio.folio}</h3>
                              <p className="text-sm text-muted-foreground">
                                {formatSafeDate(servicio.fecha)} - {servicio.cliente?.razonSocial}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {servicio.marcaVehiculo} {servicio.modeloVehiculo} - {servicio.patente}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {servicio.ubicacionOrigen} → {servicio.ubicacionDestino}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">{formatCurrency(Number(servicio.valor))}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resumen de Selección */}
          {selectedServicios.length > 0 && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="font-medium">
                      {selectedServicios.length} servicios seleccionados
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(totalSeleccionado)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateCierre}
              disabled={createCierre.isPending || selectedServicios.length === 0}
              className="bg-primary hover:bg-primary-dark"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {createCierre.isPending ? "Creando..." : "Crear Cierre"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
