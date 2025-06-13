
import { TablaReporte } from "./TablaReporte";
import { Servicio, Cliente } from "@/types";

interface AnalisisDetalladoProps {
  servicios: Servicio[];
  clientes: Cliente[];
  formatCurrency: (amount: number) => string;
}

export function AnalisisDetallado({ servicios, clientes, formatCurrency }: AnalisisDetalladoProps) {
  // Top 10 clientes por ingresos
  const clientesConIngresos = clientes.map(cliente => {
    const serviciosCliente = servicios.filter(s => s.clienteId === cliente.id);
    const ingresoTotal = serviciosCliente.reduce((acc, s) => acc + s.valor, 0);
    return {
      cliente: cliente.razonSocial,
      servicios: serviciosCliente.length,
      ingresos: ingresoTotal
    };
  }).sort((a, b) => b.ingresos - a.ingresos).slice(0, 10);

  const datosTopClientes = clientesConIngresos.map(item => [
    item.cliente,
    item.servicios,
    item.ingresos
  ]);

  // Análisis temporal (últimos 6 meses)
  const hoy = new Date();
  const mesesAtras = Array.from({ length: 6 }, (_, i) => {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    return {
      mes: fecha.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' }),
      servicios: servicios.filter(s => {
        const fechaServicio = new Date(s.fecha);
        return fechaServicio.getMonth() === fecha.getMonth() && 
               fechaServicio.getFullYear() === fecha.getFullYear();
      }),
      fecha: fecha
    };
  }).reverse();

  const datosTemporal = mesesAtras.map(item => [
    item.mes,
    item.servicios.length,
    item.servicios.reduce((acc, s) => acc + s.valor, 0),
    item.servicios.length > 0 ? Math.round(item.servicios.reduce((acc, s) => acc + s.valor, 0) / item.servicios.length) : 0
  ]);

  const totalesTemporal = [
    'TOTAL',
    datosTemporal.reduce((acc, row) => acc + (row[1] as number), 0),
    datosTemporal.reduce((acc, row) => acc + (row[2] as number), 0),
    datosTemporal.length > 0 ? Math.round(datosTemporal.reduce((acc, row) => acc + (row[2] as number), 0) / datosTemporal.reduce((acc, row) => acc + (row[1] as number), 0)) : 0
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-300 p-4">
        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2">
          ANÁLISIS DETALLADO
        </h2>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TablaReporte
          title="TOP 10 CLIENTES POR INGRESOS"
          headers={['Cliente', 'Servicios', 'Ingresos ($)']}
          data={datosTopClientes}
        />

        <TablaReporte
          title="ANÁLISIS TEMPORAL (ÚLTIMOS 6 MESES)"
          headers={['Período', 'Servicios', 'Ingresos ($)', 'Promedio ($)']}
          data={datosTemporal}
          totals={totalesTemporal}
        />
      </div>
    </div>
  );
}
