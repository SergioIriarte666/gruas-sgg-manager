
import { useState } from "react";
import { useSafeServicios, useSafeEstadisticasServicios } from "@/hooks/useSafeServicios";
import { useSafeUpdateServicioEstado } from "@/hooks/useSafeUpdateServicioEstado";
import { useReactReady } from "@/hooks/useSafeHooks";
import { ServiciosHeader } from "@/components/servicios/ServiciosHeader";
import { ServiciosEstadisticas } from "@/components/servicios/ServiciosEstadisticas";
import { ServiciosReportes } from "@/components/servicios/ServiciosReportes";
import { ServiciosFiltros } from "@/components/servicios/ServiciosFiltros";
import { ServiciosLista } from "@/components/servicios/ServiciosLista";
import { ServiciosModales } from "@/components/servicios/ServiciosModales";

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

  // Show loading state
  if (serviciosLoading || estadisticasLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Cargando servicios...</div>
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
      Fecha: servicio.fecha,
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

  return (
    <div className="space-y-6 animate-fade-in">
      <ServiciosHeader
        showReports={showReports}
        onToggleReports={() => setShowReports(!showReports)}
        onExportServices={handleExportServices}
        onNewService={() => setShowNewForm(true)}
      />

      <ServiciosEstadisticas
        estadisticas={estadisticas}
        formatCurrency={formatCurrency}
      />

      <ServiciosReportes
        showReports={showReports}
        estadisticas={estadisticas}
        formatCurrency={formatCurrency}
      />

      <ServiciosFiltros
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
      />

      <ServiciosLista
        serviciosFiltrados={serviciosFiltrados}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        formatCurrency={formatCurrency}
        getEstadoBadgeColor={getEstadoBadgeColor}
        getEstadoLabel={getEstadoLabel}
        onViewServicio={handleViewServicio}
        onEditServicio={handleEditServicio}
        onFinalizarServicio={handleFinalizarServicio}
        updateServicioEstadoPending={updateServicioEstado.isPending}
      />

      <ServiciosModales
        showNewForm={showNewForm}
        showEditForm={showEditForm}
        selectedServicio={selectedServicio}
        isModalOpen={isModalOpen}
        onFormSuccess={handleFormSuccess}
        onFormCancel={handleFormCancel}
        onCloseModal={handleCloseModal}
      />
    </div>
  );
}
