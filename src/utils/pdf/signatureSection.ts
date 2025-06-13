
import jsPDF from 'jspdf';
import { FormData, SelectedData } from './types';

export const addSignatureSection = (
  pdf: jsPDF, 
  formData: FormData, 
  selectedData: SelectedData, 
  yPosition: number
): number => {
  // Signature Section
  if (yPosition > 180) {
    pdf.addPage();
    yPosition = 20;
  } else {
    yPosition += 30;
  }

  // Signature Section Header
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FIRMAS Y CONFORMIDAD', 20, yPosition);
  yPosition += 15;

  // Disclaimer text
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  const disclaimerText = 'Las firmas certifican la conformidad con el servicio prestado y el estado del vehículo declarado en este documento.';
  const splitDisclaimer = pdf.splitTextToSize(disclaimerText, 170);
  pdf.text(splitDisclaimer, 20, yPosition);
  yPosition += splitDisclaimer.length * 4 + 15;

  // Reset text color
  pdf.setTextColor(0, 0, 0);

  // Signature boxes dimensions
  const boxWidth = 80;
  const boxHeight = 60;
  const leftBoxX = 20;
  const rightBoxX = 110;

  // Operator signature box
  pdf.rect(leftBoxX, yPosition, boxWidth, boxHeight);
  
  // Operator signature line
  const signatureLineY = yPosition + 35;
  pdf.line(leftBoxX + 10, signatureLineY, leftBoxX + boxWidth - 10, signatureLineY);
  
  // Operator labels
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FIRMA DEL OPERADOR', leftBoxX + (boxWidth / 2), yPosition + 10, { align: 'center' });
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  if (selectedData.selectedOperador) {
    pdf.text(selectedData.selectedOperador.nombreCompleto, leftBoxX + (boxWidth / 2), signatureLineY + 8, { align: 'center' });
    pdf.text(`RUT: ${selectedData.selectedOperador.rut}`, leftBoxX + (boxWidth / 2), signatureLineY + 14, { align: 'center' });
  }
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Operador de Grúa', leftBoxX + (boxWidth / 2), yPosition + boxHeight - 5, { align: 'center' });

  // Client signature box
  pdf.rect(rightBoxX, yPosition, boxWidth, boxHeight);
  
  // Client signature line
  pdf.line(rightBoxX + 10, signatureLineY, rightBoxX + boxWidth - 10, signatureLineY);
  
  // Client labels
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FIRMA DEL CLIENTE', rightBoxX + (boxWidth / 2), yPosition + 10, { align: 'center' });
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(formData.cliente, rightBoxX + (boxWidth / 2), signatureLineY + 8, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Cliente/Receptor del Servicio', rightBoxX + (boxWidth / 2), yPosition + boxHeight - 5, { align: 'center' });

  yPosition += boxHeight + 15;

  // Date and time of signature
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(100, 100, 100);
  const currentDateTime = new Date().toLocaleString('es-CL');
  pdf.text(`Fecha y hora de firma: ${currentDateTime}`, 20, yPosition);

  return yPosition;
};
