
import jsPDF from 'jspdf';
import { CapturedImage, FormData, SelectedData } from './pdf/types';
import { addHeaderSection } from './pdf/headerSection';
import { addServiceInfoSection } from './pdf/serviceInfoSection';
import { addServiceDataSection } from './pdf/serviceDataSection';
import { addEquipmentSection } from './pdf/equipmentSection';
import { addImagesSection } from './pdf/imagesSection';
import { addSignatureSection } from './pdf/signatureSection';
import { addFooterSection } from './pdf/footerSection';

export const generateClientReportPDF = async (
  formData: FormData,
  selectedData: SelectedData,
  equipmentVerification: Record<string, boolean>,
  damageImages: CapturedImage[]
) => {
  const pdf = new jsPDF();
  let yPosition = 20;

  // Add header section
  yPosition = addHeaderSection(pdf);

  // Add service information section
  yPosition = addServiceInfoSection(pdf, formData, selectedData, yPosition);

  // Add service data section
  yPosition = addServiceDataSection(pdf, formData, yPosition);

  // Add equipment section
  yPosition = addEquipmentSection(pdf, equipmentVerification, yPosition);

  // Detailed Assistance Type
  if (formData.tipoAsistenciaDetallado) {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TIPO DE ASISTENCIA DETALLADO', 20, yPosition);
    yPosition += 8;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const splitAsistencia = pdf.splitTextToSize(formData.tipoAsistenciaDetallado, 170);
    pdf.text(splitAsistencia, 20, yPosition);
    yPosition += splitAsistencia.length * 6 + 15;
  }

  // Add images section
  yPosition = await addImagesSection(pdf, damageImages, yPosition);

  // Observations
  if (formData.observaciones) {
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('OBSERVACIONES', 20, yPosition);
    yPosition += 8;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const splitObservations = pdf.splitTextToSize(formData.observaciones, 170);
    pdf.text(splitObservations, 20, yPosition);
    yPosition += splitObservations.length * 6;
  }

  // Add signature section
  addSignatureSection(pdf, formData, selectedData, yPosition);

  // Add footer to all pages
  addFooterSection(pdf);

  return pdf;
};

// Re-export types for backward compatibility
export type { CapturedImage, FormData, SelectedData };
