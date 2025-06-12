
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, DollarSign, CheckCircle, Eye, Clock } from "lucide-react";
import { formatSafeDate } from "@/lib/utils";
import { useCreateCierre } from "@/hooks/useCierres";
import { useClientes } from "@/hooks/useClientes";
import { useServicios } from "@/hooks/useServicios";
import { useUpdateServicioEstado } from "@/hooks/useUpdateServicioEstado";

interface ServiciosSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServiciosSelectionModal = ({
  isOpen,
  onClose
}: ServiciosSelectionModalProps) => {
  const [selectedServicios, setSelectedServicios] = useState<string[]>([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [clienteId, setClienteId] = useState("");

  const { data: clientes = [] } = useClientes();
  const { data: servicios = [] } = useServicios();
  const createCierre = useCreateCierre();
  const updateServicioEstado = useUpdateServicioEstado();

  // Filtrar servicios elegibles (cerrados sin cierre asignado O en curso)
  const serviciosElegibles = servicios.filter(servicio => {
    console.log('Evaluando servicio:', servicio.id, 'Estado:', servicio.estado, 'CierreId:', servicio.cierreId);
    
    // Debe estar cerrado sin cierre asignado O en curso
    const isElegible = (servicio.estado === 'cerrado' && !servicio.cierreId) || 
                      (servicio.estado === 'en_curso');
    
    if (!isElegible) {
      return false;
    }
    
    // Filtros adicionales
    if (fechaInicio || fechaFin || clienteId) {
      const servicioFecha = new Date(servicio.fecha).toISOString().split('T')[0];
      
      if (fechaInicio && servicioFecha < fechaInicio) return false;
      if (fechaFin && servicioFecha > fechaFin) return false;
      if (clienteId && servicio.clienteId !== clienteId) return false;
    }
    
    return true;
  });

  console.log('Servicios elegibles encontrados:', serviciosElegibles.length);

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

  const handleFinalizarYCrearCierre = async () => {
    if (selectedServicios.length === 0) return;

    const serviciosSeleccionados = serviciosElegibles.filter(s => selectedServicios.includes(s.id));
    
    // Primero, finalizar todos los servicios que están en curso
    const serviciosEnCurso = serviciosSeleccionados.filter(s => s.estado === 'en_curso');
    
    console.log(`Finalizando ${serviciosEnCurso.length} servicios en curso...`);
    
    try {
      // Finalizar servicios en curso uno por uno
      for (const servicio of serviciosEnCurso) {
        await new Promise<void>((resolve, reject) => {
          updateServicioEstado.mutate(
            { id: servicio.id, estado: 'cerrado' },
            {
              onSuccess: () => resolve(),
              onError: (error) => reject(error)
            }
          );
        });
      }

      // Pequeña pausa para que la base de datos se actualice
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Ahora crear el cierre
      const total = serviciosSeleccionados.reduce((sum, s) => sum + Number(s.valor), 0);

      // Determinar fechas del cierre
      const servicioFechas = serviciosSeleccionados.map(s => new Date(s.fecha).toISOString().split('T')[0]);
      const minFecha = fechaInicio || servicioFechas.sort()[0];
      const maxFecha = fechaFin || servicioFechas.sort().reverse()[0];

      console.log('Creando cierre con datos:', {
        fechaInicio: minFecha,
        fechaFin: maxFecha,
        clienteId: clienteId || undefined,
        servicioIds: selectedServicios,
        total
      });

      createCierre.mutate({
        fechaInicio: minFecha,
        fechaFin: maxFecha,
        clienteId: clienteId || undefined,
        servicioIds: selectedServicios,
        total
      }, {
        onSuccess: () => {
          setSelectedServicios([]);
          setFechaInicio("");
          setFechaFin("");
          setClienteId("");
          onClose();
        },
        onError: (error) => {
          console.error('Error al crear cierre desde modal:', error);
        }
      });

    } catch (error) {
      console.error('Error al finalizar servicios:', error);
    }
  };

  const totalSeleccionado = serviciosElegibles
    .filter(s => selectedServicios.includes(s.id))
    .reduce((sum, s) => sum + Number(s.valor), 0);

  const serviciosEnCursoSeleccionados = serviciosElegibles
    .filter(s => selectedServicios.includes(s.id) && s.estado === 'en_curso').length;

  // Reset selections when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedServicios([]);
      setFechaInicio("");
      setFechaFin("");
      setClienteId("");
    }
  }, [isOpen]);

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
                {serviciosElegibles.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedServicios.length === serviciosElegibles.length ? "Deseleccionar Todo" : "Seleccionar Todo"}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {serviciosElegibles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay servicios elegibles para cierre. Los servicios deben estar en estado "En Curso" o "Cerrado" sin cierre asignado.
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
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-primary">{servicio.folio}</h3>
                                {servicio.estado === 'en_curso' ? (
                                  <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                    <Clock className="h-3 w-3" />
                                    En Curso
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                    <CheckCircle className="h-3 w-3" />
                                    Cerrado
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {formatSafeDate(servicio.fecha)} - {servicio.cliente?.razonSocial || 'Cliente no encontrado'}
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
                      {serviciosEnCursoSeleccionados > 0 && (
                        <span className="text-sm text-muted-foreground ml-2">
                          ({serviciosEnCursoSeleccionados} se finalizarán automáticamente)
                        </span>
                      )}
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
              onClick={handleFinalizarYCrearCierre}
              disabled={createCierre.isPending || updateServicioEstado.isPending || selectedServicios.length === 0}
              className="bg-primary hover:bg-primary-dark"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {createCierre.isPending || updateServicioEstado.isPending ? "Procesando..." : 
               serviciosEnCursoSeleccionados > 0 ? "Finalizar y Crear Cierre" : "Crear Cierre"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
