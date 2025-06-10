
import jsPDF from 'jspdf';

export const generateFacturaPDF = (factura: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('FACTURA', 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Folio: ${factura.folio}`, 20, 45);
  doc.text(`Fecha: ${factura.fecha.toLocaleDateString('es-CL')}`, 20, 55);
  doc.text(`Vencimiento: ${factura.fechaVencimiento.toLocaleDateString('es-CL')}`, 20, 65);
  
  // Client info
  doc.text('CLIENTE:', 20, 85);
  doc.text(factura.cliente, 20, 95);
  
  // Amounts
  doc.text('DETALLE:', 20, 115);
  doc.text(`Subtotal: ${formatCurrency(factura.subtotal)}`, 20, 130);
  doc.text(`IVA (19%): ${formatCurrency(factura.iva)}`, 20, 140);
  
  doc.setFontSize(14);
  doc.text(`TOTAL: ${formatCurrency(factura.total)}`, 20, 155);
  
  // Estado
  doc.setFontSize(12);
  doc.text(`Estado: ${factura.estado.toUpperCase()}`, 20, 175);
  
  if (factura.fechaPago) {
    doc.text(`Fecha de Pago: ${factura.fechaPago.toLocaleDateString('es-CL')}`, 20, 185);
  }
  
  // Download
  doc.save(`factura-${factura.folio}.pdf`);
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount);
};
