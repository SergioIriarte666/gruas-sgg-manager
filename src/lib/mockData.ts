
import { Cliente, Grua, Operador, TipoServicio, Servicio, Cierre, Factura } from '@/types';

export const mockClientes: Cliente[] = [
  {
    id: '1',
    razonSocial: 'Transportes López S.A.',
    rut: '76.543.210-K',
    telefono: '+56 9 8765 4321',
    email: 'contacto@transporteslopez.cl',
    direccion: 'Av. Providencia 1234, Santiago',
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    razonSocial: 'Constructora San Miguel Ltda.',
    rut: '85.123.456-7',
    telefono: '+56 9 7654 3210',
    email: 'info@constructorasanmiguel.cl',
    direccion: 'Calle Los Robles 567, Las Condes',
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    razonSocial: 'Rent a Car Premium',
    rut: '92.654.321-8',
    telefono: '+56 9 6543 2109',
    email: 'reservas@rentcarpremium.cl',
    direccion: 'Av. Kennedy 890, Vitacura',
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const mockGruas: Grua[] = [
  {
    id: '1',
    patente: 'GRUA-01',
    marca: 'Isuzu',
    modelo: 'NPR 75',
    tipo: 'Liviana',
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    patente: 'GRUA-02',
    marca: 'Hino',
    modelo: '500 Series',
    tipo: 'Mediana',
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    patente: 'GRUA-03',
    marca: 'Volvo',
    modelo: 'FMX',
    tipo: 'Pesada',
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const mockOperadores: Operador[] = [
  {
    id: '1',
    nombreCompleto: 'Carlos Mendoza Rivera',
    rut: '12.345.678-9',
    telefono: '+56 9 8765 4321',
    numeroLicencia: 'A2-123456',
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    nombreCompleto: 'Ana María González',
    rut: '23.456.789-0',
    telefono: '+56 9 7654 3210',
    numeroLicencia: 'A2-234567',
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    nombreCompleto: 'Roberto Silva Peña',
    rut: '34.567.890-1',
    telefono: '+56 9 6543 2109',
    numeroLicencia: 'A2-345678',
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const mockTiposServicio: TipoServicio[] = [
  {
    id: '1',
    nombre: 'Remolque Urbano',
    descripcion: 'Servicio de remolque dentro de la ciudad',
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    nombre: 'Remolque Carretera',
    descripcion: 'Servicio de remolque en carretera',
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    nombre: 'Auxilio Mecánico',
    descripcion: 'Auxilio mecánico en terreno',
    activo: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const mockServicios: Servicio[] = [
  {
    id: '1',
    fecha: new Date('2024-06-08'),
    folio: 'G5N-001',
    clienteId: '1',
    ordenCompra: 'OC-2024-001',
    marcaVehiculo: 'Toyota',
    modeloVehiculo: 'Corolla',
    patente: 'ABCD12',
    ubicacionOrigen: 'Av. Providencia 1500, Santiago',
    ubicacionDestino: 'Taller Mecánico Sur, San Bernardo',
    valor: 45000,
    gruaId: '1',
    operadorId: '1',
    tipoServicioId: '1',
    estado: 'en_curso',
    observaciones: 'Vehículo con falla en la transmisión',
    createdAt: new Date('2024-06-08'),
    updatedAt: new Date('2024-06-08')
  },
  {
    id: '2',
    fecha: new Date('2024-06-07'),
    folio: 'G5N-002',
    clienteId: '2',
    marcaVehiculo: 'Ford',
    modeloVehiculo: 'F-150',
    patente: 'EFGH34',
    ubicacionOrigen: 'Ruta 5 Sur, Km 45',
    ubicacionDestino: 'Taller Ford, Maipú',
    valor: 75000,
    gruaId: '2',
    operadorId: '2',
    tipoServicioId: '2',
    estado: 'cerrado',
    observaciones: 'Accidente menor en carretera',
    createdAt: new Date('2024-06-07'),
    updatedAt: new Date('2024-06-07')
  },
  {
    id: '3',
    fecha: new Date('2024-06-06'),
    folio: 'G5N-003',
    clienteId: '3',
    ordenCompra: 'OC-2024-002',
    marcaVehiculo: 'BMW',
    modeloVehiculo: 'X3',
    patente: 'IJKL56',
    ubicacionOrigen: 'Aeropuerto SCL',
    ubicacionDestino: 'Concesionario BMW, Las Condes',
    valor: 85000,
    gruaId: '3',
    operadorId: '3',
    tipoServicioId: '1',
    estado: 'facturado',
    observaciones: 'Vehículo de cliente premium',
    createdAt: new Date('2024-06-06'),
    updatedAt: new Date('2024-06-06')
  }
];

// Agregar relaciones a los servicios mock
mockServicios.forEach(servicio => {
  servicio.cliente = mockClientes.find(c => c.id === servicio.clienteId);
  servicio.grua = mockGruas.find(g => g.id === servicio.gruaId);
  servicio.operador = mockOperadores.find(o => o.id === servicio.operadorId);
  servicio.tipoServicio = mockTiposServicio.find(t => t.id === servicio.tipoServicioId);
});
