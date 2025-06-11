
import jsPDF from 'jspdf';
import { Servicio, Cliente, Grua, Operador } from '@/types';

export const generateServiciosReport = (servicios: Servicio[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  
  // Header
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Reporte de Servicios', pageWidth / 2, 30, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-CL')}`, margin, 45);
  
  // Summary
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Resumen:', margin, 60);
  
  doc.setFont(undefined, 'normal');
  const totalServicios = servicios.length;
  const serviciosEnCurso = servicios.filter(s => s.estado === 'en_curso').length;
  const serviciosCerrados = servicios.filter(s => s.estado === 'cerrado').length;
  const serviciosFacturados = servicios.filter(s => s.estado === 'facturado').length;
  
  doc.text(`Total de Servicios: ${totalServicios}`, margin, 70);
  doc.text(`En Curso: ${serviciosEnCurso}`, margin, 80);
  doc.text(`Cerrados: ${serviciosCerrados}`, margin, 90);
  doc.text(`Facturados: ${serviciosFacturados}`, margin, 100);
  
  // Services list
  if (servicios.length > 0) {
    doc.setFont(undefined, 'bold');
    doc.text('Detalle de Servicios:', margin, 120);
    
    let yPos = 135;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    
    servicios.forEach((servicio, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.text(`${index + 1}. Folio: ${servicio.folio}`, margin, yPos);
      doc.text(`   Cliente: ${servicio.cliente?.razonSocial || 'N/A'}`, margin, yPos + 10);
      doc.text(`   Fecha: ${servicio.fecha.toLocaleDateString('es-CL')}`, margin, yPos + 20);
      doc.text(`   Estado: ${servicio.estado}`, margin, yPos + 30);
      doc.text(`   Valor: $${servicio.valor.toLocaleString('es-CL')}`, margin, yPos + 40);
      
      yPos += 55;
    });
  } else {
    doc.text('No hay servicios registrados.', margin, 135);
  }
  
  return doc;
};

export const generateFinancialReport = (servicios: Servicio[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  
  // Header
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Reporte Financiero', pageWidth / 2, 30, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-CL')}`, margin, 45);
  
  // Financial summary
  const ingresosTotales = servicios.reduce((acc, s) => acc + s.valor, 0);
  const serviciosFacturados = servicios.filter(s => s.estado === 'facturado');
  const ingresosFacturados = serviciosFacturados.reduce((acc, s) => acc + s.valor, 0);
  const ingresosPendientes = servicios.filter(s => s.estado !== 'facturado').reduce((acc, s) => acc + s.valor, 0);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Resumen Financiero:', margin, 60);
  
  doc.setFont(undefined, 'normal');
  doc.text(`Ingresos Totales: $${ingresosTotales.toLocaleString('es-CL')}`, margin, 75);
  doc.text(`Ingresos Facturados: $${ingresosFacturados.toLocaleString('es-CL')}`, margin, 85);
  doc.text(`Ingresos Pendientes: $${ingresosPendientes.toLocaleString('es-CL')}`, margin, 95);
  doc.text(`Servicios Facturados: ${serviciosFacturados.length}`, margin, 105);
  
  if (servicios.length > 0) {
    const valorPromedio = ingresosTotales / servicios.length;
    doc.text(`Valor Promedio por Servicio: $${valorPromedio.toLocaleString('es-CL')}`, margin, 115);
  }
  
  // Monthly breakdown (if there are services)
  if (servicios.length > 0) {
    doc.setFont(undefined, 'bold');
    doc.text('Desglose por Estado:', margin, 135);
    
    let yPos = 150;
    doc.setFont(undefined, 'normal');
    
    const estadosSummary = {
      'en_curso': { count: 0, total: 0 },
      'cerrado': { count: 0, total: 0 },
      'facturado': { count: 0, total: 0 }
    };
    
    servicios.forEach(s => {
      estadosSummary[s.estado].count++;
      estadosSummary[s.estado].total += s.valor;
    });
    
    Object.entries(estadosSummary).forEach(([estado, data]) => {
      const estadoLabel = estado === 'en_curso' ? 'En Curso' : 
                         estado === 'cerrado' ? 'Cerrados' : 'Facturados';
      doc.text(`${estadoLabel}: ${data.count} servicios - $${data.total.toLocaleString('es-CL')}`, margin, yPos);
      yPos += 15;
    });
  }
  
  return doc;
};

