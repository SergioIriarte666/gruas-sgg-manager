
import jsPDF from 'jspdf';
import { Servicio, Cliente, Grua, Operador } from '@/types';

// Colores corporativos
const COLORS = {
  primary: '#1e40af', // Azul corporativo
  secondary: '#6b7280', // Gris texto
  accent: '#059669', // Verde para montos
  background: '#f9fafb', // Fondo claro
  border: '#e5e7eb' // Bordes
};

// Función helper para agregar header corporativo
const addCorporateHeader = (doc: jsPDF, title: string) => {
  const pageWidth = doc.internal.pageSize.width;
  
  // Fondo del header
  doc.setFillColor(248, 250, 252); // bg-slate-50
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  // Línea superior azul
  doc.setFillColor(30, 64, 175); // blue-800
  doc.rect(0, 0, pageWidth, 4, 'F');
  
  // Logo/Título principal
  doc.setTextColor(30, 64, 175); // blue-800
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('SGG', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(107, 114, 128); // gray-500
  doc.text('Sistema de Gestión de Grúas', 20, 35);
  
  // Título del reporte
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(17, 24, 39); // gray-900
  doc.text(title, pageWidth / 2, 30, { align: 'center' });
  
  // Fecha de generación
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-CL', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, pageWidth - 20, 45, { align: 'right' });
  
  return 70; // Retorna la posición Y donde continuar
};

// Función helper para agregar footer
const addFooter = (doc: jsPDF, pageNumber: number) => {
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  
  // Línea divisoria
  doc.setDrawColor(229, 231, 235); // gray-200
  doc.setLineWidth(0.5);
  doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
  
  // Texto del footer
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128); // gray-500
  doc.text('SGG - Sistema de Gestión de Grúas | Reporte Confidencial', 20, pageHeight - 15);
  doc.text(`Página ${pageNumber}`, pageWidth - 20, pageHeight - 15, { align: 'right' });
};

// Función helper para crear secciones con estilo
const addSection = (doc: jsPDF, title: string, yPos: number, content: () => number) => {
  // Header de la sección
  doc.setFillColor(248, 250, 252); // bg-slate-50
  doc.rect(20, yPos, doc.internal.pageSize.width - 40, 15, 'F');
  
  doc.setDrawColor(229, 231, 235); // gray-200
  doc.setLineWidth(0.5);
  doc.rect(20, yPos, doc.internal.pageSize.width - 40, 15, 'S');
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(30, 64, 175); // blue-800
  doc.text(title, 25, yPos + 10);
  
  return content();
};

