
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EstadisticasCard } from "@/components/EstadisticasCard";
import { AlertasPendientes } from "@/components/AlertasPendientes";
import { FormularioServicio } from "@/components/FormularioServicio";
import { ServicioDetailsModal } from "@/components/ServicioDetailsModal";
import { 
  Plus, 
  Eye, 
  Edit, 
  CheckCircle,
  Truck,
  Users,
  ClipboardList,
  Calendar
} from "lucide-react";
import { formatSafeDate } from "@/lib/utils";
import { useServicios, useUpdateServicio } from "@/hooks/useServicios";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const [showFormulario, setShowFormulario] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: servicios = [], isLoading } = useServicios();
  const updateServicio = useUpdateServicio();
  const { toast } = useToast();

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
    setIsModalOpen(true);
  };

  const handleEditServicio = (servicio: any) => {
    // Por ahora, abrir el modal de detalles
    setSelectedServicio(servicio);
    setIsModalOpen(true);
  };

  const handleFinalizarServicio = (servicioId: string) => {
    const servicio = servicios.find(s => s.id === servicioId);
    if (servicio?.estado === 'facturado') {
      toast({
        title: "No se puede modificar",
        description: "Este servicio ya está facturado y no se puede modificar.",
        variant: "destructive",
      });
      return;
    }

    updateServicio.mutate({
      id: servicioId,
      estado: 'cerrado'
    }, {
      onSuccess: () => {
        toast({
          title: "Servicio finalizado",
          description: "El servicio ha sido marcado como cerrado exitosamente.",
        });
      }
    });
  };

  // Servicios recientes (últimos 10)
  const serviciosRecientes = servicios.slice(0, 10);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Sistema de Gestión de Grúas</h1>
          <p className="text-muted-foreground">Panel de control principal</p>
        </div>
        <Button onClick={() => setShowFormulario(true)} className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Estadísticas Cards */}
      <EstadisticasCard />

      {/* Alertas Pendientes */}
      <AlertasPendientes />

      {/* Servicios Recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Servicios Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {serviciosRecientes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay servicios registrados aún.
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
                  {serviciosRecientes.map((servicio) => (
                    <tr key={servicio.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium text-primary">{servicio.folio}</td>
                      <td className="p-3">
                        {formatSafeDate(servicio.fecha)}
                      </td>
                      <td className="p-3">{servicio.clientes?.razon_social || 'N/A'}</td>
                      <td className="p-3">
                        {servicio.marca_vehiculo} {servicio.modelo_vehiculo} - {servicio.patente}
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
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-2"
                            onClick={() => handleEditServicio(servicio)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          {servicio.estado === 'en_curso' && (
                            <Button 
                              size="sm" 
                              className="h-8 px-2 bg-green-600 hover:bg-green-700"
                              onClick={() => handleFinalizarServicio(servicio.id)}
                              disabled={updateServicio.isPending}
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

      {/* Formulario Modal */}
      {showFormulario && (
        <FormularioServicio 
          onClose={() => setShowFormulario(false)}
          onSuccess={() => setShowFormulario(false)}
        />
      )}

      {/* Modal de Detalles */}
      <ServicioDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        servicio={selectedServicio}
      />
    </div>
  );
}
