
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X } from "lucide-react";
import { formatSafeDate } from "@/lib/utils";
import { useUpdateServicioEstado } from "@/hooks/useUpdateServicioEstado";
import { useToast } from "@/hooks/use-toast";

interface ServicioDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicio: any;
}

export const ServicioDetailsModal = ({
  isOpen,
  onClose,
  servicio
}: ServicioDetailsModalProps) => {
  const updateServicioEstado = useUpdateServicioEstado();
  const { toast } = useToast();

  if (!servicio) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'en_curso':
        return 'bg-yellow-500';
      case 'cerrado':
        return 'bg-green-500';
      case 'facturado':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'en_curso':
        return 'En Curso';
      case 'cerrado':
        return 'Cerrado';
      case 'facturado':
        return 'Facturado';
      default:
        return estado;
    }
  };

  const handleFinalizarServicio = () => {
    if (servicio.estado === 'facturado') {
      toast({
        title: "No se puede modificar",
        description: "Este servicio ya está facturado y no se puede modificar.",
        variant: "destructive",
      });
      return;
    }

    updateServicioEstado.mutate({
      id: servicio.id,
      estado: 'cerrado'
    }, {
      onSuccess: () => {
        toast({
          title: "Servicio finalizado",
          description: "El servicio ha sido marcado como cerrado exitosamente.",
        });
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Detalles del Servicio - {servicio.folio}</span>
            <Badge className={getEstadoBadgeColor(servicio.estado)}>
              {getEstadoLabel(servicio.estado)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha</label>
                  <p className="font-medium">{formatSafeDate(servicio.fecha)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                  <p className="font-medium">{servicio.cliente?.razonSocial || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Servicio</label>
                  <p className="font-medium">{servicio.tipoServicio?.nombre || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valor</label>
                  <p className="font-bold text-lg text-primary">{formatCurrency(Number(servicio.valor))}</p>
                </div>
                {servicio.ordenCompra && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Orden de Compra</label>
                    <p className="font-medium">{servicio.ordenCompra}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información del Vehículo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Marca</label>
                  <p className="font-medium">{servicio.marcaVehiculo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Modelo</label>
                  <p className="font-medium">{servicio.modeloVehiculo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Patente</label>
                  <p className="font-medium">{servicio.patente}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ubicaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recorrido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Origen</label>
                  <p className="font-medium">{servicio.ubicacionOrigen}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Destino</label>
                  <p className="font-medium">{servicio.ubicacionDestino}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recursos Asignados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recursos Asignados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Grúa</label>
                  <p className="font-medium">{servicio.grua?.patente || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Operador</label>
                  <p className="font-medium">{servicio.operador?.nombreCompleto || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          {servicio.observaciones && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{servicio.observaciones}</p>
              </CardContent>
            </Card>
          )}

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
            {servicio.estado === 'en_curso' && (
              <Button 
                onClick={handleFinalizarServicio}
                disabled={updateServicioEstado.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {updateServicioEstado.isPending ? "Finalizando..." : "Finalizar Servicio"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
