import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Download, Share, Eye, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface CapturedImage {
  id: string;
  file: File;
  preview: string;
  timestamp: Date;
}

// Equipamiento completo del vehículo para verificación
const EQUIPAMIENTO_VEHICULO = [
  'Radio',
  'Espejo retrovisor',
  'Cenicero',
  'Encendedor',
  'Alfombras',
  'Tapasoles',
  'Guantera',
  'Consola central',
  'Aire acondicionado',
  'Calefacción',
  'Antena',
  'Espejos laterales',
  'Emblemas',
  'Molduras',
  'Parachoques',
  'Rejilla',
  'Tapacubos',
  'Llantas',
  'Faros delanteros',
  'Faros traseros',
  'Luces direccionales',
  'Luz de placa',
  'Luces de freno',
  'Luz de reversa',
  'Cinturones de seguridad',
  'Extintor',
  'Triángulos',
  'Botiquín',
  'Llanta de repuesto',
  'Gato',
  'Llave de ruedas',
  'Manual de usuario',
  'Tarjeta de propiedad',
  'Revisión técnica',
  'Seguro',
  'Llaves de contacto',
  'Control de alarma',
  'Estuche de llaves',
  'Tapa de combustible'
];

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
    ubicacionOrigen: '',
    ubicacionDestino: '',
    grua: '',
    operador: '',
    tipoServicio: '',
    observaciones: '',
    kmInicial: '',
    kmFinal: '',
    kmVehiculo: '',
    nivelCombustible: '',
    tipoAsistenciaDetallado: ''
  });

  // Equipment verification state
  const [equipmentVerification, setEquipmentVerification] = useState<Record<string, boolean>>({});

  // Damage images state
  const [damageImages, setDamageImages] = useState<CapturedImage[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEquipmentToggle = (item: string) => {
    setEquipmentVerification(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleSelectAllEquipment = () => {
    const allSelected: Record<string, boolean> = {};
    EQUIPAMIENTO_VEHICULO.forEach(item => {
      allSelected[item] = true;
    });
    setEquipmentVerification(allSelected);
  };

  const handleDeselectAllEquipment = () => {
    setEquipmentVerification({});
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

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (imageId: string) => {
    setDamageImages(prev => {
      const updated = prev.filter(img => img.id !== imageId);
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return updated;
    });
  };

  const openCamera = () => {
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
      pdf.text('DETALLES PARA REPORTE CLIENTE - SGG GRÚA', 20, yPosition);
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
      yPosition += 15;

      // Kilómetros
      pdf.setFont('helvetica', 'bold');
      pdf.text('KILÓMETROS:', 20, yPosition);
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');
      pdf.text(`KM Inicial: ${formData.kmInicial}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`KM Final: ${formData.kmFinal}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`KM Vehículo: ${formData.kmVehiculo}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Nivel Combustible: ${formData.nivelCombustible}`, 20, yPosition);
      yPosition += 15;

      // Equipamiento verificado
      const equipmentPresente = EQUIPAMIENTO_VEHICULO.filter(item => equipmentVerification[item]);
      
      if (equipmentPresente.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('EQUIPAMIENTO VERIFICADO:', 20, yPosition);
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        equipmentPresente.forEach(item => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(`✓ ${item}`, 30, yPosition);
          yPosition += 6;
        });
        yPosition += 10;
      }

      // Tipo de asistencia
      if (formData.tipoAsistenciaDetallado) {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.setFont('helvetica', 'bold');
        pdf.text('TIPO DE ASISTENCIA DETALLADO:', 20, yPosition);
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        const splitAsistencia = pdf.splitTextToSize(formData.tipoAsistenciaDetallado, 170);
        pdf.text(splitAsistencia, 20, yPosition);
        yPosition += splitAsistencia.length * 6 + 10;
      }

      // Damage section
      if (damageImages.length > 0) {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.setFont('helvetica', 'bold');
        pdf.text('DAÑOS Y CONDICIONES:', 20, yPosition);
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Total de fotografías de daños: ${damageImages.length}`, 20, yPosition);
        yPosition += 10;
      }

      // Observations
      if (formData.observaciones) {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.setFont('helvetica', 'bold');
        pdf.text('OBSERVACIONES:', 20, yPosition);
        yPosition += 8;
        pdf.setFont('helvetica', 'normal');
        const splitObservations = pdf.splitTextToSize(formData.observaciones, 170);
        pdf.text(splitObservations, 20, yPosition);
      }

      // Save PDF
      const pdfBlob = pdf.output('blob');
      const fileName = `reporte_cliente_${formData.patente || 'vehiculo'}_${Date.now()}.pdf`;
      
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      
      URL.revokeObjectURL(url);

      toast({
        title: "PDF generado exitosamente",
        description: "El reporte cliente se ha descargado correctamente"
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

    const message = `Reporte Cliente - ${formData.patente}\nFecha: ${formData.fecha}\nCliente: ${formData.cliente}`;
    
    if (navigator.share) {
      try {
        const file = new File([pdfBlob], `reporte_cliente_${formData.patente}.pdf`, {
          type: 'application/pdf'
        });
        
        await navigator.share({
          title: 'Reporte Cliente',
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
              🚛 DETALLES PARA REPORTE CLIENTE
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
            </div>
          </CardContent>
        </Card>

        {/* Detalles para Reporte Cliente - Kilómetros */}
        <Card className="bg-black border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Detalles para Reporte Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="kmInicial" className="text-primary">KM Inicial</Label>
                <Input
                  id="kmInicial"
                  type="number"
                  value={formData.kmInicial}
                  onChange={(e) => handleInputChange('kmInicial', e.target.value)}
                  placeholder="0"
                  className="bg-black border-primary/30 text-primary"
                />
              </div>
              <div>
                <Label htmlFor="kmFinal" className="text-primary">KM Final</Label>
                <Input
                  id="kmFinal"
                  type="number"
                  value={formData.kmFinal}
                  onChange={(e) => handleInputChange('kmFinal', e.target.value)}
                  placeholder="0"
                  className="bg-black border-primary/30 text-primary"
                />
              </div>
              <div>
                <Label htmlFor="kmVehiculo" className="text-primary">KM Vehículo</Label>
                <Input
                  id="kmVehiculo"
                  type="number"
                  value={formData.kmVehiculo}
                  onChange={(e) => handleInputChange('kmVehiculo', e.target.value)}
                  placeholder="0"
                  className="bg-black border-primary/30 text-primary"
                />
              </div>
              <div>
                <Label htmlFor="nivelCombustible" className="text-primary">Nivel Combustible</Label>
                <Select value={formData.nivelCombustible} onValueChange={(value) => handleInputChange('nivelCombustible', value)}>
                  <SelectTrigger className="bg-black border-primary/30 text-primary">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-primary/30">
                    <SelectItem value="1/4">1/4</SelectItem>
                    <SelectItem value="2/4">2/4</SelectItem>
                    <SelectItem value="3/4">3/4</SelectItem>
                    <SelectItem value="4/4">4/4</SelectItem>
                  </SelectContent>
                </Select>
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

        {/* Verificación de Equipamiento */}
        <Card className="bg-black border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Verificación de Equipamiento ({Object.values(equipmentVerification).filter(Boolean).length}/{EQUIPAMIENTO_VEHICULO.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={handleSelectAllEquipment}
                variant="outline"
                size="sm"
                className="text-primary border-primary/30 hover:bg-primary/10"
              >
                ✓ Seleccionar Todo
              </Button>
              <Button
                onClick={handleDeselectAllEquipment}
                variant="outline"
                size="sm"
                className="text-primary border-primary/30 hover:bg-primary/10"
              >
                ✗ Deseleccionar Todo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {EQUIPAMIENTO_VEHICULO.map(item => (
                <div key={item} className="flex items-center space-x-2 p-2 rounded border border-primary/20 hover:bg-primary/5">
                  <input
                    type="checkbox"
                    id={`equipment-${item}`}
                    checked={equipmentVerification[item] || false}
                    onChange={() => handleEquipmentToggle(item)}
                    className="border-primary"
                  />
                  <label
                    htmlFor={`equipment-${item}`}
                    className="text-sm text-primary cursor-pointer flex-1"
                  >
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tipo de Asistencia Detallado */}
        <Card className="bg-black border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Tipo de Asistencia Detallado</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.tipoAsistenciaDetallado}
              onChange={(e) => handleInputChange('tipoAsistenciaDetallado', e.target.value)}
              placeholder="Descripción específica del tipo de asistencia"
              className="bg-black border-primary/30 text-primary min-h-[100px]"
            />
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
              onClick={openCamera}
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
                        onClick={() => removeImage(image.id)}
                      >
                        ✕
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