export const generateClientesReport = (clientes: Cliente[], servicios: Servicio[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  
  // Header
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Reporte de Clientes', pageWidth / 2, 30, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-CL')}`, margin, 45);
  
  // Summary
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Resumen:', margin, 60);
  
  doc.setFont(undefined, 'normal');
  const clientesActivos = clientes.filter(c => c.activo).length;
  doc.text(`Total de Clientes: ${clientes.length}`, margin, 75);
  doc.text(`Clientes Activos: ${clientesActivos}`, margin, 85);
  
  // Client details
  if (clientes.length > 0) {
    doc.setFont(undefined, 'bold');
    doc.text('Detalle de Clientes:', margin, 105);
    
    let yPos = 120;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    
    clientes.forEach((cliente, index) => {
      if (yPos > 240) {
        doc.addPage();
        yPos = 30;
      }
      
      const serviciosCliente = servicios.filter(s => s.clienteId === cliente.id);
      const ingresoCliente = serviciosCliente.reduce((acc, s) => acc + s.valor, 0);
      
      doc.text(`${index + 1}. ${cliente.razonSocial}`, margin, yPos);
      doc.text(`   RUT: ${cliente.rut}`, margin, yPos + 10);
      doc.text(`   Email: ${cliente.email}`, margin, yPos + 20);
      doc.text(`   Teléfono: ${cliente.telefono}`, margin, yPos + 30);
      doc.text(`   Servicios: ${serviciosCliente.length}`, margin, yPos + 40);
      doc.text(`   Ingresos: $${ingresoCliente.toLocaleString('es-CL')}`, margin, yPos + 50);
      doc.text(`   Estado: ${cliente.activo ? 'Activo' : 'Inactivo'}`, margin, yPos + 60);
      
      yPos += 75;
    });
  } else {
    doc.text('No hay clientes registrados.', margin, 120);
  }
  
  return doc;
};

export const generateDashboardReport = (
  servicios: Servicio[], 
  clientes: Cliente[], 
  gruas: Grua[], 
  operadores: Operador[]
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  
  // Header
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('Dashboard Ejecutivo', pageWidth / 2, 30, { align: 'center' });
  
  // Date
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-CL')}`, margin, 45);
  
  // Key metrics
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Métricas Principales:', margin, 65);
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  
  const totalServicios = servicios.length;
  const ingresosTotales = servicios.reduce((acc, s) => acc + s.valor, 0);
  const clientesActivos = clientes.filter(c => c.activo).length;
  const gruasActivas = gruas.filter(g => g.activo).length;
  const operadoresActivos = operadores.filter(o => o.activo).length;
  const serviciosFacturados = servicios.filter(s => s.estado === 'facturado').length;
  const eficiencia = totalServicios > 0 ? Math.round((serviciosFacturados / totalServicios) * 100) : 0;
  
  let yPos = 80;
  doc.text(`Total de Servicios: ${totalServicios}`, margin, yPos);
  yPos += 15;
  doc.text(`Ingresos Totales: $${ingresosTotales.toLocaleString('es-CL')}`, margin, yPos);
  yPos += 15;
  doc.text(`Clientes Activos: ${clientesActivos}`, margin, yPos);
  yPos += 15;
  doc.text(`Eficiencia: ${eficiencia}%`, margin, yPos);
  yPos += 25;
  
  // Resources
  doc.setFont(undefined, 'bold');
  doc.text('Recursos del Sistema:', margin, yPos);
  yPos += 15;
  
  doc.setFont(undefined, 'normal');
  doc.text(`Grúas Activas: ${gruasActivas} de ${gruas.length} registradas`, margin, yPos);
  yPos += 10;
  doc.text(`Operadores Activos: ${operadoresActivos} de ${operadores.length} registrados`, margin, yPos);
  yPos += 25;
  
  // Service distribution
  doc.setFont(undefined, 'bold');
  doc.text('Distribución de Servicios:', margin, yPos);
  yPos += 15;
  
  doc.setFont(undefined, 'normal');
  const serviciosEnCurso = servicios.filter(s => s.estado === 'en_curso').length;
  const serviciosCerrados = servicios.filter(s => s.estado === 'cerrado').length;
  
  doc.text(`En Curso: ${serviciosEnCurso} (${totalServicios > 0 ? ((serviciosEnCurso / totalServicios) * 100).toFixed(1) : 0}%)`, margin, yPos);
  yPos += 10;
  doc.text(`Cerrados: ${serviciosCerrados} (${totalServicios > 0 ? ((serviciosCerrados / totalServicios) * 100).toFixed(1) : 0}%)`, margin, yPos);
  yPos += 10;
  doc.text(`Facturados: ${serviciosFacturados} (${totalServicios > 0 ? ((serviciosFacturados / totalServicios) * 100).toFixed(1) : 0}%)`, margin, yPos);
  
  return doc;
};
