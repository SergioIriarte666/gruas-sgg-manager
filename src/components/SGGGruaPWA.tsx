
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, Download, Share, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface CapturedImage {
  id: string;
  file: File;
  preview: string;
  timestamp: Date;
}

export default function SGGGruaPWA() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    cliente: '',
    marcaVehiculo: '',
    modeloVehiculo: '',
    patente: '',
    kilometraje: '', // Changed from "Km Vehículo"
    ubicacionOrigen: '',
    ubicacionDestino: '',
    grua: '',
    operador: '',
    tipoServicio: '',
    observaciones: ''
  });

  // Image capture states
  const [equipmentImages, setEquipmentImages] = useState<CapturedImage[]>([]);
  const [damageImages, setDamageImages] = useState<CapturedImage[]>([]);
  const [captureMode, setCaptureMode] = useState<'equipment' | 'damage' | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const preview = URL.createObjectURL(file);

    const newImage: CapturedImage = {
      id: imageId,
      file,
      preview,
      timestamp: new Date()
    };

    if (captureMode === 'equipment') {
      setEquipmentImages(prev => [...prev, newImage]);
      toast({
        title: "Imagen de equipamiento capturada",
        description: "La imagen se ha agregado correctamente"
      });
    } else if (captureMode === 'damage') {
      if (damageImages.length >= 6) {
        toast({
          title: "Límite alcanzado",
          description: "Solo se pueden capturar 6 fotografías de daños",
          variant: "destructive"
        });
        return;
      }
      setDamageImages(prev => [...prev, newImage]);
      toast({
        title: "Imagen de daños capturada",
        description: `Imagen ${damageImages.length + 1}/6 agregada`
      });
    }

    setCaptureMode(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (imageId: string, type: 'equipment' | 'damage') => {
    if (type === 'equipment') {
      setEquipmentImages(prev => {
        const updated = prev.filter(img => img.id !== imageId);
        const imageToRemove = prev.find(img => img.id === imageId);
        if (imageToRemove) {
          URL.revokeObjectURL(imageToRemove.preview);
        }
        return updated;
      });
    } else {
      setDamageImages(prev => {
        const updated = prev.filter(img => img.id !== imageId);
        const imageToRemove = prev.find(img => img.id === imageId);
        if (imageToRemove) {
          URL.revokeObjectURL(imageToRemove.preview);
        }
        return updated;
      });
    }
  };

  const openCamera = (mode: 'equipment' | 'damage') => {
    setCaptureMode(mode);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const generatePDF = async () => {
    try {
      const pdf = new jsPDF();
      let yPosition = 20;

      // Header
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INVENTARIO DE VEHÍCULO - SGG GRÚA', 20, yPosition);
      yPosition += 15;

      // Basic info
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Fecha: ${formData.fecha}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Cliente: ${formData.cliente}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Vehículo: ${formData.marcaVehiculo} ${formData.modeloVehiculo}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Patente: ${formData.patente}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Kilometraje: ${formData.kilometraje}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Origen: ${formData.ubicacionOrigen}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Destino: ${formData.ubicacionDestino}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Grúa: ${formData.grua}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Operador: ${formData.operador}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Tipo de Servicio: ${formData.tipoServicio}`, 20, yPosition);
      yPosition += 15;

      // Equipment section
      if (equipmentImages.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('EQUIPAMIENTO IDENTIFICADO:', 20, yPosition);
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Total de elementos capturados: ${equipmentImages.length}`, 20, yPosition);
        yPosition += 10;
      }

      // Damage section
      if (damageImages.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('DAÑOS Y CONDICIONES:', 20, yPosition);
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Total de fotografías de daños: ${damageImages.length}`, 20, yPosition);
        yPosition += 10;
      }

      // Observations
      if (formData.observaciones) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('OBSERVACIONES:', 20, yPosition);
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        const splitObservations = pdf.splitTextToSize(formData.observaciones, 170);
        pdf.text(splitObservations, 20, yPosition);
      }

      // Save PDF
      const pdfBlob = pdf.output('blob');
      const fileName = `inventario_${formData.patente || 'vehiculo'}_${Date.now()}.pdf`;
      
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      
      URL.revokeObjectURL(url);

      toast({
        title: "PDF generado exitosamente",
        description: "El inventario se ha descargado correctamente"
      });

      return pdfBlob;
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error al generar PDF",
        description: "No se pudo crear el documento",
        variant: "destructive"
      });
      return null;
    }
  };

  const shareViaWhatsApp = async () => {
    const pdfBlob = await generatePDF();
    if (!pdfBlob) return;

    const message = `Inventario de vehículo - ${formData.patente}\nFecha: ${formData.fecha}\nCliente: ${formData.cliente}`;
    
    if (navigator.share) {
      try {
        const file = new File([pdfBlob], `inventario_${formData.patente}.pdf`, {
          type: 'application/pdf'
        });
        
        await navigator.share({
          title: 'Inventario de Vehículo',
          text: message,
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing:', error);
        fallbackWhatsAppShare(message);
      }
    } else {
      fallbackWhatsAppShare(message);
    }
  };

  const fallbackWhatsAppShare = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Compartir por WhatsApp",
      description: "El PDF se descargó. Compártelo manualmente en WhatsApp."
    });
  };

  const isFormValid = () => {
    return formData.cliente && formData.marcaVehiculo && formData.patente && 
           formData.grua && formData.operador;
  };

  return (
    <div className="min-h-screen bg-black text-primary p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-black border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl text-primary text-center">
              🚛 INVENTARIO DE VEHÍCULO
            </CardTitle>
            <p className="text-center text-primary/70">
              Sistema de Gestión de Grúas - Modo PWA
            </p>
          </CardHeader>
        </Card>

        {/* Basic Vehicle Information */}
        <Card className="bg-black border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Información del Vehículo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fecha" className="text-primary">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange('fecha', e.target.value)}
                  className="bg-black border-primary/30 text-primary"
                />
              </div>
              <div>
                <Label htmlFor="cliente" className="text-primary">Cliente *</Label>
                <Input
                  id="cliente"
                  value={formData.cliente}
                  onChange={(e) => handleInputChange('cliente', e.target.value)}
                  placeholder="Nombre del cliente"
                  className="bg-black border-primary/30 text-primary"
                />
              </div>
              <div>
                <Label htmlFor="marcaVehiculo" className="text-primary">Marca Vehículo *</Label>
                <Input
                  id="marcaVehiculo"
                  value={formData.marcaVehiculo}
                  onChange={(e) => handleInputChange('marcaVehiculo', e.target.value)}
                  placeholder="Marca del vehículo"
                  className="bg-black border-primary/30 text-primary"
                />
              </div>
              <div>
                <Label htmlFor="modeloVehiculo" className="text-primary">Modelo Vehículo</Label>
                <Input
                  id="modeloVehiculo"
                  value={formData.modeloVehiculo}
                  onChange={(e) => handleInputChange('modeloVehiculo', e.target.value)}
                  placeholder="Modelo del vehículo"
                  className="bg-black border-primary/30 text-primary"
                />
              </div>
              <div>
                <Label htmlFor="patente" className="text-primary">Patente *</Label>
                <Input
                  id="patente"
                  value={formData.patente}
                  onChange={(e) => handleInputChange('patente', e.target.value)}
                  placeholder="Patente del vehículo"
                  className="bg-black border-primary/30 text-primary"
                />
              </div>
              <div>
                <Label htmlFor="kilometraje" className="text-primary">Kilometraje</Label>
                <Input
                  id="kilometraje"
                  value={formData.kilometraje}
                  onChange={(e) => handleInputChange('kilometraje', e.target.value)}
                  placeholder="Kilometraje actual"
                  className="bg-black border-primary/30 text-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="bg-black border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Ubicaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ubicacionOrigen" className="text-primary">Ubicación Origen</Label>
              <Input
                id="ubicacionOrigen"
                value={formData.ubicacionOrigen}
                onChange={(e) => handleInputChange('ubicacionOrigen', e.target.value)}
                placeholder="Dirección de origen"
                className="bg-black border-primary/30 text-primary"
              />
            </div>
            <div>
              <Label htmlFor="ubicacionDestino" className="text-primary">Ubicación Destino</Label>
              <Input
                id="ubicacionDestino"
                value={formData.ubicacionDestino}
                onChange={(e) => handleInputChange('ubicacionDestino', e.target.value)}
                placeholder="Dirección de destino"
                className="bg-black border-primary/30 text-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Assignment */}
        <Card className="bg-black border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Asignación del Servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="grua" className="text-primary">Grúa *</Label>
                <Input
                  id="grua"
                  value={formData.grua}
                  onChange={(e) => handleInputChange('grua', e.target.value)}
                  placeholder="Identificación de grúa"
                  className="bg-black border-primary/30 text-primary"
                />
              </div>
              <div>
                <Label htmlFor="operador" className="text-primary">Operador *</Label>
                <Input
                  id="operador"
                  value={formData.operador}
                  onChange={(e) => handleInputChange('operador', e.target.value)}
                  placeholder="Nombre del operador"
                  className="bg-black border-primary/30 text-primary"
                />
              </div>
              <div>
                <Label htmlFor="tipoServicio" className="text-primary">Tipo de Servicio</Label>
                <Input
                  id="tipoServicio"
                  value={formData.tipoServicio}
                  onChange={(e) => handleInputChange('tipoServicio', e.target.value)}
                  placeholder="Tipo de servicio"
                  className="bg-black border-primary/30 text-primary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Section */}
        <Card className="bg-black border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Equipamiento del Vehículo
            </CardTitle>
            <p className="text-primary/70 text-sm">
              Capture imágenes para identificar y marcar elementos del equipamiento
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => openCamera('equipment')}
              className="w-full bg-primary text-black hover:bg-primary/90"
              size="lg"
            >
              <Camera className="h-5 w-5 mr-2" />
              Capturar Equipamiento
            </Button>
            
            {equipmentImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {equipmentImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
                      alt="Equipamiento"
                      className="w-full h-32 object-cover rounded-lg border border-primary/30"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(image.id, 'equipment')}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-primary/70 mt-1">
                      {image.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-sm text-primary/70">
              Total de elementos capturados: {equipmentImages.length}
            </p>
          </CardContent>
        </Card>

        {/* Damage and Conditions Section */}
        <Card className="bg-black border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Daños y Condiciones ({damageImages.length}/6)
            </CardTitle>
            <p className="text-primary/70 text-sm">
              Capture hasta 6 fotografías para documentar daños y condiciones del vehículo
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => openCamera('damage')}
              disabled={damageImages.length >= 6}
              className="w-full bg-primary text-black hover:bg-primary/90 disabled:opacity-50"
              size="lg"
            >
              <Camera className="h-5 w-5 mr-2" />
              {damageImages.length >= 6 ? 'Límite Alcanzado' : 'Capturar Daños'}
            </Button>
            
            {damageImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {damageImages.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Daño ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-primary/30"
                    />
                    <div className="absolute top-2 left-2 bg-primary text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(image.id, 'damage')}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-primary/70 mt-1">
                      Foto {index + 1} - {image.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Observations */}
        <Card className="bg-black border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Observaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.observaciones}
              onChange={(e) => handleInputChange('observaciones', e.target.value)}
              placeholder="Observaciones adicionales sobre el inventario..."
              className="bg-black border-primary/30 text-primary min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="bg-black border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={generatePDF}
                disabled={!isFormValid()}
                className="bg-primary text-black hover:bg-primary/90 disabled:opacity-50"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Generar PDF
              </Button>
              
              <Button
                onClick={shareViaWhatsApp}
                disabled={!isFormValid()}
                className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                size="lg"
              >
                <Share className="h-5 w-5 mr-2" />
                Enviar por WhatsApp
              </Button>
            </div>
            
            {!isFormValid() && (
              <p className="text-center text-primary/70 text-sm mt-4">
                Complete los campos obligatorios (*) para continuar
              </p>
            )}
          </CardContent>
        </Card>

        {/* Hidden file input for camera */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageCapture}
          className="hidden"
        />
      </div>
    </div>
  );
}
