
import { ValidacionResultado } from '@/types/migracion';
import { validarRUT, validarFecha } from './dataValidators';
import { datosReferencia } from '@/data/migracionData';

export const validarCamposObligatorios = (
  fila: any,
  numeroFila: number,
  obtenerValor: (fila: any, campo: string) => any
): ValidacionResultado[] => {
  const validaciones: ValidacionResultado[] = [];

  // Validar fecha_servicio
  const fechaServicio = obtenerValor(fila, 'fecha_servicio');
  if (!fechaServicio) {
    validaciones.push({
      fila: numeroFila,
      nivel: 'error',
      campo: 'fecha_servicio',
      mensaje: 'Fecha de servicio es obligatoria',
      valorOriginal: fechaServicio
    });
  } else if (!validarFecha(fechaServicio)) {
    validaciones.push({
      fila: numeroFila,
      nivel: 'error',
      campo: 'fecha_servicio',
      mensaje: 'Formato de fecha inválido',
      valorOriginal: fechaServicio,
      sugerencia: 'Use formato YYYY-MM-DD'
    });
  }

  // Validar campos de vehículo
  const marcaVehiculo = obtenerValor(fila, 'marca_vehiculo');
  if (!marcaVehiculo) {
    validaciones.push({
      fila: numeroFila,
      nivel: 'error',
      campo: 'marca_vehiculo',
      mensaje: 'Marca del vehículo es obligatoria',
      valorOriginal: marcaVehiculo
    });
  }

  const modeloVehiculo = obtenerValor(fila, 'modelo_vehiculo');
  if (!modeloVehiculo) {
    validaciones.push({
      fila: numeroFila,
      nivel: 'error',
      campo: 'modelo_vehiculo',
      mensaje: 'Modelo del vehículo es obligatorio',
      valorOriginal: modeloVehiculo
    });
  }

  const patente = obtenerValor(fila, 'patente');
  if (!patente) {
    validaciones.push({
      fila: numeroFila,
      nivel: 'error',
      campo: 'patente',
      mensaje: 'Patente es obligatoria',
      valorOriginal: patente
    });
  }

  return validaciones;
};

export const validarUbicaciones = (
  fila: any,
  numeroFila: number,
  obtenerValor: (fila: any, campo: string) => any
): ValidacionResultado[] => {
  const validaciones: ValidacionResultado[] = [];

  const ubicacionOrigen = obtenerValor(fila, 'ubicacion_origen');
  if (!ubicacionOrigen) {
    validaciones.push({
      fila: numeroFila,
      nivel: 'error',
      campo: 'ubicacion_origen',
      mensaje: 'Ubicación de origen es obligatoria',
      valorOriginal: ubicacionOrigen
    });
  }

  const ubicacionDestino = obtenerValor(fila, 'ubicacion_destino');
  if (!ubicacionDestino) {
    validaciones.push({
      fila: numeroFila,
      nivel: 'error',
      campo: 'ubicacion_destino',
      mensaje: 'Ubicación de destino es obligatoria',
      valorOriginal: ubicacionDestino
    });
  }

  return validaciones;
};

export const validarCliente = (
  fila: any,
  numeroFila: number,
  obtenerValor: (fila: any, campo: string) => any
): ValidacionResultado[] => {
  const validaciones: ValidacionResultado[] = [];

  const clienteNombre = obtenerValor(fila, 'cliente_nombre');
  if (!clienteNombre) {
    validaciones.push({
      fila: numeroFila,
      nivel: 'error',
      campo: 'cliente_nombre',
      mensaje: 'Nombre del cliente es obligatorio',
      valorOriginal: clienteNombre
    });
  }

  // RUT del cliente es opcional, pero si existe debe ser válido
  const clienteRut = obtenerValor(fila, 'cliente_rut');
  if (clienteRut && !validarRUT(clienteRut)) {
    validaciones.push({
      fila: numeroFila,
      nivel: 'error',
      campo: 'cliente_rut',
      mensaje: 'RUT del cliente inválido',
      valorOriginal: clienteRut,
      sugerencia: 'Verifique el formato y dígito verificador'
    });
  }

  return validaciones;
};

export const validarRecursos = (
  fila: any,
  numeroFila: number,
  obtenerValor: (fila: any, campo: string) => any
): ValidacionResultado[] => {
  const validaciones: ValidacionResultado[] = [];

  // Validar grúa
  const gruaPatente = obtenerValor(fila, 'grua_patente');
  if (!gruaPatente) {
    validaciones.push({
      fila: numeroFila,
      nivel: 'error',
      campo: 'grua_patente',
      mensaje: 'Patente de grúa es obligatoria',
      valorOriginal: gruaPatente
    });
  } else {
    const gruaExiste = datosReferencia.gruas.some(g => g.patente === gruaPatente);
    if (!gruaExiste) {
      validaciones.push({
        fila: numeroFila,
        nivel: 'advertencia',
        campo: 'grua_patente',
        mensaje: 'Grúa no encontrada en el sistema',
        valorOriginal: gruaPatente,
        sugerencia: 'Se creará automáticamente'
      });
    }
  }

  // Validar operador
  const operadorNombre = obtenerValor(fila, 'operador_nombre');
  if (!operadorNombre) {
    validaciones.push({
      fila: numeroFila,
      nivel: 'error',
      campo: 'operador_nombre',
      mensaje: 'Nombre del operador es obligatorio',
      valorOriginal: operadorNombre
    });
  } else {
    const operadorExiste = datosReferencia.operadores.some(o => o.nombre === operadorNombre);
    if (!operadorExiste) {
      validaciones.push({
        fila: numeroFila,
        nivel: 'advertencia',
        campo: 'operador_nombre',
        mensaje: 'Operador no encontrado en el sistema',
        valorOriginal: operadorNombre,
        sugerencia: 'Se creará automáticamente'
      });
    }
  }

  return validaciones;
};

export const validarServicio = (
  fila: any,
  numeroFila: number,
  obtenerValor: (fila: any, campo: string) => any
): ValidacionResultado[] => {
  const validaciones: ValidacionResultado[] = [];

  // Validar tipo de servicio
  const tipoServicio = obtenerValor(fila, 'tipo_servicio');
  if (!tipoServicio) {
    validaciones.push({
      fila: numeroFila,
      nivel: 'error',
      campo: 'tipo_servicio',
      mensaje: 'Tipo de servicio es obligatorio',
      valorOriginal: tipoServicio
    });
  } else {
    const tipoExiste = datosReferencia.tiposServicio.includes(tipoServicio);
    if (!tipoExiste) {
      validaciones.push({
        fila: numeroFila,
        nivel: 'advertencia',
        campo: 'tipo_servicio',
        mensaje: 'Tipo de servicio no encontrado',
        valorOriginal: tipoServicio,
        sugerencia: 'Se creará automáticamente'
      });
    }
  }

  // Validar valor_servicio (opcional pero si existe debe ser numérico)
  const valorServicio = obtenerValor(fila, 'valor_servicio');
  if (valorServicio && isNaN(Number(valorServicio))) {
    validaciones.push({
      fila: numeroFila,
      nivel: 'error',
      campo: 'valor_servicio',
      mensaje: 'Valor del servicio debe ser numérico',
      valorOriginal: valorServicio
    });
  }

  return validaciones;
};
