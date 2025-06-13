
import jsPDF from 'jspdf';
import { FormData } from './types';

export const addServiceDataSection = (
  pdf: jsPDF, 
  formData: FormData, 
  yPosition: number
): number => {
  // Kilometers Section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DATOS DEL SERVICIO', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  const leftColumn = 20;
  const rightColumn = 110;
  
  pdf.text(`KM Inicial: ${formData.kmInicial}`, leftColumn, yPosition);
  pdf.text(`KM Final: ${formData.kmFinal}`, rightColumn, yPosition);
  yPosition += 8;
  pdf.text(`KM Vehículo: ${formData.kmVehiculo}`, leftColumn, yPosition);
  pdf.text(`Nivel Combustible: ${formData.nivelCombustible}`, rightColumn, yPosition);

  return yPosition + 15;
};
