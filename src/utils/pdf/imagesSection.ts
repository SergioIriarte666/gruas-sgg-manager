
import jsPDF from 'jspdf';
import { CapturedImage } from './types';

export const addImagesSection = async (
  pdf: jsPDF, 
  damageImages: CapturedImage[], 
  yPosition: number
): Promise<number> => {
  if (damageImages.length === 0) {
    return yPosition;
  }

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
  
  return imageY + imageHeight + 20;
};
