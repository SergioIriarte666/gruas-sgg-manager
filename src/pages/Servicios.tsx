
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Eye, Edit, CheckCircle, Package } from "lucide-react";
import { formatSafeDate } from "@/lib/utils";
import { useServicios } from "@/hooks/useServicios";
import { useUpdateServicioEstado } from "@/hooks/useUpdateServicioEstado";
import { ServicioDetailsModal } from "@/components/ServicioDetailsModal";
import { ServiciosSelectionModal } from "@/components/ServiciosSelectionModal";
import { FormularioServicio } from "@/components/FormularioServicio";

export default function Servicios() {
  const [selectedServicio, setSelectedServicio] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  const { data: servicios = [], isLoading } = useServicios();
  const updateServicioEstado = useUpdateServicioEstado();

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

  const handleViewServicio = (servicio: any) => {
    setSelectedServicio(servicio);
    setIsDetailsModalOpen(true);
  };

  const handleFinalizarServicio = (servicioId: string) => {
    updateServicioEstado.mutate({
      id: servicioId,
      estado: 'cerrado'
    });
  };

  const handleFormSuccess = () => {
    setShowNewForm(false);
  };

  // Estadísticas
  const serviciosEnCurso = servicios.filter(s => s.estado === 'en_curso').length;
  const serviciosCerrados = servicios.filter(s => s.estado === 'cerrado').length;
  const serviciosFacturados = servicios.filter(s => s.estado === 'facturado').length;
  const serviciosElegiblesParaCierre = servicios.filter(s => s.estado === 'cerrado' && !s.cierreId).length;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Cargando servicios...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Servicios</h1>
          <p className="text-muted-foreground">Gestión de servicios de grúa</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsSelectionModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={serviciosElegiblesParaCierre === 0}
          >
            <Package className="h-4 w-4 mr-2" />
            Generar Cierre ({serviciosElegiblesParaCierre})
          </Button>
          <Button 
            onClick={() => setShowNewForm(true)}
            className="bg-primary hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Servicio
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary text-sm">Total Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicios.length}</div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-yellow-400 text-sm">En Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviciosEnCurso}</div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-400 text-sm">Cerrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviciosCerrados}</div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-blue-400 text-sm">Facturados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serviciosFacturados}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Servicios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lista de Servicios
          </CardTitle>
        </CardHeader>
        <CardContent>
          {servicios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay servicios registrados aún. ¡Crea tu primer servicio!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-medium text-muted-foreground">Folio</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Fecha</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Vehículo</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Valor</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Estado</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {servicios.map((servicio) => (
                    <tr key={servicio.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium text-primary">{servicio.folio}</td>
                      <td className="p-3">{formatSafeDate(servicio.fecha)}</td>
                      <td className="p-3">{servicio.cliente?.razonSocial || 'N/A'}</td>
                      <td className="p-3">
                        {servicio.marcaVehiculo} {servicio.modeloVehiculo} - {servicio.patente}
                      </td>
                      <td className="p-3 font-medium">{formatCurrency(Number(servicio.valor))}</td>
                      <td className="p-3">
                        <Badge className={getEstadoBadgeColor(servicio.estado)}>
                          {getEstadoLabel(servicio.estado)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-2"
                            onClick={() => handleViewServicio(servicio)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 px-2">
                            <Edit className="h-3 w-3" />
                          </Button>
                          {servicio.estado === 'en_curso' && (
                            <Button 
                              size="sm" 
                              className="h-8 px-2 bg-green-600 hover:bg-green-700"
                              onClick={() => handleFinalizarServicio(servicio.id)}
                              disabled={updateServicioEstado.isPending}
                            >
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
          )}
        </CardContent>
      </Card>

      {/* Modal de Nuevo Servicio */}
      {showNewForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Nuevo Servicio</h2>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  Cancelar
                </Button>
              </div>
              <FormularioServicio onSuccess={handleFormSuccess} />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles del Servicio */}
      <ServicioDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedServicio(null);
        }}
        servicio={selectedServicio}
      />

      {/* Modal de Selección para Cierre */}
      <ServiciosSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        servicios={servicios}
      />
    </div>
  );
}
