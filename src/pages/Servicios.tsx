
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, CheckCircle, Filter } from "lucide-react";
import { useServicios } from "@/hooks/useServicios";
import { useUpdateServicioEstado } from "@/hooks/useUpdateServicioEstado";
import { FormularioServicio } from "@/components/FormularioServicio";
import { ServicioDetailsModal } from "@/components/ServicioDetailsModal";
import { ServiciosSelectionModal } from "@/components/ServiciosSelectionModal";
import { formatSafeDate } from "@/lib/utils";

export default function Servicios() {
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("");

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

  const filteredServicios = servicios.filter(servicio => {
    const matchesSearch = !searchTerm || 
      servicio.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.cliente?.razonSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.patente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = !estadoFilter || servicio.estado === estadoFilter;
    
    return matchesSearch && matchesEstado;
  });

  const handleFinalizarServicio = (servicioId: string) => {
    updateServicioEstado.mutate({
      id: servicioId,
      estado: 'cerrado'
    });
  };

  const handleViewServicio = (servicio: any) => {
    setSelectedServicio(servicio);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedServicio(null);
  };

  const handleFormSuccess = () => {
    setShowNewForm(false);
  };

  const handleFormCancel = () => {
    setShowNewForm(false);
  };

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
          <p className="text-muted-foreground">Gestión completa de servicios de grúa</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowSelectionModal(true)}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Filter className="h-4 w-4 mr-2" />
            Generar Cierre
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

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por folio, cliente o patente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              className="px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="en_curso">En Curso</option>
              <option value="cerrado">Cerrado</option>
              <option value="facturado">Facturado</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Servicios */}
      <Card>
        <CardHeader>
          <CardTitle>Servicios ({filteredServicios.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredServicios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || estadoFilter ? 
                "No se encontraron servicios con los filtros aplicados." :
                "No hay servicios registrados aún. ¡Crea tu primer servicio!"
              }
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServicios.map((servicio) => (
                <div key={servicio.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-primary">{servicio.folio}</h3>
                        <Badge className={getEstadoBadgeColor(servicio.estado)}>
                          {getEstadoLabel(servicio.estado)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground">
                        <p><strong>Cliente:</strong> {servicio.cliente?.razonSocial || 'N/A'}</p>
                        <p><strong>Fecha:</strong> {formatSafeDate(servicio.fecha)}</p>
                        <p><strong>Vehículo:</strong> {servicio.marcaVehiculo} {servicio.modeloVehiculo}</p>
                        <p><strong>Patente:</strong> {servicio.patente}</p>
                        <p><strong>Grúa:</strong> {servicio.grua?.patente || 'N/A'}</p>
                        <p><strong>Operador:</strong> {servicio.operador?.nombreCompleto || 'N/A'}</p>
                      </div>
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
                          onClick={() => handleViewServicio(servicio)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        {servicio.estado === 'en_curso' && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleFinalizarServicio(servicio.id)}
                            disabled={updateServicioEstado.isPending}
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
              <FormularioServicio onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles del Servicio */}
      <ServicioDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        servicio={selectedServicio}
      />

      {/* Modal de Selección para Cierres */}
      <ServiciosSelectionModal
        isOpen={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        servicios={servicios}
      />
    </div>
  );
}
