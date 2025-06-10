
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, FileText, DollarSign, Clock, Users, Loader2 } from "lucide-react";
import { EstadisticasCard } from "@/components/EstadisticasCard";
import { AlertasPendientes } from "@/components/AlertasPendientes";
import { EstadoBadge } from "@/components/EstadoBadge";
import { FormularioServicio } from "@/components/FormularioServicio";
import { useServicios, useEstadisticasServicios } from "@/hooks/useServicios";
import { useClientes } from "@/hooks/useClientes";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalServicioAbierto, setModalServicioAbierto] = useState(false);
  const { data: servicios = [], isLoading: loadingServicios } = useServicios();
  const { data: estadisticas, isLoading: loadingEstadisticas } = useEstadisticasServicios();
  const { data: clientes = [] } = useClientes();
  
  // Filtrar servicios
  const serviciosFiltrados = servicios.filter(servicio =>
    servicio.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.cliente?.razonSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.patente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  if (loadingServicios || loadingEstadisticas) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando datos...</span>
      </div>
    );
  }

  const clientesActivos = clientes.filter(c => c.activo).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestión de Servicios</h1>
          <p className="text-muted-foreground">Sistema de Gestión de Grúas - Dashboard Principal</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary-dark text-white"
          onClick={() => setModalServicioAbierto(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EstadisticasCard
          title="Total Servicios"
          value={estadisticas?.totalServicios || 0}
          icon={FileText}
          trend={{ value: 12, label: "desde el mes pasado" }}
        />
        <EstadisticasCard
          title="En Curso"
          value={estadisticas?.serviciosEnCurso || 0}
          icon={Clock}
          className="border-yellow-500/30 bg-yellow-500/5"
        />
        <EstadisticasCard
          title="Ingresos Totales"
          value={formatCurrency(estadisticas?.ingresosTotales || 0)}
          icon={DollarSign}
          trend={{ value: 8, label: "desde el mes pasado" }}
          className="border-primary/30 bg-primary/5"
        />
        <EstadisticasCard
          title="Clientes Activos"
          value={clientesActivos}
          icon={Users}
          className="border-blue-500/30 bg-blue-500/5"
        />
      </div>

      <AlertasPendientes />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Servicios Recientes
            </CardTitle>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Buscar por folio, cliente o patente..."
                className="px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                {serviciosFiltrados.map((servicio) => (
                  <tr key={servicio.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-primary">{servicio.folio}</td>
                    <td className="p-3">
                      {format(servicio.fecha, "dd/MM/yyyy", { locale: es })}
                    </td>
                    <td className="p-3">{servicio.cliente?.razonSocial}</td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{servicio.marcaVehiculo} {servicio.modeloVehiculo}</div>
                        <div className="text-sm text-muted-foreground">{servicio.patente}</div>
                      </div>
                    </td>
                    <td className="p-3 font-medium">{formatCurrency(servicio.valor)}</td>
                    <td className="p-3">
                      <EstadoBadge estado={servicio.estado} />
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          Ver
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 px-2">
                          Editar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {serviciosFiltrados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {servicios.length === 0 
                ? "No hay servicios registrados aún."
                : "No se encontraron servicios que coincidan con la búsqueda."
              }
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              En Curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas?.serviciosEnCurso || 0}</div>
            <p className="text-sm text-muted-foreground">
              Servicios activos en proceso
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cerrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas?.serviciosCerrados || 0}</div>
            <p className="text-sm text-muted-foreground">
              Listos para facturar
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Facturados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas?.serviciosFacturados || 0}</div>
            <p className="text-sm text-muted-foreground">
              Proceso completado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modal para nuevo servicio */}
      <Dialog open={modalServicioAbierto} onOpenChange={setModalServicioAbierto}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Servicio</DialogTitle>
          </DialogHeader>
          <FormularioServicio
            onSuccess={() => setModalServicioAbierto(false)}
            onCancel={() => setModalServicioAbierto(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
