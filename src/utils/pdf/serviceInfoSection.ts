
import jsPDF from 'jspdf';
import { FormData, SelectedData } from './types';

export const addServiceInfoSection = (
  pdf: jsPDF, 
  formData: FormData, 
  selectedData: SelectedData, 
  yPosition: number
): number => {
  // Client and Vehicle Information Section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INFORMACIÓN DEL SERVICIO', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  // Two column layout
  const leftColumn = 20;
  const rightColumn = 110;
  
  pdf.text(`Fecha: ${formData.fecha}`, leftColumn, yPosition);
  pdf.text(`Cliente: ${formData.cliente}`, rightColumn, yPosition);
  yPosition += 8;
  
  pdf.text(`Vehículo: ${formData.marcaVehiculo} ${formData.modeloVehiculo}`, leftColumn, yPosition);
  pdf.text(`Patente: ${formData.patente}`, rightColumn, yPosition);
  yPosition += 8;
  
  pdf.text(`Origen: ${formData.ubicacionOrigen}`, leftColumn, yPosition);
  yPosition += 8;
  pdf.text(`Destino: ${formData.ubicacionDestino}`, leftColumn, yPosition);
  yPosition += 15;

  // Service Assignment Section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ASIGNACIÓN DEL SERVICIO', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  
  if (selectedData.selectedGrua) {
    pdf.text(`Grúa: ${selectedData.selectedGrua.patente} - ${selectedData.selectedGrua.marca} ${selectedData.selectedGrua.modelo} (${selectedData.selectedGrua.tipo})`, leftColumn, yPosition);
    yPosition += 8;
  }
  
  if (selectedData.selectedOperador) {
    pdf.text(`Operador: ${selectedData.selectedOperador.nombreCompleto} - ${selectedData.selectedOperador.rut}`, leftColumn, yPosition);
    yPosition += 8;
  }
  
  if (selectedData.selectedTipoServicio) {
    pdf.text(`Tipo de Servicio: ${selectedData.selectedTipoServicio.nombre}`, leftColumn, yPosition);
    yPosition += 8;
  }

  return yPosition + 10;
};
