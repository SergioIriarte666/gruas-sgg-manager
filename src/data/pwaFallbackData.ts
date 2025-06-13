
import { Grua, Operador, TipoServicio } from '@/types';

// Fallback data for offline PWA mode
export const fallbackGruas: Grua[] = [
  {
    id: 'offline-grua-1',
    patente: 'OFFLINE-01',
    marca: 'Mercedes-Benz',
    modelo: 'Atego',
    tipo: 'Mediana',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const fallbackOperadores: Operador[] = [
  {
    id: 'offline-operador-1',
    nombreCompleto: 'Operador Offline',
    rut: '12345678-9',
    telefono: '+56912345678',
    numeroLicencia: 'A1-12345',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const fallbackTiposServicio: TipoServicio[] = [
  {
    id: 'offline-tipo-1',
    nombre: 'Servicio General',
    descripcion: 'Servicio de grúa general (modo offline)',
    activo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getFallbackData = () => ({
  gruas: fallbackGruas,
  operadores: fallbackOperadores,
  tiposServicio: fallbackTiposServicio
});
