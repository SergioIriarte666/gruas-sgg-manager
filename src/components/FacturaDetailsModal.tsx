
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatSafeDate } from "@/lib/utils";

interface FacturaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  factura: any;
}

export function FacturaDetailsModal({ isOpen, onClose, factura }: FacturaDetailsModalProps) {
  if (!factura) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles de Factura - {factura.folio}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Cliente</h3>
              <p className="font-medium">{factura.cliente}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Estado</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                ${factura.estado === 'pagada' ? 'bg-green-100 text-green-800' : 
                  factura.estado === 'vencida' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'}
              `}>
                {factura.estado === 'pagada' ? 'Pagada' : 
                 factura.estado === 'vencida' ? 'Vencida' : 'Pendiente'}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Fecha Emisión</h3>
              <p>{formatSafeDate(factura.fecha)}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Fecha Vencimiento</h3>
              <p>{formatSafeDate(factura.fechaVencimiento)}</p>
            </div>
            {factura.fechaPago && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Fecha Pago</h3>
                <p>{formatSafeDate(factura.fechaPago)}</p>
              </div>
            )}
          </div>

          {/* Amounts */}
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">{formatCurrency(factura.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA (19%):</span>
              <span className="font-medium">{formatCurrency(factura.iva)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{formatCurrency(factura.total)}</span>
            </div>
          </div>

          {/* Payment status info */}
          {factura.estado === 'pendiente' && factura.diasVencimiento < 0 && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-800 text-sm">
                Esta factura está vencida por {Math.abs(factura.diasVencimiento)} días.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
