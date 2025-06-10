
export interface Cliente {
  id: string;
  razonSocial: string;
  rut: string;
  telefono: string;
  email: string;
  direccion: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Grua {
  id: string;
  patente: string;
  marca: string;
  modelo: string;
  tipo: 'Liviana' | 'Mediana' | 'Pesada';
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Operador {
  id: string;
  nombreCompleto: string;
  rut: string;
  telefono: string;
  numeroLicencia: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TipoServicio {
  id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Servicio {
  id: string;
  fecha: Date;
  folio: string;
  clienteId: string;
  cliente?: Cliente;
  ordenCompra?: string;
  marcaVehiculo: string;
  modeloVehiculo: string;
  patente: string;
  ubicacionOrigen: string;
  ubicacionDestino: string;
  valor: number;
  gruaId: string;
  grua?: Grua;
  operadorId: string;
  operador?: Operador;
  tipoServicioId: string;
  tipoServicio?: TipoServicio;
  estado: 'en_curso' | 'cerrado' | 'facturado';
  observaciones?: string;
  cierreId?: string;
  facturaId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cierre {
  id: string;
  folio: string;
  fechaInicio: Date;
  fechaFin: Date;
  clienteId?: string;
  cliente?: Cliente;
  total: number;
  servicios: Servicio[];
  facturado: boolean;
  facturaId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Factura {
  id: string;
  folio: string;
  fecha: Date;
  fechaVencimiento: Date;
  cierreId: string;
  cierre?: Cierre;
  subtotal: number;
  iva: number;
  total: number;
  estado: 'pendiente' | 'pagada' | 'vencida';
  fechaPago?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EstadisticasGenerales {
  totalServicios: number;
  serviciosEnCurso: number;
  serviciosCerrados: number;
  serviciosFacturados: number;
  ingresosTotales: number;
  ingresosMes: number;
  clientesActivos: number;
  serviciosPendientesFacturacion: number;
  facturasVencidas: number;
}
