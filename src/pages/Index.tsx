
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Truck, Users, FileText, Calendar, CheckCircle, Eye, Edit, FileSpreadsheet } from "lucide-react";
import { EstadisticasCard } from "@/components/EstadisticasCard";
import { AlertasPendientes } from "@/components/AlertasPendientes";
import { FormularioServicio } from "@/components/FormularioServicio";
import { ServicioDetailsModal } from "@/components/ServicioDetailsModal";
import { useServicios, useEstadisticasServicios } from "@/hooks/useServicios";
import { useUpdateServicioEstado } from "@/hooks/useUpdateServicioEstado";
import { formatSafeDate } from "@/lib/utils";
import { useReactReady } from "@/hooks/useSafeHooks";

function IndexContent() {
  const [showNewForm, setShowNewForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: servicios = [], isLoading } = useServicios();
  const { data: estadisticas } = useEstadisticasServicios();
  const updateServicioEstado = useUpdateServicioEstado();

  const serviciosRecientes = servicios.slice(0, 5);

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
    updateServicioEstado.mutate({
      id: servicioId,
      estado: 'cerrado'
    });
  };

  const handleViewServicio = (servicio: any) => {
    setSelectedServicio(servicio);
    setIsModalOpen(true);
  };

  const handleEditServicio = (servicio: any) => {
    setSelectedServicio(servicio);
    setShowEditForm(true);
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

  const handleExportExcel = () => {
    const excelData = serviciosRecientes.map(servicio => ({
      'Folio': servicio.folio,
      'Fecha': formatSafeDate(servicio.fecha),
      'Cliente': servicio.cliente?.razonSocial || 'N/A',
      'Vehículo': `${servicio.marcaVehiculo} ${servicio.modeloVehiculo}`,
      'Patente': servicio.patente,
      'Valor': servicio.valor,
      'Estado': getEstadoLabel(servicio.estado)
    }));

    const headers = Object.keys(excelData[0]);
    const csvContent = [
      headers.join('\t'),
      ...excelData.map(row => Object.values(row).join('\t'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `servicios_recientes_${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Cargando dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
            <p className="text-muted-foreground">Resumen de tu sistema de gestión de grúas</p>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => setShowNewForm(true)}
                  className="bg-primary hover:bg-primary-dark"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Servicio
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Crear un nuevo servicio de grúa</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <EstadisticasCard
                  title="Total Servicios"
                  value={estadisticas?.totalServicios || 0}
                  icon={FileText}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total de servicios registrados en el sistema</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <EstadisticasCard
                  title="En Curso"
                  value={estadisticas?.serviciosEnCurso || 0}
                  icon={Calendar}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Servicios que están actualmente en progreso</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <EstadisticasCard
                  title="Finalizados"
                  value={estadisticas?.serviciosCerrados || 0}
                  icon={CheckCircle}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Servicios completados y listos para facturar</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <EstadisticasCard
                  title="Ingresos Total"
                  value={formatCurrency(estadisticas?.ingresosTotales || 0)}
                  icon={Truck}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ingresos totales generados por todos los servicios</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Alertas Pendientes */}
        <AlertasPendientes />

        {/* Servicios Recientes */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Servicios Recientes
              </CardTitle>
              {serviciosRecientes.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleExportExcel}
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Exportar servicios recientes a Excel</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {serviciosRecientes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay servicios registrados aún. ¡Crea tu primer servicio!
              </div>
            ) : (
              <div className="space-y-4">
                {serviciosRecientes.map((servicio) => (
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewServicio(servicio)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ver detalles del servicio</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditServicio(servicio)}
                                disabled={servicio.estado === 'facturado'}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{servicio.estado === 'facturado' ? 'No se puede editar (facturado)' : 'Editar servicio'}</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          {servicio.estado === 'en_curso' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleFinalizarServicio(servicio.id)}
                                  disabled={updateServicioEstado.isPending}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Finalizar servicio</p>
                              </TooltipContent>
                            </Tooltip>
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

        {/* Modal de Editar Servicio */}
        {showEditForm && selectedServicio && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-primary">Editar Servicio</h2>
                  <Button variant="outline" onClick={() => setShowEditForm(false)}>
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
    </TooltipProvider>
  );
}

export default function Index() {
  const isReactReady = useReactReady();
  
  if (!isReactReady) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Inicializando aplicación...</div>
        </div>
      </div>
    );
  }

  return <IndexContent />;
}
