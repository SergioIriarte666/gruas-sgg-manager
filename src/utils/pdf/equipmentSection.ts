
import jsPDF from 'jspdf';

export const addEquipmentSection = (
  pdf: jsPDF, 
  equipmentVerification: Record<string, boolean>, 
  yPosition: number
): number => {
  const equipmentPresente = Object.keys(equipmentVerification).filter(item => equipmentVerification[item]);
  
  if (equipmentPresente.length === 0) {
    return yPosition;
  }

  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EQUIPAMIENTO VERIFICADO', 20, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  // Create three columns for equipment
  const cols = 3;
  const colWidth = 60;
  const leftColumn = 20;
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
  
  return tempY + 15;
};
