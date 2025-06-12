
import React, { useState } from 'react';
import { Calendar, Truck, User, MapPin, FileText, Camera, Clock, Fuel, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { useClientes } from '@/hooks/useClientes';
import { useGruas } from '@/hooks/useGruas';
import { useOperadores } from '@/hooks/useOperadores';
import { useTiposServicio } from '@/hooks/useTiposServicio';
import { useCreateServicio } from '@/hooks/useCreateServicio';
import { useToast } from '@/hooks/use-toast';

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
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-green-400 mb-4">📊 Datos Básicos del Servicio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">Fecha del Servicio</label>
          <input
            type="date"
            value={formData.fecha.toISOString().split('T')[0]}
            onChange={(e) => handleInputChange('fecha', new Date(e.target.value))}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Folio (Opcional)</label>
          <input
            type="text"
            value={formData.folio}
            onChange={(e) => handleInputChange('folio', e.target.value)}
            placeholder="Folio manual"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">Marca del Vehículo *</label>
          <input
            type="text"
            value={formData.marcaVehiculo}
            onChange={(e) => handleInputChange('marcaVehiculo', e.target.value)}
            placeholder="Toyota, Mercedes, etc."
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Modelo del Vehículo *</label>
          <input
            type="text"
            value={formData.modeloVehiculo}
            onChange={(e) => handleInputChange('modeloVehiculo', e.target.value)}
            placeholder="Corolla, Sprinter, etc."
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Patente *</label>
          <input
            type="text"
            value={formData.patente}
            onChange={(e) => handleInputChange('patente', e.target.value.toUpperCase())}
            placeholder="ABCD12"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">Ubicación de Origen *</label>
          <input
            type="text"
            value={formData.ubicacionOrigen}
            onChange={(e) => handleInputChange('ubicacionOrigen', e.target.value)}
            placeholder="Dirección donde se recogió el vehículo"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Ubicación de Destino *</label>
          <input
            type="text"
            value={formData.ubicacionDestino}
            onChange={(e) => handleInputChange('ubicacionDestino', e.target.value)}
            placeholder="Dirección de entrega"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-green-400 mb-4">🏢 Asignación del Servicio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">Orden de Compra (Opcional)</label>
          <input
            type="text"
            value={formData.ordenCompra}
            onChange={(e) => handleInputChange('ordenCompra', e.target.value)}
            placeholder="Número de orden de compra"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Valor del Servicio</label>
          <input
            type="number"
            value={formData.valor}
            onChange={(e) => handleInputChange('valor', Number(e.target.value))}
            placeholder="0"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">Cliente *</label>
          <select
            value={formData.clienteId}
            onChange={(e) => handleInputChange('clienteId', e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          >
            <option value="">Seleccionar cliente</option>
            {clientes.filter(c => c.activo).map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razonSocial} - {cliente.rut}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Grúa *</label>
          <select
            value={formData.gruaId}
            onChange={(e) => handleInputChange('gruaId', e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          >
            <option value="">Seleccionar grúa</option>
            {gruas.filter(g => g.activo).map(grua => (
              <option key={grua.id} value={grua.id}>
                {grua.patente} - {grua.marca} {grua.modelo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">Operador *</label>
          <select
            value={formData.operadorId}
            onChange={(e) => handleInputChange('operadorId', e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          >
            <option value="">Seleccionar operador</option>
            {operadores.filter(o => o.activo).map(operador => (
              <option key={operador.id} value={operador.id}>
                {operador.nombreCompleto} - {operador.telefono}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Tipo de Servicio *</label>
          <select
            value={formData.tipoServicioId}
            onChange={(e) => handleInputChange('tipoServicioId', e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          >
            <option value="">Seleccionar tipo</option>
            {tiposServicio.filter(t => t.activo).map(tipo => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Observaciones (Opcional)</label>
        <textarea
          value={formData.observaciones}
          onChange={(e) => handleInputChange('observaciones', e.target.value)}
          placeholder="Observaciones adicionales sobre el servicio"
          rows={3}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-green-400 mb-4">📋 Detalles para Reporte Cliente</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">Hora Asignación</label>
          <input
            type="time"
            value={formData.hora_asignacion}
            onChange={(e) => handleInputChange('hora_asignacion', e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Hora Llegada</label>
          <input
            type="time"
            value={formData.hora_llegada}
            onChange={(e) => handleInputChange('hora_llegada', e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Hora Término</label>
          <input
            type="time"
            value={formData.hora_termino}
            onChange={(e) => handleInputChange('hora_termino', e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">KM Inicial</label>
          <input
            type="number"
            value={formData.km_inicial}
            onChange={(e) => handleInputChange('km_inicial', e.target.value)}
            placeholder="0"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">KM Final</label>
          <input
            type="number"
            value={formData.km_final}
            onChange={(e) => handleInputChange('km_final', e.target.value)}
            placeholder="0"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">KM Vehículo</label>
          <input
            type="number"
            value={formData.km_vehiculo}
            onChange={(e) => handleInputChange('km_vehiculo', e.target.value)}
            placeholder="0"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Nivel Combustible</label>
          <select
            value={formData.nivel_combustible}
            onChange={(e) => handleInputChange('nivel_combustible', e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
          >
            {nivelesGasolina.map(nivel => (
              <option key={nivel} value={nivel}>{nivel}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-gray-300">Equipamiento Presente</label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, equipamiento: [...equipamientoCompleto] }))}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-500 transition-colors"
            >
              ✅ Seleccionar Todo
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, equipamiento: [] }))}
              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-500 transition-colors"
            >
              ❌ Deseleccionar Todo
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {equipamientoCompleto.map(item => (
            <label key={item} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.equipamiento.includes(item)}
                onChange={(e) => handleEquipamientoChange(item, e.target.checked)}
                className="text-green-400"
              />
              <span className="text-gray-300">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Tipo de Asistencia Detallado</label>
        <input
          type="text"
          value={formData.tipo_asistencia_detallado}
          onChange={(e) => handleInputChange('tipo_asistencia_detallado', e.target.value)}
          placeholder="Descripción específica del tipo de asistencia"
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Daños y Condiciones</label>
        <textarea
          value={formData.danos_condiciones}
          onChange={(e) => handleInputChange('danos_condiciones', e.target.value)}
          placeholder="Descripción de daños visibles y condiciones generales"
          rows={3}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Observaciones Técnicas</label>
        <textarea
          value={formData.observaciones_tecnicas}
          onChange={(e) => handleInputChange('observaciones_tecnicas', e.target.value)}
          placeholder="Observaciones técnicas detalladas"
          rows={3}
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-400">
            <Truck className="inline mr-2" />
            SGG Grúa PWA
          </h1>
          <div className="text-sm text-gray-400">
            Paso {currentStep} de 3
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800 px-4 py-2">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-green-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-w-4xl mx-auto">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Status Messages */}
        {submitStatus && (
          <div className={`mt-6 p-4 rounded-lg flex items-center space-x-2 ${
            submitStatus.type === 'success' 
              ? 'bg-green-900 border border-green-700' 
              : 'bg-red-900 border border-red-700'
          }`}>
            {submitStatus.type === 'success' ? 
              <CheckCircle className="text-green-400" /> : 
              <AlertCircle className="text-red-400" />
            }
            <span>{submitStatus.message}</span>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            Anterior
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={currentStep === 1 ? !isStep1Valid() : currentStep === 2 ? !isFormValid() : false}
              className="px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 transition-colors"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className="px-8 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  <span>Crear Servicio</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-green-400 font-bold mb-2">🔧 Estado del Sistema:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Paso 1 (Datos Básicos):</strong> {isStep1Valid() ? '✅ Completo' : '❌ Incompleto'}
            </div>
            <div>
              <strong>Paso 2 (Asignación):</strong> {isStep2Valid() ? '✅ Completo' : '❌ Pendiente'}
            </div>
            <div>
              <strong>Equipamiento Seleccionado:</strong> {formData.equipamiento.length}/15
            </div>
            <div>
              <strong>Tiempo de Servicio:</strong> {calculateServiceTime()}
            </div>
          </div>
          
          {currentStep <= 2 && (
            <div className="mt-4 p-3 bg-gray-700 rounded text-sm">
              <strong>Estado Actual:</strong> 
              {currentStep === 1 && isStep1Valid() && ' ✅ Paso 1 completo - Puedes continuar al Paso 2'}
              {currentStep === 1 && !isStep1Valid() && ' ❌ Completa los campos básicos del vehículo'}
              {currentStep === 2 && !isStep2Valid() && ' ❌ Selecciona cliente, grúa, operador y tipo de servicio'}
              {currentStep === 2 && isStep2Valid() && ' ✅ Paso 2 completo - Puedes continuar al Paso 3'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SGGGruaPWA;
