
import { useCallback } from 'react';
import { ValidacionResultado } from '@/types/migracion';
import { datosReferencia } from '@/data/migracionData';

export const useMigracionValidator = () => {
  
  // Mapeo de columnas flexible
  const mapearColumnas = (headers: string[]): Record<string, string> => {
    const mapeo: Record<string, string> = {};
    
    headers.forEach(header => {
      const headerLower = header.toLowerCase().trim();
      
      // Mapeo para fecha_servicio
      if (headerLower.includes('fecha') && headerLower.includes('servic')) {
        mapeo['fecha_servicio'] = header;
      }
      
      // Mapeo para marca_vehiculo
      if (headerLower.includes('marca') && headerLower.includes('vehic')) {
        mapeo['marca_vehiculo'] = header;
      }
      
      // Mapeo para modelo_vehiculo
      if (headerLower.includes('modelo') && headerLower.includes('vehic')) {
        mapeo['modelo_vehiculo'] = header;
      }
      
      // Mapeo para patente
      if (headerLower.includes('patente')) {
        mapeo['patente'] = header;
      }
      
      // Mapeo para ubicacion_origen
      if ((headerLower.includes('ubicacion') && headerLower.includes('or')) || 
          (headerLower.includes('origen'))) {
        mapeo['ubicacion_origen'] = header;
      }
      
      // Mapeo para ubicacion_destino
      if ((headerLower.includes('ubicacion') && headerLower.includes('de')) || 
          (headerLower.includes('destino'))) {
        mapeo['ubicacion_destino'] = header;
      }
      
      // Mapeo para cliente_nombre
      if (headerLower.includes('cliente') && headerLower.includes('nom')) {
        mapeo['cliente_nombre'] = header;
      }
      
      // Mapeo para cliente_rut
      if (headerLower.includes('cliente') && headerLower.includes('rut')) {
        mapeo['cliente_rut'] = header;
      }
      
      // Mapeo para grua_patente
      if (headerLower.includes('grua') && headerLower.includes('pat')) {
        mapeo['grua_patente'] = header;
      }
      
      // Mapeo para operador_nombre
      if (headerLower.includes('operador') && headerLower.includes('nom')) {
        mapeo['operador_nombre'] = header;
      }
      
      // Mapeo para tipo_servicio
      if (headerLower.includes('tipo') && headerLower.includes('servic')) {
        mapeo['tipo_servicio'] = header;
      }
      
      // Mapeo para valor_servicio
      if (headerLower.includes('valor') && headerLower.includes('servic')) {
        mapeo['valor_servicio'] = header;
      }
    });
    
    return mapeo;
  };
  
  const validarRUT = (rut: string): boolean => {
    if (!rut) return false;
    
    // Remover puntos y guión
    const rutLimpio = rut.replace(/[.-]/g, '');
    
    if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;
    
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toLowerCase();
    
    // Validar que el cuerpo sea numérico
    if (!/^\d+$/.test(cuerpo)) return false;
    
    // Calcular dígito verificador
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const resto = suma % 11;
    const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'k' : (11 - resto).toString();
    
    return dv === dvCalculado;
  };

  const validarFecha = (fecha: string): boolean => {
    if (!fecha) return false;
    
    const fechaObj = new Date(fecha);
    return !isNaN(fechaObj.getTime()) && fechaObj <= new Date();
  };

  const validarDatos = useCallback((datos: any[], headers?: string[]): ValidacionResultado[] => {
    const validaciones: ValidacionResultado[] = [];
    
    // Si tenemos headers, crear mapeo de columnas
    let mapeoColumnas: Record<string, string> = {};
    if (headers) {
      mapeoColumnas = mapearColumnas(headers);
      console.log('Mapeo de columnas detectado:', mapeoColumnas);
    }
    
    // Función helper para obtener valor de una fila usando el mapeo
    const obtenerValor = (fila: any, campo: string): any => {
      const columnaReal = mapeoColumnas[campo] || campo;
      return fila[columnaReal];
    };
    
    datos.forEach((fila, index) => {
      const numeroFila = index + 2; // +2 porque empezamos en fila 2 (header es fila 1)
      
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
      
      // Validar marca_vehiculo
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
      
      // Validar modelo_vehiculo
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
      
      // Validar patente (obligatoria pero sin validar formato)
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
      
      // Validar ubicaciones
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
      
      // Validar cliente
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
      
      // Si no hay errores en esta fila, marcar como válida
      const erroresEnFila = validaciones.filter(v => v.fila === numeroFila && v.nivel === 'error');
      if (erroresEnFila.length === 0) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'valido',
          campo: 'general',
          mensaje: 'Registro válido para migración',
          valorOriginal: 'OK'
        });
      }
    });
    
    return validaciones;
  }, []);

  return {
    validarDatos
  };
};
