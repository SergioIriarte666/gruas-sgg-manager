
import { useCallback } from 'react';
import { ValidacionResultado } from '@/types/migracion';
import { mapearColumnas } from '@/utils/columnMapper';
import { 
  validarCamposObligatorios,
  validarUbicaciones,
  validarCliente,
  validarRecursos,
  validarServicio
} from '@/utils/fieldValidators';

export const useMigracionValidator = () => {
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
      
      // Validar diferentes aspectos de los datos
      validaciones.push(
        ...validarCamposObligatorios(fila, numeroFila, obtenerValor),
        ...validarUbicaciones(fila, numeroFila, obtenerValor),
        ...validarCliente(fila, numeroFila, obtenerValor),
        ...validarRecursos(fila, numeroFila, obtenerValor),
        ...validarServicio(fila, numeroFila, obtenerValor)
      );
      
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
