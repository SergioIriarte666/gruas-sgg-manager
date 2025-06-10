
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EstadisticasCard } from "@/components/EstadisticasCard";
import { 
  BarChart3, 
  FileText, 
  DollarSign, 
  Clock, 
  Users, 
  TrendingUp,
  Download,
  Eye
} from "lucide-react";
import { mockServicios, mockClientes, mockGruas, mockOperadores } from "@/lib/mockData";

export default function Reportes() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  // Calcular estadísticas
  const totalServicios = mockServicios.length;
  const serviciosEnCurso = mockServicios.filter(s => s.estado === 'en_curso').length;
  const serviciosCerrados = mockServicios.filter(s => s.estado === 'cerrado').length;
  const serviciosFacturados = mockServicios.filter(s => s.estado === 'facturado').length;
  const ingresosTotales = mockServicios.reduce((acc, s) => acc + s.valor, 0);
  const clientesActivos = mockClientes.filter(c => c.activo).length;
  const gruasActivas = mockGruas.filter(g => g.activo).length;
  const operadoresActivos = mockOperadores.filter(o => o.activo).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Reportes y Estadísticas</h1>
          <p className="text-muted-foreground">Dashboard ejecutivo y reportes del sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Datos
          </Button>
          <Button className="bg-primary hover:bg-primary-dark text-white">
            <Eye className="h-4 w-4 mr-2" />
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EstadisticasCard
          title="Total Servicios"
          value={totalServicios}
          icon={FileText}
          trend={{ value: 12, label: "desde el mes pasado" }}
          className="border-primary/30 bg-primary/5"
        />
        <EstadisticasCard
          title="Ingresos Totales"
          value={formatCurrency(ingresosTotales)}
          icon={DollarSign}
          trend={{ value: 8, label: "desde el mes pasado" }}
          className="border-green-500/30 bg-green-500/5"
        />
        <EstadisticasCard
          title="Clientes Activos"
          value={clientesActivos}
          icon={Users}
          className="border-blue-500/30 bg-blue-500/5"
        />
        <EstadisticasCard
          title="Eficiencia"
          value="92%"
          icon={TrendingUp}
          trend={{ value: 3, label: "desde el mes pasado" }}
          className="border-yellow-500/30 bg-yellow-500/5"
        />
      </div>

      {/* Distribución de Servicios por Estado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Distribución de Servicios por Estado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-yellow-500/30 bg-yellow-500/5">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  En Curso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{serviciosEnCurso}</div>
                <div className="text-sm text-muted-foreground">
                  {((serviciosEnCurso / totalServicios) * 100).toFixed(1)}% del total
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(serviciosEnCurso / totalServicios) * 100}%` }}
                  ></div>
                </div>
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
                <div className="text-3xl font-bold">{serviciosCerrados}</div>
                <div className="text-sm text-muted-foreground">
                  {((serviciosCerrados / totalServicios) * 100).toFixed(1)}% del total
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(serviciosCerrados / totalServicios) * 100}%` }}
                  ></div>
                </div>
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
                <div className="text-3xl font-bold">{serviciosFacturados}</div>
                <div className="text-sm text-muted-foreground">
                  {((serviciosFacturados / totalServicios) * 100).toFixed(1)}% del total
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(serviciosFacturados / totalServicios) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Ingresos por Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Ingresos por Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockClientes.map((cliente) => {
              const serviciosCliente = mockServicios.filter(s => s.clienteId === cliente.id);
              const ingresoCliente = serviciosCliente.reduce((acc, s) => acc + s.valor, 0);
              const porcentajeIngreso = (ingresoCliente / ingresosTotales) * 100;
              
              return (
                <div key={cliente.id} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                  <div>
                    <div className="font-medium">{cliente.razonSocial}</div>
                    <div className="text-sm text-muted-foreground">
                      {serviciosCliente.length} servicio(s)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{formatCurrency(ingresoCliente)}</div>
                    <div className="text-sm text-muted-foreground">
                      {porcentajeIngreso.toFixed(1)}% del total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recursos del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="text-blue-400 text-sm">Grúas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gruasActivas}</div>
            <div className="text-sm text-muted-foreground">
              de {mockGruas.length} registradas
            </div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground mb-1">Por tipo:</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Livianas:</span>
                  <span>{mockGruas.filter(g => g.tipo === 'Liviana' && g.activo).length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Medianas:</span>
                  <span>{mockGruas.filter(g => g.tipo === 'Mediana' && g.activo).length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Pesadas:</span>
                  <span>{mockGruas.filter(g => g.tipo === 'Pesada' && g.activo).length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-400 text-sm">Operadores Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operadoresActivos}</div>
            <div className="text-sm text-muted-foreground">
              de {mockOperadores.length} registrados
            </div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">
                Capacidad de operación al {((operadoresActivos / mockGruas.length) * 100).toFixed(0)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardHeader>
            <CardTitle className="text-purple-400 text-sm">Promedio por Servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(ingresosTotales / totalServicios)}
            </div>
            <div className="text-sm text-muted-foreground">
              Valor promedio
            </div>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">
                Rango: {formatCurrency(Math.min(...mockServicios.map(s => s.valor)))} - {formatCurrency(Math.max(...mockServicios.map(s => s.valor)))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Exportar Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Reporte de Servicios
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              Reporte Financiero
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Reporte de Clientes
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              Dashboard Ejecutivo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
