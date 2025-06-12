
import React, { useState } from 'react';
import { Calendar, Truck, User, MapPin, FileText, Camera, Clock, Fuel, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { useClientes } from '@/hooks/useClientes';
import { useGruas } from '@/hooks/useGruas';
import { useOperadores } from '@/hooks/useOperadores';
import { useTiposServicio } from '@/hooks/useTiposServicio';
import { useCreateServicio } from '@/hooks/useCreateServicio';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const SGGGruaPWA = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // Hooks para datos
  const { data: clientes = [] } = useClientes();
  const { data: gruas = [] } = useGruas();
  const { data: operadores = [] } = useOperadores();
  const { data: tiposServicio = [] } = useTiposServicio();
  const createServicio = useCreateServicio();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // === CAMPOS SGG MANAGER (OBLIGATORIOS) ===
    fecha: new Date(),
    folio: '',
    marcaVehiculo: '',
    modeloVehiculo: '',
    patente: '',
    ubicacionOrigen: '',
    ubicacionDestino: '',
    valor: 0,
    clienteId: '',
    gruaId: '',
    operadorId: '',
    tipoServicioId: '',
    estado: 'en_curso' as const,
    observaciones: '',
    ordenCompra: '',
    
    // === CAMPOS ADICIONALES PARA REPORTE CLIENTE ===
    hora_asignacion: '',
    hora_llegada: '',
    hora_termino: '',
    km_inicial: '',
    km_final: '',
    km_vehiculo: '',
    nivel_combustible: '3/4',
    equipamiento: [] as string[],
    tipo_asistencia_detallado: '',
    danos_condiciones: '',
    observaciones_tecnicas: ''
  });

  const equipamientoCompleto = [
    'Gato hidráulico', 'Herramientas básicas', 'Triángulos de seguridad',
    'Extintor', 'Botiquín primeros auxilios', 'Cable de remolque',
    'Llanta de repuesto', 'Llave de ruedas', 'Manual del vehículo',
    'Documentación completa', 'Radio comunicaciones', 'GPS navegación',
    'Linterna emergencia', 'Chaleco reflectante', 'Conos de seguridad'
  ];

  const nivelesGasolina = ['Vacío', '1/4', '1/2', '3/4', 'Completo'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEquipamientoChange = (item: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      equipamiento: checked 
        ? [...prev.equipamiento, item]
        : prev.equipamiento.filter(eq => eq !== item)
    }));
  };

  // === FUNCIÓN ENVÍO A SGG MANAGER ===
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      console.log('📊 Enviando a SGG Manager:', formData);
      
      // Crear servicio usando el hook existente
      const servicioData = {
        fecha: formData.fecha,
        folio: formData.folio,
        clienteId: formData.clienteId,
        ordenCompra: formData.ordenCompra,
        marcaVehiculo: formData.marcaVehiculo,
        modeloVehiculo: formData.modeloVehiculo,
        patente: formData.patente.toUpperCase(),
        ubicacionOrigen: formData.ubicacionOrigen,
        ubicacionDestino: formData.ubicacionDestino,
        valor: Number(formData.valor),
        gruaId: formData.gruaId,
        operadorId: formData.operadorId,
        tipoServicioId: formData.tipoServicioId,
        estado: formData.estado,
        observaciones: formData.observaciones
      };

      const result = await createServicio.mutateAsync(servicioData);
      console.log('✅ Servicio creado exitosamente:', result);

      // Simular generación de reporte completo para cliente
      const reporteCompleto = {
        ...formData,
        sgg_service_id: result?.id || 'temp-id',
        equipamiento_faltante: equipamientoCompleto.filter(item => 
          !formData.equipamiento.includes(item)
        ),
        tiempo_total: calculateServiceTime(),
        generated_at: new Date().toISOString()
      };

      console.log('📋 Reporte completo generado:', reporteCompleto);

      setSubmitStatus({
        type: 'success',
        message: `Servicio creado exitosamente. Reporte disponible para envío al cliente.`
      });

      toast({
        title: "Servicio creado",
        description: "El servicio PWA ha sido creado exitosamente.",
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          fecha: new Date(),
          folio: '',
          marcaVehiculo: '',
          modeloVehiculo: '',
          patente: '',
          ubicacionOrigen: '',
          ubicacionDestino: '',
          valor: 0,
          clienteId: '',
          gruaId: '',
          operadorId: '',
          tipoServicioId: '',
          estado: 'en_curso' as const,
          observaciones: '',
          ordenCompra: '',
          hora_asignacion: '',
          hora_llegada: '',
          hora_termino: '',
          km_inicial: '',
          km_final: '',
          km_vehiculo: '',
          nivel_combustible: '3/4',
          equipamiento: [],
          tipo_asistencia_detallado: '',
          danos_condiciones: '',
          observaciones_tecnicas: ''
        });
        setCurrentStep(1);
        setSubmitStatus(null);
      }, 3000);

    } catch (error: any) {
      console.error('❌ Error en envío:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Error al procesar el servicio. Intente nuevamente.'
      });

      toast({
        title: "Error",
        description: "Error al crear el servicio PWA. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateServiceTime = () => {
    if (formData.hora_asignacion && formData.hora_termino) {
      const inicio = new Date(`2000-01-01T${formData.hora_asignacion}`);
      const fin = new Date(`2000-01-01T${formData.hora_termino}`);
      const diff = (fin.getTime() - inicio.getTime()) / (1000 * 60); // minutos
      if (diff > 0) {
        return `${Math.floor(diff / 60)}h ${Math.floor(diff % 60)}m`;
      }
    }
    return 'No calculado';
  };

  const isStep1Valid = () => {
    const step1Fields = ['marcaVehiculo', 'modeloVehiculo', 'patente', 'ubicacionOrigen', 'ubicacionDestino'];
    return step1Fields.every(field => formData[field as keyof typeof formData] && 
      String(formData[field as keyof typeof formData]).trim() !== '');
  };

  const isStep2Valid = () => {
    const step2Fields = ['clienteId', 'gruaId', 'operadorId', 'tipoServicioId'];
    return step2Fields.every(field => formData[field as keyof typeof formData] && 
      String(formData[field as keyof typeof formData]).trim() !== '');
  };

  const isFormValid = () => {
    return isStep1Valid() && isStep2Valid();
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <FileText className="h-5 w-5" />
          Datos Básicos del Servicio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha del Servicio</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha.toISOString().split('T')[0]}
              onChange={(e) => handleInputChange('fecha', new Date(e.target.value))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="folio">Folio (Opcional)</Label>
            <Input
              id="folio"
              type="text"
              value={formData.folio}
              onChange={(e) => handleInputChange('folio', e.target.value)}
              placeholder="Folio manual"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="marcaVehiculo">Marca del Vehículo *</Label>
            <Input
              id="marcaVehiculo"
              type="text"
              value={formData.marcaVehiculo}
              onChange={(e) => handleInputChange('marcaVehiculo', e.target.value)}
              placeholder="Toyota, Mercedes, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="modeloVehiculo">Modelo del Vehículo *</Label>
            <Input
              id="modeloVehiculo"
              type="text"
              value={formData.modeloVehiculo}
              onChange={(e) => handleInputChange('modeloVehiculo', e.target.value)}
              placeholder="Corolla, Sprinter, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="patente">Patente *</Label>
            <Input
              id="patente"
              type="text"
              value={formData.patente}
              onChange={(e) => handleInputChange('patente', e.target.value.toUpperCase())}
              placeholder="ABCD12"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ubicacionOrigen">Ubicación de Origen *</Label>
            <Input
              id="ubicacionOrigen"
              type="text"
              value={formData.ubicacionOrigen}
              onChange={(e) => handleInputChange('ubicacionOrigen', e.target.value)}
              placeholder="Dirección donde se recogió el vehículo"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ubicacionDestino">Ubicación de Destino *</Label>
            <Input
              id="ubicacionDestino"
              type="text"
              value={formData.ubicacionDestino}
              onChange={(e) => handleInputChange('ubicacionDestino', e.target.value)}
              placeholder="Dirección de entrega"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <User className="h-5 w-5" />
          Asignación del Servicio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ordenCompra">Orden de Compra (Opcional)</Label>
            <Input
              id="ordenCompra"
              type="text"
              value={formData.ordenCompra}
              onChange={(e) => handleInputChange('ordenCompra', e.target.value)}
              placeholder="Número de orden de compra"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valor">Valor del Servicio</Label>
            <Input
              id="valor"
              type="number"
              value={formData.valor}
              onChange={(e) => handleInputChange('valor', Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clienteId">Cliente *</Label>
            <Select value={formData.clienteId} onValueChange={(value) => handleInputChange('clienteId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.filter(c => c.activo).map(cliente => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.razonSocial} - {cliente.rut}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gruaId">Grúa *</Label>
            <Select value={formData.gruaId} onValueChange={(value) => handleInputChange('gruaId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar grúa" />
              </SelectTrigger>
              <SelectContent>
                {gruas.filter(g => g.activo).map(grua => (
                  <SelectItem key={grua.id} value={grua.id}>
                    {grua.patente} - {grua.marca} {grua.modelo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="operadorId">Operador *</Label>
            <Select value={formData.operadorId} onValueChange={(value) => handleInputChange('operadorId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar operador" />
              </SelectTrigger>
              <SelectContent>
                {operadores.filter(o => o.activo).map(operador => (
                  <SelectItem key={operador.id} value={operador.id}>
                    {operador.nombreCompleto} - {operador.telefono}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tipoServicioId">Tipo de Servicio *</Label>
            <Select value={formData.tipoServicioId} onValueChange={(value) => handleInputChange('tipoServicioId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposServicio.filter(t => t.activo).map(tipo => (
                  <SelectItem key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
          <Input
            id="observaciones"
            value={formData.observaciones}
            onChange={(e) => handleInputChange('observaciones', e.target.value)}
            placeholder="Observaciones adicionales sobre el servicio"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Clock className="h-5 w-5" />
          Detalles para Reporte Cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hora_asignacion">Hora Asignación</Label>
            <Input
              id="hora_asignacion"
              type="time"
              value={formData.hora_asignacion}
              onChange={(e) => handleInputChange('hora_asignacion', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hora_llegada">Hora Llegada</Label>
            <Input
              id="hora_llegada"
              type="time"
              value={formData.hora_llegada}
              onChange={(e) => handleInputChange('hora_llegada', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hora_termino">Hora Término</Label>
            <Input
              id="hora_termino"
              type="time"
              value={formData.hora_termino}
              onChange={(e) => handleInputChange('hora_termino', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="km_inicial">KM Inicial</Label>
            <Input
              id="km_inicial"
              type="number"
              value={formData.km_inicial}
              onChange={(e) => handleInputChange('km_inicial', e.target.value)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="km_final">KM Final</Label>
            <Input
              id="km_final"
              type="number"
              value={formData.km_final}
              onChange={(e) => handleInputChange('km_final', e.target.value)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="km_vehiculo">KM Vehículo</Label>
            <Input
              id="km_vehiculo"
              type="number"
              value={formData.km_vehiculo}
              onChange={(e) => handleInputChange('km_vehiculo', e.target.value)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nivel_combustible">Nivel Combustible</Label>
            <Select value={formData.nivel_combustible} onValueChange={(value) => handleInputChange('nivel_combustible', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {nivelesGasolina.map(nivel => (
                  <SelectItem key={nivel} value={nivel}>{nivel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Equipamiento Presente</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, equipamiento: [...equipamientoCompleto] }))}
              >
                ✅ Todo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({ ...prev, equipamiento: [] }))}
              >
                ❌ Ninguno
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {equipamientoCompleto.map(item => (
              <label key={item} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.equipamiento.includes(item)}
                  onChange={(e) => handleEquipamientoChange(item, e.target.checked)}
                  className="rounded border-border"
                />
                <span className="text-muted-foreground">{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo_asistencia_detallado">Tipo de Asistencia Detallado</Label>
          <Input
            id="tipo_asistencia_detallado"
            value={formData.tipo_asistencia_detallado}
            onChange={(e) => handleInputChange('tipo_asistencia_detallado', e.target.value)}
            placeholder="Descripción específica del tipo de asistencia"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="danos_condiciones">Daños y Condiciones</Label>
          <Input
            id="danos_condiciones"
            value={formData.danos_condiciones}
            onChange={(e) => handleInputChange('danos_condiciones', e.target.value)}
            placeholder="Descripción de daños visibles y condiciones generales"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observaciones_tecnicas">Observaciones Técnicas</Label>
          <Input
            id="observaciones_tecnicas"
            value={formData.observaciones_tecnicas}
            onChange={(e) => handleInputChange('observaciones_tecnicas', e.target.value)}
            placeholder="Observaciones técnicas detalladas"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Truck className="h-6 w-6" />
              SGG Grúa PWA
            </h1>
            <Badge variant="outline">
              Paso {currentStep} de 3
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-2">
          <Progress value={(currentStep / 3) * 100} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="animate-fade-in">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Status Messages */}
        {submitStatus && (
          <Alert className={`mt-6 ${
            submitStatus.type === 'success' 
              ? 'border-primary bg-primary/10' 
              : 'border-destructive bg-destructive/10'
          }`}>
            {submitStatus.type === 'success' ? 
              <CheckCircle className="h-4 w-4 text-primary" /> : 
              <AlertCircle className="h-4 w-4 text-destructive" />
            }
            <AlertDescription>
              {submitStatus.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={currentStep === 1 ? !isStep1Valid() : currentStep === 2 ? !isFormValid() : false}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Crear Servicio</span>
                </>
              )}
            </Button>
          )}
        </div>

        {/* Debug Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span>Paso 1 (Datos Básicos):</span>
                <Badge variant={isStep1Valid() ? "default" : "secondary"}>
                  {isStep1Valid() ? '✅ Completo' : '❌ Incompleto'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Paso 2 (Asignación):</span>
                <Badge variant={isStep2Valid() ? "default" : "secondary"}>
                  {isStep2Valid() ? '✅ Completo' : '❌ Pendiente'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Equipamiento Seleccionado:</span>
                <Badge variant="outline">{formData.equipamiento.length}/15</Badge>
              </div>
              <div className="flex justify-between">
                <span>Tiempo de Servicio:</span>
                <Badge variant="outline">{calculateServiceTime()}</Badge>
              </div>
            </div>
            
            {currentStep <= 2 && (
              <Alert className="mt-4">
                <AlertDescription>
                  <strong>Estado Actual:</strong> 
                  {currentStep === 1 && isStep1Valid() && ' ✅ Paso 1 completo - Puedes continuar al Paso 2'}
                  {currentStep === 1 && !isStep1Valid() && ' ❌ Completa los campos básicos del vehículo'}
                  {currentStep === 2 && !isStep2Valid() && ' ❌ Selecciona cliente, grúa, operador y tipo de servicio'}
                  {currentStep === 2 && isStep2Valid() && ' ✅ Paso 2 completo - Puedes continuar al Paso 3'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SGGGruaPWA;
