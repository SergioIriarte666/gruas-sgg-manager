
import jsPDF from 'jspdf';

export const generateFacturaPDF = (factura: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('FACTURA', 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Folio: ${factura.folio}`, 20, 45);
  doc.text(`Fecha: ${formatDateForPDF(factura.fecha)}`, 20, 55);
  doc.text(`Vencimiento: ${formatDateForPDF(factura.fechaVencimiento)}`, 20, 65);
  
  // Client info
  doc.text('CLIENTE:', 20, 85);
  doc.text(factura.cliente || 'Sin cliente asignado', 20, 95);
  
  // Amounts
  doc.text('DETALLE:', 20, 115);
  doc.text(`Subtotal: ${formatCurrency(factura.subtotal)}`, 20, 130);
  doc.text(`IVA (19%): ${formatCurrency(factura.iva)}`, 20, 140);
  
  doc.setFontSize(14);
  doc.text(`TOTAL: ${formatCurrency(factura.total)}`, 20, 155);
  
  // Estado
  doc.setFontSize(12);
  doc.text(`Estado: ${getEstadoLabel(factura.estado)}`, 20, 175);
  
  if (factura.fechaPago) {
    doc.text(`Fecha de Pago: ${formatDateForPDF(factura.fechaPago)}`, 20, 185);
  }
  
  // Footer
  doc.setFontSize(10);
  doc.text(`Generado el: ${new Date().toLocaleDateString('es-CL')}`, 20, 280);
  
  // Download
  doc.save(`factura-${factura.folio}.pdf`);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount);
};

const formatDateForPDF = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL');
  } catch (error) {
    return dateString;
  }
};

const getEstadoLabel = (estado: string) => {
  switch (estado) {
    case 'pendiente':
      return 'PENDIENTE';
    case 'pagada':
      return 'PAGADA';
    case 'vencida':
      return 'VENCIDA';
    default:
      return estado.toUpperCase();
  }
};
