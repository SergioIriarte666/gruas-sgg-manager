
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Download, Share, Eye, CheckSquare, Users, Truck, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGruas } from '@/hooks/useGruas';
import { useOperadores } from '@/hooks/useOperadores';
import { useTiposServicio } from '@/hooks/useTiposServicio';
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
  
  // Hooks for real data
  const { data: gruas = [] } = useGruas();
  const { data: operadores = [] } = useOperadores();
  const { data: tiposServicio = [] } = useTiposServicio();
  
  // Form data state
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    cliente: '',
    marcaVehiculo: '',
    modeloVehiculo: '',
    patente: '',
    ubicacionOrigen: '',
    ubicacionDestino: '',
    gruaId: '',
    operadorId: '',
    tipoServicioId: '',
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

  // Selection modal states
  const [showGruaSelection, setShowGruaSelection] = useState(false);
  const [showOperadorSelection, setShowOperadorSelection] = useState(false);
  const [showTipoServicioSelection, setShowTipoServicioSelection] = useState(false);

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

  // Selection handlers
  const handleGruaSelect = (gruaId: string) => {
    handleInputChange('gruaId', gruaId);
    setShowGruaSelection(false);
    toast({
      title: "Grúa seleccionada",
      description: "Grúa asignada correctamente"
    });
  };

  const handleOperadorSelect = (operadorId: string) => {
    handleInputChange('operadorId', operadorId);
    setShowOperadorSelection(false);
    toast({
      title: "Operador seleccionado",
      description: "Operador asignado correctamente"
    });
  };

  const handleTipoServicioSelect = (tipoId: string) => {
    handleInputChange('tipoServicioId', tipoId);
    setShowTipoServicioSelection(false);
    toast({
      title: "Tipo de servicio seleccionado",
      description: "Tipo de servicio asignado correctamente"
    });
  };

  const clearSelection = (field: 'gruaId' | 'operadorId' | 'tipoServicioId') => {
    handleInputChange(field, '');
  };

  // Get selected items for display
  const selectedGrua = gruas.find(g => g.id === formData.gruaId);
  const selectedOperador = operadores.find(o => o.id === formData.operadorId);
  const selectedTipoServicio = tiposServicio.find(t => t.id === formData.tipoServicioId);

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
      
      if (selectedGrua) {
        pdf.text(`Grúa: ${selectedGrua.patente} - ${selectedGrua.marca} ${selectedGrua.modelo} (${selectedGrua.tipo})`, leftColumn, yPosition);
        yPosition += 8;
      }
      
      if (selectedOperador) {
        pdf.text(`Operador: ${selectedOperador.nombreCompleto} - ${selectedOperador.rut}`, leftColumn, yPosition);
        yPosition += 8;
      }
      
      if (selectedTipoServicio) {
        pdf.text(`Tipo de Servicio: ${selectedTipoServicio.nombre}`, leftColumn, yPosition);
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
      const equipmentPresente = EQUIPAMIENTO_VEHICULO.filter(item => equipmentVerification[item]);
      
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
           formData.gruaId && formData.operadorId;
  };

  return (
    <div className="min-h-screen bg-black text-primary p-4">
      <div className="max-w-6xl mx-auto space-y-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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

            {/* Service Assignment with Selection Buttons */}
            <Card className="bg-black border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Asignación del Servicio</CardTitle>
                <p className="text-primary/70 text-sm">
                  Selecciona los recursos para el servicio
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Grúa Selection */}
                  <div>
                    <Label className="text-primary">Grúa *</Label>
                    {selectedGrua ? (
                      <div className="border-2 border-dashed border-green-500 rounded-lg p-4 bg-green-500/10">
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-medium">
                            {selectedGrua.patente} - {selectedGrua.marca} {selectedGrua.modelo} ({selectedGrua.tipo})
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => clearSelection('gruaId')}
                            className="text-primary border-primary/30 hover:bg-red-500/20"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setShowGruaSelection(true)}
                        variant="outline"
                        className="w-full border-2 border-dashed border-primary/30 text-primary hover:border-green-500 hover:bg-green-500/10"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Seleccionar Grúa
                      </Button>
                    )}
                  </div>

                  {/* Operador Selection */}
                  <div>
                    <Label className="text-primary">Operador *</Label>
                    {selectedOperador ? (
                      <div className="border-2 border-dashed border-green-500 rounded-lg p-4 bg-green-500/10">
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-medium">
                            {selectedOperador.nombreCompleto} - {selectedOperador.rut}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => clearSelection('operadorId')}
                            className="text-primary border-primary/30 hover:bg-red-500/20"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setShowOperadorSelection(true)}
                        variant="outline"
                        className="w-full border-2 border-dashed border-primary/30 text-primary hover:border-green-500 hover:bg-green-500/10"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Seleccionar Operador
                      </Button>
                    )}
                  </div>

                  {/* Tipo de Servicio Selection */}
                  <div>
                    <Label className="text-primary">Tipo de Servicio</Label>
                    {selectedTipoServicio ? (
                      <div className="border-2 border-dashed border-green-500 rounded-lg p-4 bg-green-500/10">
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-medium">
                            {selectedTipoServicio.nombre}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => clearSelection('tipoServicioId')}
                            className="text-primary border-primary/30 hover:bg-red-500/20"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setShowTipoServicioSelection(true)}
                        variant="outline"
                        className="w-full border-2 border-dashed border-primary/30 text-primary hover:border-green-500 hover:bg-green-500/10"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Seleccionar Tipo de Servicio
                      </Button>
                    )}
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
          </div>

          {/* Selection Panels */}
          <div className="lg:col-span-1 space-y-4">
            {/* Grúas Selection Panel */}
            {showGruaSelection && (
              <Card className="bg-black border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary text-sm flex items-center justify-between">
                    <span>Seleccionar Grúa</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowGruaSelection(false)}
                      className="text-primary border-primary/30"
                    >
                      ✕
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                  {gruas.filter(grua => grua.activo).map((grua) => (
                    <Button
                      key={grua.id}
                      onClick={() => handleGruaSelect(grua.id)}
                      variant="outline"
                      className="w-full text-left justify-start p-3 border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <div className="text-sm">
                        <div className="font-medium">{grua.patente}</div>
                        <div className="text-primary/70">{grua.marca} {grua.modelo} ({grua.tipo})</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Operadores Selection Panel */}
            {showOperadorSelection && (
              <Card className="bg-black border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary text-sm flex items-center justify-between">
                    <span>Seleccionar Operador</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowOperadorSelection(false)}
                      className="text-primary border-primary/30"
                    >
                      ✕
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                  {operadores.filter(operador => operador.activo).map((operador) => (
                    <Button
                      key={operador.id}
                      onClick={() => handleOperadorSelect(operador.id)}
                      variant="outline"
                      className="w-full text-left justify-start p-3 border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <div className="text-sm">
                        <div className="font-medium">{operador.nombreCompleto}</div>
                        <div className="text-primary/70">{operador.rut}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Tipos de Servicio Selection Panel */}
            {showTipoServicioSelection && (
              <Card className="bg-black border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary text-sm flex items-center justify-between">
                    <span>Seleccionar Tipo de Servicio</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowTipoServicioSelection(false)}
                      className="text-primary border-primary/30"
                    >
                      ✕
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                  {tiposServicio.filter(tipo => tipo.activo).map((tipo) => (
                    <Button
                      key={tipo.id}
                      onClick={() => handleTipoServicioSelect(tipo.id)}
                      variant="outline"
                      className="w-full text-left justify-start p-3 border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <div className="text-sm">
                        <div className="font-medium">{tipo.nombre}</div>
                        {tipo.descripcion && (
                          <div className="text-primary/70 text-xs">{tipo.descripcion}</div>
                        )}
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Info Panel when no selection is active */}
            {!showGruaSelection && !showOperadorSelection && !showTipoServicioSelection && (
              <Card className="bg-black border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary text-sm">Información</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary/70 text-sm">
                    Selecciona los botones en "Asignación del Servicio" para elegir grúa, operador y tipo de servicio.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

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
