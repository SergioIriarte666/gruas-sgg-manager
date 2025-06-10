
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EstadoBadge } from "@/components/EstadoBadge";
import { FacturaDetailsModal } from "@/components/FacturaDetailsModal";
import { Plus, FileText, DollarSign, AlertTriangle, CheckCircle, Eye, Download, Search, BarChart3, Filter, User, FileSpreadsheet } from "lucide-react";
import { formatSafeDate } from "@/lib/utils";
import { useFacturas, useUpdateFacturaEstado } from "@/hooks/useFacturas";
import { useCierres } from "@/hooks/useCierres";
import { useCreateFactura } from "@/hooks/useCreateFactura";
import { generateFacturaPDF } from "@/utils/pdfGenerator";

export default function Facturas() {
  const [selectedFactura, setSelectedFactura] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentDates, setPaymentDates] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showReports, setShowReports] = useState(false);

  const { data: facturas = [], isLoading, error } = useFacturas();
  const { data: cierres = [] } = useCierres();
  const updateFacturaEstado = useUpdateFacturaEstado();
  const createFactura = useCreateFactura();

  // Filtrar facturas
  const facturasFiltradas = facturas.filter(factura => {
    const matchesSearch = 
      factura.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || factura.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const handleViewFactura = (factura: any) => {
    setSelectedFactura(factura);
    setIsModalOpen(true);
  };

  const handleGeneratePDF = (factura: any) => {
    generateFacturaPDF(factura);
  };

  const handleMarkAsPaid = (facturaId: string) => {
    const fechaPago = paymentDates[facturaId] || new Date().toISOString().split('T')[0];
    updateFacturaEstado.mutate({ facturaId, fechaPago });
  };

  const handlePaymentDateChange = (facturaId: string, date: string) => {
    setPaymentDates(prev => ({ ...prev, [facturaId]: date }));
  };

  const handleCreateFacturaFromCierre = (cierreId: string) => {
    createFactura.mutate(cierreId);
  };

  const handleExportCSV = () => {
    const csvData = facturasFiltradas.map(factura => ({
      Folio: factura.folio,
      Fecha: formatSafeDate(factura.fecha),
      Cliente: factura.cliente,
      Subtotal: factura.subtotal,
      IVA: factura.iva,
      Total: factura.total,
      Vencimiento: formatSafeDate(factura.fechaVencimiento),
      Estado: factura.estado,
      FechaPago: factura.fechaPago ? formatSafeDate(factura.fechaPago) : ''
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facturas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportExcel = () => {
    // Crear datos para Excel
    const excelData = facturasFiltradas.map(factura => ({
      'Folio': factura.folio,
      'Fecha': formatSafeDate(factura.fecha),
      'Cliente': factura.cliente,
      'Subtotal': factura.subtotal,
      'IVA': factura.iva,
      'Total': factura.total,
      'Fecha Vencimiento': formatSafeDate(factura.fechaVencimiento),
      'Estado': factura.estado,
      'Fecha Pago': factura.fechaPago ? formatSafeDate(factura.fechaPago) : '',
      'Días Vencimiento': factura.diasVencimiento
    }));

    // Crear archivo Excel simple usando CSV con formato Excel
    const headers = Object.keys(excelData[0]);
    const csvContent = [
      headers.join('\t'),
      ...excelData.map(row => Object.values(row).join('\t'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facturas_${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
  };

  const handleExportAllPDF = () => {
    facturasFiltradas.forEach(factura => {
      setTimeout(() => {
        generateFacturaPDF(factura);
      }, 100);
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Cargando facturas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error al cargar las facturas: {error.message}</div>
        </div>
      </div>
    );
  }

  const facturasVencidas = facturas.filter(f => f.estado === 'vencida');
  const facturasPendientes = facturas.filter(f => f.estado === 'pendiente');
  const cierresPendientesFacturar = cierres.filter(c => !c.facturado);

  // Estadísticas
  const totalFacturas = facturas.length;
  const facturasPendientesCount = facturas.filter(f => f.estado === 'pendiente').length;
  const facturasVencidasCount = facturas.filter(f => f.estado === 'vencida').length;
  const totalRecaudado = facturas.filter(f => f.estado === 'pagada').reduce((acc, f) => acc + f.total, 0);
  const totalPendiente = facturas.filter(f => f.estado === 'pendiente' || f.estado === 'vencida').reduce((acc, f) => acc + f.total, 0);

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Facturas</h1>
            <p className="text-muted-foreground">Gestión completa de facturación y pagos</p>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  onClick={() => setShowReports(!showReports)}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Reportes
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver reportes y estadísticas de facturación</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  onClick={handleExportExcel}
                  disabled={facturasFiltradas.length === 0}
                >
                  <FileExcel className="h-4 w-4 mr-2" />
                  Excel
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar facturas a Excel</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  onClick={handleExportCSV}
                  disabled={facturasFiltradas.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar facturas a CSV</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline"
                  onClick={handleExportAllPDF}
                  disabled={facturasFiltradas.length === 0}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  PDF Todas
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generar PDF de todas las facturas filtradas</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-primary text-sm">Total Facturas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFacturas}</div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardHeader>
              <CardTitle className="text-orange-400 text-sm">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{facturasPendientesCount}</div>
            </CardContent>
          </Card>

          <Card className="border-red-500/30 bg-red-500/5">
            <CardHeader>
              <CardTitle className="text-red-400 text-sm">Vencidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{facturasVencidasCount}</div>
            </CardContent>
          </Card>

          <Card className="border-green-500/30 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-green-400 text-sm">Recaudado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{formatCurrency(totalRecaudado)}</div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-blue-400 text-sm">Por Cobrar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{formatCurrency(totalPendiente)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Reportes Section */}
        {showReports && (
          <Card>
            <CardHeader>
              <CardTitle>Reportes de Facturación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {totalFacturas > 0 ? ((facturas.filter(f => f.estado === 'pagada').length / totalFacturas) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Tasa de Cobro</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalFacturas > 0 ? totalRecaudado / facturas.filter(f => f.estado === 'pagada').length : 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Promedio por Factura</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {facturas.filter(f => f.diasVencimiento < 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Facturas Vencidas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cierres Pendientes de Facturar */}
        {cierresPendientesFacturar.length > 0 && (
          <Card className="border-blue-500/30 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <FileText className="h-5 w-5" />
                Cierres Pendientes de Facturar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cierresPendientesFacturar.map((cierre) => (
                  <div key={cierre.id} className="flex justify-between items-center p-3 bg-background/50 rounded border border-blue-500/20">
                    <div>
                      <span className="font-medium text-blue-400">{cierre.folio}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        Del {formatSafeDate(cierre.fecha_inicio)} al {formatSafeDate(cierre.fecha_fin)}
                      </span>
                      {cierre.clientes && (
                        <span className="text-sm text-muted-foreground block">
                          {cierre.clientes.razon_social}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium text-blue-400">{formatCurrency(Number(cierre.total))}</div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleCreateFacturaFromCierre(cierre.id)}
                            disabled={createFactura.isPending}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Facturar
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Crear factura desde este cierre</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alertas de Facturas Vencidas */}
        {facturasVencidas.length > 0 && (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Facturas Vencidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {facturasVencidas.map((factura) => (
                  <div key={factura.id} className="flex justify-between items-center p-3 bg-background/50 rounded border border-red-500/20">
                    <div>
                      <span className="font-medium text-red-400">{factura.folio}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {factura.cliente}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-400">{formatCurrency(factura.total)}</div>
                      <div className="text-xs text-red-400">
                        {Math.abs(factura.diasVencimiento)} días vencida
                      </div>
                    </div>
                  </div>
                ))}
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
                    placeholder="Buscar por folio o cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="vencida">Vencida</option>
                    <option value="pagada">Pagada</option>
                  </select>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filtrar facturas por estado</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Facturas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Lista de Facturas ({facturasFiltradas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {facturasFiltradas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "No hay facturas que coincidan con los filtros."
                  : "No hay facturas creadas aún. Las facturas se crean desde los cierres de servicios."
                }
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium text-muted-foreground">Folio</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Fecha</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Cliente</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Subtotal</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">IVA</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Total</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Vencimiento</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Estado</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturasFiltradas.map((factura) => (
                      <tr key={factura.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium text-primary">{factura.folio}</td>
                        <td className="p-3">
                          {formatSafeDate(factura.fecha)}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {factura.cliente === 'Sin cliente asignado' && (
                              <User className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={factura.cliente === 'Sin cliente asignado' ? 'text-muted-foreground italic' : ''}>
                              {factura.cliente}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">{formatCurrency(factura.subtotal)}</td>
                        <td className="p-3">{formatCurrency(factura.iva)}</td>
                        <td className="p-3 font-medium">{formatCurrency(factura.total)}</td>
                        <td className="p-3">
                          <div>
                            {formatSafeDate(factura.fechaVencimiento)}
                            {factura.estado === 'pendiente' && (
                              <div className="text-xs text-muted-foreground">
                                {factura.diasVencimiento > 0 ? `${factura.diasVencimiento} días` : 'Vence hoy'}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <EstadoBadge estado={factura.estado} />
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 px-2"
                                  onClick={() => handleViewFactura(factura)}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ver detalles de la factura</p>
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 px-2"
                                  onClick={() => handleGeneratePDF(factura)}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Descargar factura en PDF</p>
                              </TooltipContent>
                            </Tooltip>

                            {factura.estado === 'pendiente' && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    className="h-8 px-2 bg-green-600 hover:bg-green-700"
                                    onClick={() => handleMarkAsPaid(factura.id)}
                                    disabled={updateFacturaEstado.isPending}
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Marcar como pagada</p>
                                </TooltipContent>
                              </Tooltip>
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

        {/* Gestión de Pagos */}
        {facturasPendientes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Gestión de Pagos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {facturasPendientes.map((factura) => (
                  <div key={factura.id} className="border border-border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="font-medium text-primary">{factura.folio}</h3>
                        <p className="text-sm text-muted-foreground">{factura.cliente}</p>
                        <p className="text-lg font-bold mt-1">{formatCurrency(factura.total)}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Fecha de Pago</label>
                          <input
                            type="date"
                            className="px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value={paymentDates[factura.id] || new Date().toISOString().split('T')[0]}
                            onChange={(e) => handlePaymentDateChange(factura.id, e.target.value)}
                          />
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              className="bg-green-600 hover:bg-green-700 mt-6"
                              onClick={() => handleMarkAsPaid(factura.id)}
                              disabled={updateFacturaEstado.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Marcar como Pagada
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Confirmar el pago de esta factura</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <FacturaDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          factura={selectedFactura}
        />
      </div>
    </TooltipProvider>
  );
}
