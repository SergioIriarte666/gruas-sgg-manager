
import jsPDF from 'jspdf';

interface CapturedImage {
  id: string;
  file: File;
  preview: string;
  timestamp: Date;
}

interface FormData {
  fecha: string;
  cliente: string;
  marcaVehiculo: string;
  modeloVehiculo: string;
  patente: string;
  ubicacionOrigen: string;
  ubicacionDestino: string;
  gruaId: string;
  operadorId: string;
  tipoServicioId: string;
  observaciones: string;
  kmInicial: string;
  kmFinal: string;
  kmVehiculo: string;
  nivelCombustible: string;
  tipoAsistenciaDetallado: string;
}

interface SelectedData {
  selectedGrua?: any;
  selectedOperador?: any;
  selectedTipoServicio?: any;
}

export const generateClientReportPDF = async (
  formData: FormData,
  selectedData: SelectedData,
  equipmentVerification: Record<string, boolean>,
  damageImages: CapturedImage[]
) => {
  const pdf = new jsPDF();
  let yPosition = 20;

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
  
  yPosition = 45;

  // Reset text color
  pdf.setTextColor(0, 0, 0);

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
  yPosition += 10;

  // Kilometers Section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DATOS DEL SERVICIO', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`KM Inicial: ${formData.kmInicial}`, leftColumn, yPosition);
  pdf.text(`KM Final: ${formData.kmFinal}`, rightColumn, yPosition);
  yPosition += 8;
  pdf.text(`KM Vehículo: ${formData.kmVehiculo}`, leftColumn, yPosition);
  pdf.text(`Nivel Combustible: ${formData.nivelCombustible}`, rightColumn, yPosition);
  yPosition += 15;

  // Equipment Section
  const equipmentPresente = Object.keys(equipmentVerification).filter(item => equipmentVerification[item]);
  
  if (equipmentPresente.length > 0) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EQUIPAMIENTO VERIFICADO', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    // Create three columns for equipment
    const cols = 3;
    const colWidth = 60;
    let currentCol = 0;
    let tempY = yPosition;
    
    equipmentPresente.forEach((item, index) => {
      const x = leftColumn + (currentCol * colWidth);
      
      if (tempY > 270) {
        pdf.addPage();
        tempY = 20;
      }
      
      pdf.text(`✓ ${item}`, x, tempY);
      
      currentCol++;
      if (currentCol >= cols) {
        currentCol = 0;
        tempY += 6;
      }
    });
    
    yPosition = tempY + 15;
  }

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

  // Images Section
  if (damageImages.length > 0) {
    if (yPosition > 200) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('FOTOGRAFÍAS DE DAÑOS Y CONDICIONES', 20, yPosition);
    yPosition += 15;

    // Add images in a grid
    let imageX = 20;
    let imageY = yPosition;
    const imageWidth = 80;
    const imageHeight = 60;
    const imagesPerRow = 2;
    let imageCount = 0;

    for (const image of damageImages) {
      if (imageY + imageHeight > 280) {
        pdf.addPage();
        imageY = 20;
        imageX = 20;
      }

      try {
        // Convert image to base64 and add to PDF
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        await new Promise((resolve) => {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/jpeg', 0.8);
            
            pdf.addImage(dataURL, 'JPEG', imageX, imageY, imageWidth, imageHeight);
            
            // Add caption
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Foto ${imageCount + 1} - ${image.timestamp.toLocaleString('es-CL')}`, imageX, imageY + imageHeight + 5);
            
            resolve(true);
          };
          img.src = image.preview;
        });

        imageCount++;
        
        if (imageCount % imagesPerRow === 0) {
          imageY += imageHeight + 15;
          imageX = 20;
        } else {
          imageX += imageWidth + 10;
        }
      } catch (error) {
        console.error('Error adding image to PDF:', error);
      }
    }
    
    yPosition = imageY + imageHeight + 20;
  }

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
  }

  // Footer
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Página ${i} de ${pageCount}`, 20, 290);
    pdf.text('SGG Grúa - Sistema de Gestión de Grúas', 150, 290);
  }

  return pdf;
};
