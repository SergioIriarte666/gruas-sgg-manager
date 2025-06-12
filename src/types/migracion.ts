
export interface ServicioSGG {
  fecha_servicio: string;
  marca_vehiculo: string;
  modelo_vehiculo: string;
  patente: string;
  ubicacion_origen: string;
  ubicacion_destino: string;
  cliente_nombre: string;
  cliente_rut: string;
  grua_patente: string;
  operador_nombre: string;
  tipo_servicio: string;
}

export interface ServicioOpcional {
  folio?: string;
  orden_compra?: string;
  valor_servicio?: number;
  observaciones?: string;
  hora_asignacion?: string;
  hora_llegada?: string;
  hora_termino?: string;
  km_inicial?: number;
  km_final?: number;
  nivel_combustible?: string;
}

export interface ServicioCompleto extends ServicioSGG, ServicioOpcional {}

export interface MigracionEstadisticas {
  totalMigraciones: number;
  serviciosProcesados: number;
  ultimaMigracion: string;
  exitos: number;
  errores: number;
}

export interface HistorialMigracion {
  id: string;
  fecha: Date;
  archivo: string;
  servicios: number;
  exitos: number;
  errores: number;
  estado: 'completada' | 'fallida' | 'en_proceso';
}

export interface ValidacionResultado {
  fila: number;
  nivel: 'valido' | 'advertencia' | 'error';
  campo: string;
  mensaje: string;
  valorOriginal: any;
  sugerencia?: string;
}

export interface EstadoProceso {
  paso: 1 | 2 | 3 | 4;
  archivo?: File;
  datos?: any[];
  mapeoColumnas?: Record<string, string>;
  validaciones?: ValidacionResultado[];
  procesando: boolean;
  completado: boolean;
}
