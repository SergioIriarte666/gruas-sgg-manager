
import { useState } from 'react';
import { EstadoProceso } from '@/types/migracion';

export const useMigracionState = () => {
  const [estado, setEstado] = useState<EstadoProceso>({
    paso: 1,
    procesando: false,
    completado: false
  });

  const avanzarPaso = () => {
    setEstado(prev => ({ ...prev, paso: (prev.paso + 1) as EstadoProceso['paso'] }));
  };

  const retrocederPaso = () => {
    setEstado(prev => ({ ...prev, paso: (prev.paso - 1) as EstadoProceso['paso'] }));
  };

  const irAPaso = (paso: EstadoProceso['paso']) => {
    setEstado(prev => ({ ...prev, paso }));
  };

  const setArchivo = (archivo: File) => {
    setEstado(prev => ({ ...prev, archivo }));
  };

  const setDatos = (datos: any[]) => {
    setEstado(prev => ({ ...prev, datos }));
  };

  const setValidaciones = (validaciones: any[]) => {
    setEstado(prev => ({ ...prev, validaciones }));
  };

  const setProcesando = (procesando: boolean) => {
    setEstado(prev => ({ ...prev, procesando }));
  };

  const setCompletado = (completado: boolean) => {
    setEstado(prev => ({ ...prev, completado }));
  };

  const resetEstado = () => {
    setEstado({
      paso: 1,
      procesando: false,
      completado: false
    });
  };

  return {
    estado,
    avanzarPaso,
    retrocederPaso,
    irAPaso,
    setArchivo,
    setDatos,
    setValidaciones,
    setProcesando,
    setCompletado,
    resetEstado
  };
};