export const generateServiciosReport = (servicios: Servicio[]) => {
  const doc = new jsPDF();
  let yPos = addCorporateHeader(doc, 'REPORTE DE SERVICIOS');
  let pageNumber = 1;
  
  // Resumen ejecutivo
  yPos = addSection(doc, 'RESUMEN EJECUTIVO', yPos + 10, () => {
    const totalServicios = servicios.length;
    const serviciosEnCurso = servicios.filter(s => s.estado === 'en_curso').length;
    const serviciosCerrados = servicios.filter(s => s.estado === 'cerrado').length;
    const serviciosFacturados = servicios.filter(s => s.estado === 'facturado').length;
    
    let currentY = yPos + 25;
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(55, 65, 81); // gray-700
    
    const metrics = [
      ['Total de Servicios:', totalServicios.toString()],
      ['En Curso:', serviciosEnCurso.toString()],
      ['Cerrados:', serviciosCerrados.toString()],
      ['Facturados:', serviciosFacturados.toString()]
    ];
    
    metrics.forEach(([label, value]) => {
      doc.text(label, 25, currentY);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(30, 64, 175); // blue-800
      doc.text(value, 120, currentY);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(55, 65, 81); // gray-700
      currentY += 8;
    });
    
    return currentY + 10;
  });
  
  // Detalle de servicios
  if (servicios.length > 0) {
    yPos = addSection(doc, 'DETALLE DE SERVICIOS', yPos, () => {
      let currentY = yPos + 25;
      
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(55, 65, 81);
      
      servicios.slice(0, 20).forEach((servicio, index) => {
        if (currentY > 250) {
          addFooter(doc, pageNumber);
          doc.addPage();
          pageNumber++;
          addCorporateHeader(doc, 'REPORTE DE SERVICIOS (Continuación)');
          currentY = 80;
        }
        
        // Fondo alternado para filas
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251); // gray-50
          doc.rect(20, currentY - 5, doc.internal.pageSize.width - 40, 20, 'F');
        }
        
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. Folio: ${servicio.folio}`, 25, currentY);
        
        doc.setFont(undefined, 'normal');
        doc.text(`Cliente: ${servicio.cliente?.razonSocial || 'N/A'}`, 30, currentY + 6);
        doc.text(`Fecha: ${new Date(servicio.fecha).toLocaleDateString('es-CL')}`, 30, currentY + 12);
        
        // Estado con color
        const estadoColors = servicio.estado === 'facturado' ? [5, 150, 105] : 
                           servicio.estado === 'cerrado' ? [59, 130, 246] : [245, 158, 11];
        doc.setTextColor(estadoColors[0], estadoColors[1], estadoColors[2]);
        doc.text(`Estado: ${servicio.estado.toUpperCase()}`, 120, currentY + 6);
        
        // Valor con formato
        doc.setTextColor(5, 150, 105); // green-600
        doc.setFont(undefined, 'bold');
        doc.text(`Valor: $${servicio.valor.toLocaleString('es-CL')}`, 120, currentY + 12);
        
        doc.setTextColor(55, 65, 81);
        doc.setFont(undefined, 'normal');
        currentY += 25;
      });
      
      return currentY;
    });
  }
  
  addFooter(doc, pageNumber);
  return doc;
};

export const generateFinancialReport = (servicios: Servicio[]) => {
  const doc = new jsPDF();
  let yPos = addCorporateHeader(doc, 'REPORTE FINANCIERO');
  let pageNumber = 1;
  
  const ingresosTotales = servicios.reduce((acc, s) => acc + s.valor, 0);
  const serviciosFacturados = servicios.filter(s => s.estado === 'facturado');
  const ingresosFacturados = serviciosFacturados.reduce((acc, s) => acc + s.valor, 0);
  const ingresosPendientes = servicios.filter(s => s.estado !== 'facturado').reduce((acc, s) => acc + s.valor, 0);
  
  // Métricas principales
  yPos = addSection(doc, 'MÉTRICAS PRINCIPALES', yPos + 10, () => {
    let currentY = yPos + 25;
    
    const financialMetrics = [
      ['Ingresos Totales:', `$${ingresosTotales.toLocaleString('es-CL')}`],
      ['Ingresos Facturados:', `$${ingresosFacturados.toLocaleString('es-CL')}`],
      ['Ingresos Pendientes:', `$${ingresosPendientes.toLocaleString('es-CL')}`],
      ['Servicios Facturados:', serviciosFacturados.length.toString()],
      ['Valor Promedio:', servicios.length > 0 ? `$${Math.round(ingresosTotales / servicios.length).toLocaleString('es-CL')}` : '$0']
    ];
    
    doc.setFontSize(11);
    
    financialMetrics.forEach(([label, value]) => {
      doc.setFont(undefined, 'normal');
      doc.setTextColor(55, 65, 81);
      doc.text(label, 25, currentY);
      
      doc.setFont(undefined, 'bold');
      doc.setTextColor(5, 150, 105); // green-600 para valores monetarios
      doc.text(value, 120, currentY);
      
      currentY += 12;
    });
    
    return currentY + 10;
  });
  
  // Análisis por estado
  yPos = addSection(doc, 'ANÁLISIS POR ESTADO', yPos, () => {
    let currentY = yPos + 25;
    
    const estadosSummary = [
      { 
        estado: 'En Curso', 
        count: servicios.filter(s => s.estado === 'en_curso').length,
        total: servicios.filter(s => s.estado === 'en_curso').reduce((acc, s) => acc + s.valor, 0)
      },
      { 
        estado: 'Cerrados', 
        count: servicios.filter(s => s.estado === 'cerrado').length,
        total: servicios.filter(s => s.estado === 'cerrado').reduce((acc, s) => acc + s.valor, 0)
      },
      { 
        estado: 'Facturados', 
        count: serviciosFacturados.length,
        total: ingresosFacturados
      }
    ];
    
    doc.setFontSize(10);
    
    estadosSummary.forEach((item) => {
      const percentage = ingresosTotales > 0 ? ((item.total / ingresosTotales) * 100).toFixed(1) : '0';
      
      doc.setFont(undefined, 'bold');
      doc.setTextColor(30, 64, 175);
      doc.text(item.estado, 25, currentY);
      
      doc.setFont(undefined, 'normal');
      doc.setTextColor(55, 65, 81);
      doc.text(`${item.count} servicios`, 25, currentY + 8);
      
      doc.setFont(undefined, 'bold');
      doc.setTextColor(5, 150, 105);
      doc.text(`$${item.total.toLocaleString('es-CL')} (${percentage}%)`, 120, currentY + 4);
      
      currentY += 20;
    });
    
    return currentY;
  });
  
  addFooter(doc, pageNumber);
  return doc;
};

export const generateClientesReport = (clientes: Cliente[], servicios: Servicio[]) => {
  const doc = new jsPDF();
  let yPos = addCorporateHeader(doc, 'REPORTE DE CLIENTES');
  let pageNumber = 1;
  
  const clientesActivos = clientes.filter(c => c.activo).length;
  
  // Resumen
  yPos = addSection(doc, 'RESUMEN', yPos + 10, () => {
    let currentY = yPos + 25;
    
    const clienteMetrics = [
      ['Total de Clientes:', clientes.length.toString()],
      ['Clientes Activos:', clientesActivos.toString()],
      ['Tasa de Actividad:', `${((clientesActivos / clientes.length) * 100).toFixed(1)}%`]
    ];
    
    doc.setFontSize(11);
    
    clienteMetrics.forEach(([label, value]) => {
      doc.setFont(undefined, 'normal');
      doc.setTextColor(55, 65, 81);
      doc.text(label, 25, currentY);
      
      doc.setFont(undefined, 'bold');
      doc.setTextColor(30, 64, 175);
      doc.text(value, 120, currentY);
      
      currentY += 10;
    });
    
    return currentY + 10;
  });
  
  // Top clientes
  const topClientes = clientes
    .map(cliente => {
      const serviciosCliente = servicios.filter(s => s.clienteId === cliente.id);
      return {
        cliente,
        servicios: serviciosCliente.length,
        ingresos: serviciosCliente.reduce((acc, s) => acc + s.valor, 0)
      };
    })
    .sort((a, b) => b.ingresos - a.ingresos)
    .slice(0, 10);
  
  if (topClientes.length > 0) {
    yPos = addSection(doc, 'TOP 10 CLIENTES POR INGRESOS', yPos, () => {
      let currentY = yPos + 25;
      
      doc.setFontSize(9);
      
      topClientes.forEach((item, index) => {
        if (currentY > 250) {
          addFooter(doc, pageNumber);
          doc.addPage();
          pageNumber++;
          addCorporateHeader(doc, 'REPORTE DE CLIENTES (Continuación)');
          currentY = 80;
        }
        
        // Fondo alternado
        if (index % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(20, currentY - 5, doc.internal.pageSize.width - 40, 18, 'F');
        }
        
        doc.setFont(undefined, 'bold');
        doc.setTextColor(30, 64, 175);
        doc.text(`${index + 1}. ${item.cliente.razonSocial}`, 25, currentY);
        
        doc.setFont(undefined, 'normal');
        doc.setTextColor(55, 65, 81);
        doc.text(`RUT: ${item.cliente.rut}`, 25, currentY + 6);
        doc.text(`Servicios: ${item.servicios}`, 25, currentY + 12);
        
        doc.setFont(undefined, 'bold');
        doc.setTextColor(5, 150, 105);
        doc.text(`Ingresos: $${item.ingresos.toLocaleString('es-CL')}`, 120, currentY + 6);
        
        doc.setFont(undefined, 'normal');
        const statusColor = item.cliente.activo ? [5, 150, 105] : [239, 68, 68];
        doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
        doc.text(`Estado: ${item.cliente.activo ? 'ACTIVO' : 'INACTIVO'}`, 120, currentY + 12);
        
        currentY += 22;
      });
      
      return currentY;
    });
  }
  
  addFooter(doc, pageNumber);
  return doc;
};

export const generateDashboardReport = (
  servicios: Servicio[], 
  clientes: Cliente[], 
  gruas: Grua[], 
  operadores: Operador[]
) => {
  const doc = new jsPDF();
  let yPos = addCorporateHeader(doc, 'DASHBOARD EJECUTIVO');
  let pageNumber = 1;
  
  const totalServicios = servicios.length;
  const ingresosTotales = servicios.reduce((acc, s) => acc + s.valor, 0);
  const clientesActivos = clientes.filter(c => c.activo).length;
  const gruasActivas = gruas.filter(g => g.activo).length;
  const operadoresActivos = operadores.filter(o => o.activo).length;
  const serviciosFacturados = servicios.filter(s => s.estado === 'facturado').length;
  const eficiencia = totalServicios > 0 ? Math.round((serviciosFacturados / totalServicios) * 100) : 0;
  
  // Métricas principales
  yPos = addSection(doc, 'MÉTRICAS PRINCIPALES', yPos + 10, () => {
    let currentY = yPos + 25;
    
    // Crear un grid de métricas
    const metrics = [
      { label: 'Total Servicios', value: totalServicios.toString(), color: [30, 64, 175] },
      { label: 'Ingresos Totales', value: `$${ingresosTotales.toLocaleString('es-CL')}`, color: [5, 150, 105] },
      { label: 'Clientes Activos', value: clientesActivos.toString(), color: [59, 130, 246] },
      { label: 'Eficiencia', value: `${eficiencia}%`, color: [245, 158, 11] }
    ];
    
    doc.setFontSize(12);
    
    // Dibujar métricas en grid 2x2
    metrics.forEach((metric, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = 25 + (col * 85);
      const y = currentY + (row * 30);
      
      // Caja para la métrica
      doc.setFillColor(248, 250, 252);
      doc.rect(x, y - 8, 80, 25, 'F');
      doc.setDrawColor(229, 231, 235);
      doc.rect(x, y - 8, 80, 25, 'S');
      
      doc.setFont(undefined, 'bold');
      doc.setTextColor(metric.color[0], metric.color[1], metric.color[2]);
      doc.text(metric.value, x + 40, y + 2, { align: 'center' });
      
      doc.setFont(undefined, 'normal');
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(9);
      doc.text(metric.label, x + 40, y + 10, { align: 'center' });
      doc.setFontSize(12);
    });
    
    return currentY + 70;
  });
  
  // Recursos y distribución
  yPos = addSection(doc, 'RECURSOS Y DISTRIBUCIÓN', yPos, () => {
    let currentY = yPos + 25;
    
    // Recursos del sistema
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('Recursos del Sistema:', 25, currentY);
    
    currentY += 15;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(55, 65, 81);
    
    const recursos = [
      `Grúas Activas: ${gruasActivas} de ${gruas.length} registradas`,
      `Operadores Activos: ${operadoresActivos} de ${operadores.length} registrados`,
      `Capacidad de Operación: ${gruas.length > 0 ? ((operadoresActivos / gruas.length) * 100).toFixed(0) : 0}%`
    ];
    
    recursos.forEach(recurso => {
      doc.text(`• ${recurso}`, 30, currentY);
      currentY += 8;
    });
    
    currentY += 10;
    
    // Distribución de servicios
    doc.setFont(undefined, 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('Distribución de Servicios:', 25, currentY);
    
    currentY += 15;
    doc.setFont(undefined, 'normal');
    doc.setTextColor(55, 65, 81);
    
    const serviciosEnCurso = servicios.filter(s => s.estado === 'en_curso').length;
    const serviciosCerrados = servicios.filter(s => s.estado === 'cerrado').length;
    
    const distribucion = [
      { estado: 'En Curso', count: serviciosEnCurso, color: [245, 158, 11] },
      { estado: 'Cerrados', count: serviciosCerrados, color: [59, 130, 246] },
      { estado: 'Facturados', count: serviciosFacturados, color: [5, 150, 105] }
    ];
    
    distribucion.forEach(item => {
      const percentage = totalServicios > 0 ? ((item.count / totalServicios) * 100).toFixed(1) : '0';
      
      doc.setTextColor(item.color[0], item.color[1], item.color[2]);
      doc.text(`• ${item.estado}: ${item.count} (${percentage}%)`, 30, currentY);
      currentY += 8;
    });
    
    return currentY;
  });
  
  addFooter(doc, pageNumber);
  return doc;
};
