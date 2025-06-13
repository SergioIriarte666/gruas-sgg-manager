
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Edit, CheckCircle } from "lucide-react";
import { formatSafeDate } from "@/lib/utils";

interface ServiciosListaProps {
  serviciosFiltrados: any[];
  searchTerm: string;
  statusFilter: string;
  formatCurrency: (amount: number) => string;
  getEstadoBadgeColor: (estado: string) => string;
  getEstadoLabel: (estado: string) => string;
  onViewServicio: (servicio: any) => void;
  onEditServicio: (servicio: any) => void;
  onFinalizarServicio: (servicioId: string) => void;
  updateServicioEstadoPending: boolean;
}

export function ServiciosLista({ 
  serviciosFiltrados,
  searchTerm,
  statusFilter,
  formatCurrency,
  getEstadoBadgeColor,
  getEstadoLabel,
  onViewServicio,
  onEditServicio,
  onFinalizarServicio,
  updateServicioEstadoPending
}: ServiciosListaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Lista de Servicios ({serviciosFiltrados.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {serviciosFiltrados.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm || statusFilter !== "all" 
              ? "No hay servicios que coincidan con los filtros."
              : "No hay servicios registrados aún. ¡Crea tu primer servicio!"
            }
          </div>
        ) : (
          <div className="space-y-4">
            {serviciosFiltrados.map((servicio) => (
              <div key={servicio.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-primary">{servicio.folio}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadgeColor(servicio.estado)}`}>
                        {getEstadoLabel(servicio.estado)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Cliente:</strong> {servicio.cliente?.razonSocial || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Vehículo:</strong> {servicio.marcaVehiculo} {servicio.modeloVehiculo} - {servicio.patente}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Fecha:</strong> {formatSafeDate(servicio.fecha)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{formatCurrency(Number(servicio.valor))}</div>
                      <div className="text-xs text-muted-foreground">Valor</div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onViewServicio(servicio)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onEditServicio(servicio)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {servicio.estado === 'en_curso' && (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => onFinalizarServicio(servicio.id)}
                          disabled={updateServicioEstadoPending}
                        >
                          <CheckCircle className="h-3 w-3" />
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
  );
}
