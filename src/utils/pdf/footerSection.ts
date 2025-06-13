
import jsPDF from 'jspdf';

export const addFooterSection = (pdf: jsPDF): void => {
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Página ${i} de ${pageCount}`, 20, 290);
    pdf.text('SGG Grúa - Sistema de Gestión de Grúas', 150, 290);
  }
};
