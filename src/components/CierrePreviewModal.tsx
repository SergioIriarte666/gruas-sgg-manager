
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, DollarSign } from "lucide-react";
import { formatSafeDate } from "@/lib/utils";

interface ServicioElegible {
  id: string;
  fecha: string;
  folio: string;
  valor: number;
  marca_vehiculo: string;
  modelo_vehiculo: string;
  patente: string;
  ubicacion_origen: string;
  ubicacion_destino: string;
  clientes: {
    razon_social: string;
  };
  gruas: {
    patente: string;
  };
  operadores: {
    nombre_completo: string;
  };
  tipos_servicio: {
    nombre: string;
  };
}

interface CierrePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicios: ServicioElegible[];
  fechaInicio: string;
  fechaFin: string;
  clienteNombre?: string;
  onConfirm: () => void;
  isCreating: boolean;
}

export const CierrePreviewModal = ({
  isOpen,
  onClose,
  servicios,
  fechaInicio,
  fechaFin,
  clienteNombre,
  onConfirm,
  isCreating
}: CierrePreviewModalProps) => {
  const total = servicios.reduce((sum, servicio) => sum + Number(servicio.valor), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Vista Previa del Cierre
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Cierre */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Cierre</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Período</label>
                  <p className="font-medium">
                    {formatSafeDate(fechaInicio)} - {formatSafeDate(fechaFin)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                  <p className="font-medium">{clienteNombre || "Todos los clientes"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Servicios Incluidos</label>
                  <p className="font-medium">{servicios.length}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total</label>
                  <p className="font-bold text-lg text-primary">{formatCurrency(total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Servicios */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Servicios a Incluir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {servicios.map((servicio) => (
                  <div key={servicio.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary">{servicio.folio}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatSafeDate(servicio.fecha)}
                          </span>
                        </div>
                        <p className="text-sm">
                          <strong>Vehículo:</strong> {servicio.marca_vehiculo} {servicio.modelo_vehiculo} - {servicio.patente}
                        </p>
                        <p className="text-sm">
                          <strong>Recorrido:</strong> {servicio.ubicacion_origen} → {servicio.ubicacion_destino}
                        </p>
                        <p className="text-sm">
                          <strong>Tipo:</strong> {servicio.tipos_servicio.nombre} | 
                          <strong> Grúa:</strong> {servicio.gruas.patente} | 
                          <strong> Operador:</strong> {servicio.operadores.nombre_completo}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatCurrency(Number(servicio.valor))}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumen Total */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span className="font-medium">Total del Cierre:</span>
                </div>
                <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={onConfirm} 
              disabled={isCreating || servicios.length === 0}
              className="bg-primary hover:bg-primary-dark"
            >
              {isCreating ? "Creando..." : "Crear Cierre"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
