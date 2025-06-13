
import jsPDF from 'jspdf';

export const addHeaderSection = (pdf: jsPDF): number => {
  // Professional Header
  pdf.setFillColor(0, 0, 0);
  pdf.rect(0, 0, 210, 30, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SGG GRÚA - REPORTE CLIENTE', 20, 15);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generado: ${new Date().toLocaleDateString('es-CL')} ${new Date().toLocaleTimeString('es-CL')}`, 20, 25);
  
  // Reset text color
  pdf.setTextColor(0, 0, 0);
  
  return 45; // Return next Y position
};
