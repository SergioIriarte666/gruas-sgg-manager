
import { useState } from 'react';
import { useCreateServicio } from './useCreateServicio';
import { mapearDatosMigracion, buildEntityCache, MigracionDataRow, EntityCache } from '@/utils/migracionDataMapper';
import { mapearColumnas } from '@/utils/columnMapper';

interface ProcesamientoResultado {
  exito: boolean;
  error?: string;
  folio?: string;
}

interface ProcesamientoEstado {
  iniciado: boolean;
  completado: boolean;
  progreso: number;
  procesados: number;
  exitos: number;
  errores: number;
  registroActual?: string;
  resultados: ProcesamientoResultado[];
}

export const useMigracionProcessor = () => {
  const [estado, setEstado] = useState<ProcesamientoEstado>({
    iniciado: false,
    completado: false,
    progreso: 0,
    procesados: 0,
    exitos: 0,
    errores: 0,
    resultados: []
  });

  const { mutateAsync: crearServicio } = useCreateServicio();

  const procesarMigracion = async (datos: any[], headers?: string[]) => {
    console.log('useMigracionProcessor: Iniciando procesamiento de migración');
    
    setEstado(prev => ({ 
      ...prev, 
      iniciado: true,
      completado: false,
      progreso: 0,
      procesados: 0,
      exitos: 0,
      errores: 0,
      resultados: []
    }));

    try {
      // Construir cache de entidades
      console.log('useMigracionProcessor: Construyendo cache de entidades...');
      const cache = await buildEntityCache();

      // Crear mapeo de columnas si tenemos headers
      let mapeoColumnas: Record<string, string> = {};
      if (headers) {
        mapeoColumnas = mapearColumnas(headers);
        console.log('useMigracionProcessor: Mapeo de columnas:', mapeoColumnas);
      }

      const obtenerValor = (fila: any, campo: string): any => {
        const columnaReal = mapeoColumnas[campo] || campo;
        return fila[columnaReal];
      };

      const total = datos.length;
      const resultados: ProcesamientoResultado[] = [];

      for (let i = 0; i < total; i++) {
        const filaOriginal = datos[i];
        const progreso = ((i + 1) / total) * 100;
        
        try {
          // Mapear datos usando el mapeo de columnas
          const filaMapeada: MigracionDataRow = {
            fecha_servicio: obtenerValor(filaOriginal, 'fecha_servicio'),
            marca_vehiculo: obtenerValor(filaOriginal, 'marca_vehiculo'),
            modelo_vehiculo: obtenerValor(filaOriginal, 'modelo_vehiculo'),
            patente: obtenerValor(filaOriginal, 'patente'),
            ubicacion_origen: obtenerValor(filaOriginal, 'ubicacion_origen'),
            ubicacion_destino: obtenerValor(filaOriginal, 'ubicacion_destino'),
            cliente_nombre: obtenerValor(filaOriginal, 'cliente_nombre'),
            cliente_rut: obtenerValor(filaOriginal, 'cliente_rut'),
            grua_patente: obtenerValor(filaOriginal, 'grua_patente'),
            operador_nombre: obtenerValor(filaOriginal, 'operador_nombre'),
            tipo_servicio: obtenerValor(filaOriginal, 'tipo_servicio'),
            valor_servicio: obtenerValor(filaOriginal, 'valor_servicio'),
            orden_compra: obtenerValor(filaOriginal, 'orden_compra'),
            observaciones: obtenerValor(filaOriginal, 'observaciones')
          };

          console.log(`useMigracionProcessor: Procesando registro ${i + 1}/${total}:`, filaMapeada);

          // Transformar datos al formato esperado por el servicio
          const servicioData = mapearDatosMigracion(filaMapeada, cache);
          
          const registroActual = `${servicioData.marcaVehiculo} ${servicioData.patente}`;
          
          setEstado(prev => ({
            ...prev,
            progreso: Math.round(progreso),
            procesados: i + 1,
            registroActual
          }));

          // Crear el servicio
          const resultado = await crearServicio(servicioData);
          
          resultados.push({
            exito: true,
            folio: resultado.folio
          });

          setEstado(prev => ({
            ...prev,
            exitos: prev.exitos + 1,
            resultados: [...prev.resultados, { exito: true, folio: resultado.folio }]
          }));

          console.log(`useMigracionProcessor: Servicio creado exitosamente: ${resultado.folio}`);

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          console.error(`useMigracionProcessor: Error procesando registro ${i + 1}:`, errorMessage);
          
          resultados.push({
            exito: false,
            error: errorMessage
          });

          setEstado(prev => ({
            ...prev,
            errores: prev.errores + 1,
            resultados: [...prev.resultados, { exito: false, error: errorMessage }]
          }));
        }

        // Pequeña pausa para permitir que la UI se actualice
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      setEstado(prev => ({ 
        ...prev, 
        completado: true, 
        registroActual: undefined,
        resultados
      }));

      console.log('useMigracionProcessor: Migración completada', {
        total,
        exitos: resultados.filter(r => r.exito).length,
        errores: resultados.filter(r => !r.exito).length
      });

    } catch (error) {
      console.error('useMigracionProcessor: Error crítico en migración:', error);
      setEstado(prev => ({ 
        ...prev, 
        completado: true,
        registroActual: undefined 
      }));
      throw error;
    }
  };

  const resetEstado = () => {
    setEstado({
      iniciado: false,
      completado: false,
      progreso: 0,
      procesados: 0,
      exitos: 0,
      errores: 0,
      resultados: []
    });
  };

  return {
    estado,
    procesarMigracion,
    resetEstado
  };
};
