
import { TablaReporte } from "./TablaReporte";
import { MetricasCorporativas } from "./MetricasCorporativas";
import { Servicio, Cliente, Grua, Operador } from "@/types";

interface ResumenEjecutivoProps {
  servicios: Servicio[];
  clientes: Cliente[];
  gruas: Grua[];
  operadores: Operador[];
  formatCurrency: (amount: number) => string;
}

export function ResumenEjecutivo({ servicios, clientes, gruas, operadores, formatCurrency }: ResumenEjecutivoProps) {
  // Métricas principales
  const totalServicios = servicios.length;
  const ingresosTotales = servicios.reduce((acc, s) => acc + s.valor, 0);
  const serviciosFacturados = servicios.filter(s => s.estado === 'facturado').length;
  const clientesActivos = clientes.filter(c => c.activo).length;
  const eficiencia = totalServicios > 0 ? Math.round((serviciosFacturados / totalServicios) * 100) : 0;

  const metricas = [
    { label: 'Total Servicios', value: totalServicios, tipo: 'numero' as const },
    { label: 'Ingresos Totales', value: ingresosTotales, tipo: 'moneda' as const },
    { label: 'Clientes Activos', value: clientesActivos, tipo: 'numero' as const },
    { label: 'Eficiencia', value: eficiencia, tipo: 'porcentaje' as const }
  ];

  // Datos por estado
  const datosEstado = [
    ['En Curso', servicios.filter(s => s.estado === 'en_curso').length, servicios.filter(s => s.estado === 'en_curso').reduce((acc, s) => acc + s.valor, 0)],
    ['Cerrados', servicios.filter(s => s.estado === 'cerrado').length, servicios.filter(s => s.estado === 'cerrado').reduce((acc, s) => acc + s.valor, 0)],
    ['Facturados', servicios.filter(s => s.estado === 'facturado').length, servicios.filter(s => s.estado === 'facturado').reduce((acc, s) => acc + s.valor, 0)]
  ];

  const totalesEstado = [
    'TOTAL',
    datosEstado.reduce((acc, row) => acc + (row[1] as number), 0),
    datosEstado.reduce((acc, row) => acc + (row[2] as number), 0)
  ];

  // Recursos del sistema
  const datosRecursos = [
    ['Grúas Activas', gruas.filter(g => g.activo).length, gruas.length],
    ['Operadores Activos', operadores.filter(o => o.activo).length, operadores.length],
    ['Capacidad Utilizada', gruas.length > 0 ? Math.round((operadores.filter(o => o.activo).length / gruas.length) * 100) : 0, 100]
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-300 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">
          RESUMEN EJECUTIVO - SGG SISTEMA DE GESTIÓN DE GRÚAS
        </h2>
        <div className="text-xs text-gray-600 mb-4">
          Generado el: {new Date().toLocaleDateString('es-CL')} | Período: Todo el historial
        </div>
      </div>

      <MetricasCorporativas 
        titulo="INDICADORES PRINCIPALES" 
        metricas={metricas} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TablaReporte
          title="DISTRIBUCIÓN POR ESTADO"
          headers={['Estado', 'Cantidad', 'Valor ($)']}
          data={datosEstado}
          totals={totalesEstado}
        />

        <TablaReporte
          title="RECURSOS DEL SISTEMA"
          headers={['Recurso', 'Activos', 'Total/Capacidad']}
          data={datosRecursos}
        />
      </div>
    </div>
  );
}
