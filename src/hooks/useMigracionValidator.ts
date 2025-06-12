
import { useCallback } from 'react';
import { ValidacionResultado } from '@/types/migracion';
import { datosReferencia } from '@/data/migracionData';

export const useMigracionValidator = () => {
  
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

  const validarPatente = (patente: string): boolean => {
    if (!patente) return false;
    
    // Patentes chilenas: ABCD12 o AB1234
    const patenteRegex = /^[A-Z]{2}\d{4}$|^[A-Z]{4}\d{2}$/;
    return patenteRegex.test(patente.toUpperCase());
  };

  const validarFecha = (fecha: string): boolean => {
    if (!fecha) return false;
    
    const fechaObj = new Date(fecha);
    return !isNaN(fechaObj.getTime()) && fechaObj <= new Date();
  };

  const validarDatos = useCallback((datos: any[]): ValidacionResultado[] => {
    const validaciones: ValidacionResultado[] = [];
    
    datos.forEach((fila, index) => {
      const numeroFila = index + 2; // +2 porque empezamos en fila 2 (header es fila 1)
      
      // Validar fecha_servicio
      if (!fila.fecha_servicio) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'fecha_servicio',
          mensaje: 'Fecha de servicio es obligatoria',
          valorOriginal: fila.fecha_servicio
        });
      } else if (!validarFecha(fila.fecha_servicio)) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'fecha_servicio',
          mensaje: 'Formato de fecha inválido',
          valorOriginal: fila.fecha_servicio,
          sugerencia: 'Use formato YYYY-MM-DD'
        });
      }
      
      // Validar marca_vehiculo
      if (!fila.marca_vehiculo) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'marca_vehiculo',
          mensaje: 'Marca del vehículo es obligatoria',
          valorOriginal: fila.marca_vehiculo
        });
      }
      
      // Validar modelo_vehiculo
      if (!fila.modelo_vehiculo) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'modelo_vehiculo',
          mensaje: 'Modelo del vehículo es obligatorio',
          valorOriginal: fila.modelo_vehiculo
        });
      }
      
      // Validar patente
      if (!fila.patente) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'patente',
          mensaje: 'Patente es obligatoria',
          valorOriginal: fila.patente
        });
      } else if (!validarPatente(fila.patente)) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'patente',
          mensaje: 'Formato de patente inválido',
          valorOriginal: fila.patente,
          sugerencia: 'Use formato chileno: ABCD12 o AB1234'
        });
      }
      
      // Validar ubicaciones
      if (!fila.ubicacion_origen) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'ubicacion_origen',
          mensaje: 'Ubicación de origen es obligatoria',
          valorOriginal: fila.ubicacion_origen
        });
      }
      
      if (!fila.ubicacion_destino) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'ubicacion_destino',
          mensaje: 'Ubicación de destino es obligatoria',
          valorOriginal: fila.ubicacion_destino
        });
      }
      
      // Validar cliente
      if (!fila.cliente_nombre) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'cliente_nombre',
          mensaje: 'Nombre del cliente es obligatorio',
          valorOriginal: fila.cliente_nombre
        });
      }
      
      if (!fila.cliente_rut) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'cliente_rut',
          mensaje: 'RUT del cliente es obligatorio',
          valorOriginal: fila.cliente_rut
        });
      } else if (!validarRUT(fila.cliente_rut)) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'cliente_rut',
          mensaje: 'RUT del cliente inválido',
          valorOriginal: fila.cliente_rut,
          sugerencia: 'Verifique el formato y dígito verificador'
        });
      }
      
      // Validar grúa
      if (!fila.grua_patente) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'grua_patente',
          mensaje: 'Patente de grúa es obligatoria',
          valorOriginal: fila.grua_patente
        });
      } else {
        const gruaExiste = datosReferencia.gruas.some(g => g.patente === fila.grua_patente);
        if (!gruaExiste) {
          validaciones.push({
            fila: numeroFila,
            nivel: 'advertencia',
            campo: 'grua_patente',
            mensaje: 'Grúa no encontrada en el sistema',
            valorOriginal: fila.grua_patente,
            sugerencia: 'Se creará automáticamente'
          });
        }
      }
      
      // Validar operador
      if (!fila.operador_nombre) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'operador_nombre',
          mensaje: 'Nombre del operador es obligatorio',
          valorOriginal: fila.operador_nombre
        });
      } else {
        const operadorExiste = datosReferencia.operadores.some(o => o.nombre === fila.operador_nombre);
        if (!operadorExiste) {
          validaciones.push({
            fila: numeroFila,
            nivel: 'advertencia',
            campo: 'operador_nombre',
            mensaje: 'Operador no encontrado en el sistema',
            valorOriginal: fila.operador_nombre,
            sugerencia: 'Se creará automáticamente'
          });
        }
      }
      
      // Validar tipo de servicio
      if (!fila.tipo_servicio) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'tipo_servicio',
          mensaje: 'Tipo de servicio es obligatorio',
          valorOriginal: fila.tipo_servicio
        });
      } else {
        const tipoExiste = datosReferencia.tiposServicio.includes(fila.tipo_servicio);
        if (!tipoExiste) {
          validaciones.push({
            fila: numeroFila,
            nivel: 'advertencia',
            campo: 'tipo_servicio',
            mensaje: 'Tipo de servicio no encontrado',
            valorOriginal: fila.tipo_servicio,
            sugerencia: 'Se creará automáticamente'
          });
        }
      }
      
      // Validar valor_servicio (opcional pero si existe debe ser numérico)
      if (fila.valor_servicio && isNaN(Number(fila.valor_servicio))) {
        validaciones.push({
          fila: numeroFila,
          nivel: 'error',
          campo: 'valor_servicio',
          mensaje: 'Valor del servicio debe ser numérico',
          valorOriginal: fila.valor_servicio
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
