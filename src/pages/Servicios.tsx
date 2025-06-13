import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Truck, Users, FileText, Calendar, CheckCircle, Eye, Edit, Download, BarChart3 } from "lucide-react";
import { EstadisticasCard } from "@/components/EstadisticasCard";
import { FormularioServicio } from "@/components/FormularioServicio";
import { ServicioDetailsModal } from "@/components/ServicioDetailsModal";
import { useSafeServicios, useSafeEstadisticasServicios } from "@/hooks/useSafeServicios";
import { useSafeUpdateServicioEstado } from "@/hooks/useSafeUpdateServicioEstado";
import { formatSafeDate } from "@/lib/utils";
import { useReactReady } from "@/hooks/useSafeHooks";

export default function Servicios() {
  const isReactReady = useReactReady();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewForm, setShowNewForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const { data: servicios = [], isLoading: serviciosLoading, isError: serviciosError } = useSafeServicios();
  const { data: estadisticas, isLoading: estadisticasLoading } = useSafeEstadisticasServicios();
  const updateServicioEstado = useSafeUpdateServicioEstado();

  // Show loading state if React is not ready
  if (!isReactReady) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Inicializando servicios...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (serviciosError) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-destructive">Error al cargar servicios. Por favor, intenta de nuevo.</div>
        </div>
      </div>
    );
  }

  // Filtrar servicios según búsqueda y estado
  const serviciosFiltrados = servicios.filter(servicio => {
    const matchesSearch = 
      servicio.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.cliente?.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.patente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || servicio.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'en_curso':
        return 'bg-yellow-500 text-yellow-900';
      case 'cerrado':
        return 'bg-green-500 text-green-900';
      case 'facturado':
        return 'bg-blue-500 text-blue-900';
      default:
        return 'bg-gray-500 text-gray-900';
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

  const handleFinalizarServicio = (servicioId: string) => {
    if (isReactReady) {
      updateServicioEstado.mutate({
        id: servicioId,
        estado: 'cerrado'
      });
    }
  };

  const handleViewServicio = (servicio: any) => {
    setSelectedServicio(servicio);
    setIsModalOpen(true);
  };

  const handleEditServicio = (servicio: any) => {
    setSelectedServicio(servicio);
    setShowEditForm(true);
  };

  const handleExportServices = () => {
    // Crear CSV de servicios
    const csvData = serviciosFiltrados.map(servicio => ({
      Folio: servicio.folio,
      Fecha: formatSafeDate(servicio.fecha),
      Cliente: servicio.cliente?.razonSocial || 'N/A',
      Vehiculo: `${servicio.marcaVehiculo} ${servicio.modeloVehiculo}`,
      Patente: servicio.patente,
      Origen: servicio.ubicacionOrigen,
      Destino: servicio.ubicacionDestino,
      Estado: getEstadoLabel(servicio.estado),
      Valor: servicio.valor
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `servicios_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedServicio(null);
  };

  const handleFormSuccess = () => {
    setShowNewForm(false);
    setShowEditForm(false);
    setSelectedServicio(null);
  };

  const handleFormCancel = () => {
    setShowNewForm(false);
    setShowEditForm(false);
    setSelectedServicio(null);
  };

  if (serviciosLoading || estadisticasLoading) {
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
            variant="outline"
            onClick={() => setShowReports(!showReports)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Reportes
          </Button>
          <Button 
            variant="outline"
            onClick={handleExportServices}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
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

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EstadisticasCard
          title="Total Servicios"
          value={estadisticas?.totalServicios || 0}
          icon={FileText}
        />
        <EstadisticasCard
          title="En Curso"
          value={estadisticas?.serviciosEnCurso || 0}
          icon={Calendar}
        />
        <EstadisticasCard
          title="Finalizados"
          value={estadisticas?.serviciosCerrados || 0}
          icon={CheckCircle}
        />
        <EstadisticasCard
          title="Ingresos Total"
          value={formatCurrency(estadisticas?.ingresosTotales || 0)}
          icon={Truck}
        />
      </div>

      {/* Reportes Section */}
      {showReports && (
        <Card>
          <CardHeader>
            <CardTitle>Reportes y Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{estadisticas?.serviciosFacturados || 0}</div>
                <div className="text-sm text-muted-foreground">Servicios Facturados</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {((estadisticas?.serviciosCerrados || 0) / (estadisticas?.totalServicios || 1) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Tasa de Finalización</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency((estadisticas?.ingresosTotales || 0) / (estadisticas?.totalServicios || 1))}
                </div>
                <div className="text-sm text-muted-foreground">Valor Promedio</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros y Búsqueda */}
      <Card>
        <CardContent className="pt-6">
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todos los estados</option>
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
                          onClick={() => handleViewServicio(servicio)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditServicio(servicio)}
                        >
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
                <Button variant="outline" onClick={handleFormCancel}>
                  Cancelar
                </Button>
              </div>
              <FormularioServicio onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Servicio */}
      {showEditForm && selectedServicio && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Editar Servicio</h2>
                <Button variant="outline" onClick={handleFormCancel}>
                  Cancelar
                </Button>
              </div>
              <FormularioServicio 
                servicio={selectedServicio}
                onSuccess={handleFormSuccess} 
                onCancel={handleFormCancel} 
              />
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
    </div>
  );
}
