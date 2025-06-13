
import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGruas } from '@/hooks/useGruas';
import { useOperadores } from '@/hooks/useOperadores';
import { useTiposServicio } from '@/hooks/useTiposServicio';
import { generateClientReportPDF } from '@/utils/pdfClientGenerator';
import { EquipmentChecklist } from '@/components/EquipmentChecklist';
import { DamageImageCapture } from '@/components/pwa/DamageImageCapture';
import { ServiceAssignment } from '@/components/pwa/ServiceAssignment';

interface CapturedImage {
  id: string;
  file: File;
  preview: string;
  timestamp: Date;
}

// Safe wrapper component to handle React Query context
function SGGGruaPWAContent() {
  const { toast } = useToast();
  
  // Hooks for real data - now safely wrapped
  const { data: gruas = [], isLoading: gruasLoading } = useGruas();
  const { data: operadores = [], isLoading: operadoresLoading } = useOperadores();
  const { data: tiposServicio = [], isLoading: tiposServicioLoading } = useTiposServicio();
  
  // Show loading state while data is being fetched
  if (gruasLoading || operadoresLoading || tiposServicioLoading) {
    return (
      <div className="min-h-screen bg-black text-primary p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary/70">Cargando datos...</p>
        </div>
      </div>
    );
  }
  
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEquipmentToggle = (itemId: string) => {
    setEquipmentVerification(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleSelectAllEquipment = () => {
    const allSelected: Record<string, boolean> = {};
    // Get all equipment items from the EquipmentChecklist component
    const equipmentItems = [
      'radio', 'espejo_retrovisor', 'cenicero', 'encendedor', 'alfombras', 'tapasoles',
      'guantera', 'consola_central', 'aire_acondicionado', 'calefaccion', 'antena',
      'espejos_laterales', 'emblemas', 'molduras', 'parachoques', 'rejilla', 'tapacubos',
      'llantas', 'faros_delanteros', 'faros_traseros', 'luces_direccionales', 'luz_placa',
      'luces_freno', 'luz_reversa', 'cinturones', 'extintor', 'triangulos', 'botiquin',
      'llanta_repuesto', 'gato', 'llave_ruedas', 'manual_usuario', 'tarjeta_propiedad',
      'revision_tecnica', 'seguro', 'llaves_contacto', 'control_alarma', 'estuche_llaves',
      'tapa_combustible'
    ];
    
    equipmentItems.forEach(item => {
      allSelected[item] = true;
    });
    setEquipmentVerification(allSelected);
  };

  const handleDeselectAllEquipment = () => {
    setEquipmentVerification({});
  };

  const clearSelection = (field: 'gruaId' | 'operadorId' | 'tipoServicioId') => {
    handleInputChange(field, '');
  };

  // Get selected items for display
  const selectedGrua = gruas.find(g => g.id === formData.gruaId);
  const selectedOperador = operadores.find(o => o.id === formData.operadorId);
  const selectedTipoServicio = tiposServicio.find(t => t.id === formData.tipoServicioId);

  const generatePDF = async () => {
    try {
      const pdf = await generateClientReportPDF(
        formData,
        { selectedGrua, selectedOperador, selectedTipoServicio },
        equipmentVerification,
        damageImages
      );

      // Save PDF
      const fileName = `reporte_cliente_${formData.patente || 'vehiculo'}_${Date.now()}.pdf`;
      pdf.save(fileName);

      toast({
        title: "PDF generado exitosamente",
        description: "El reporte cliente se ha descargado correctamente"
      });

      return pdf.output('blob');
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

        {/* Service Assignment with enhanced drag and drop */}
        <ServiceAssignment
          gruaId={formData.gruaId}
          operadorId={formData.operadorId}
          tipoServicioId={formData.tipoServicioId}
          onGruaSelect={(id) => handleInputChange('gruaId', id)}
          onOperadorSelect={(id) => handleInputChange('operadorId', id)}
          onTipoServicioSelect={(id) => handleInputChange('tipoServicioId', id)}
          onClearSelection={clearSelection}
        />

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

        {/* Enhanced Equipment Verification */}
        <EquipmentChecklist
          checkedItems={equipmentVerification}
          onItemToggle={handleEquipmentToggle}
          onSelectAll={handleSelectAllEquipment}
          onDeselectAll={handleDeselectAllEquipment}
        />

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

        {/* Damage Images */}
        <DamageImageCapture
          damageImages={damageImages}
          onImageCapture={setDamageImages}
        />

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

        {/* Actions */}
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
    </div>
  );
}

// Error boundary component
class SGGGruaPWAErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('SGGGruaPWA Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-primary p-4 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-primary mb-4">
              Error cargando la aplicación
            </h2>
            <p className="text-primary/70 mb-4">
              Hay un problema con la conexión a la base de datos.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-primary text-black hover:bg-primary/90"
            >
              Recargar página
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main component with error boundary and suspense
export default function SGGGruaPWA() {
  return (
    <SGGGruaPWAErrorBoundary>
      <Suspense 
        fallback={
          <div className="min-h-screen bg-black text-primary p-4 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-primary/70">Cargando aplicación...</p>
            </div>
          </div>
        }
      >
        <SGGGruaPWAContent />
      </Suspense>
    </SGGGruaPWAErrorBoundary>
  );
}
