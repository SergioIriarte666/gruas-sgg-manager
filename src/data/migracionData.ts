
export const datosReferencia = {
  clientes: [
    { nombre: "Empresa Transporte A", rut: "76123456-7", telefono: "+56912345678" },
    { nombre: "Cliente Particular B", rut: "12345678-9", telefono: "+56987654321" },
    { nombre: "Logística Central", rut: "77234567-8", telefono: "+56923456789" },
    { nombre: "Transporte Sur Ltda", rut: "96234567-1", telefono: "+56934567890" },
    { nombre: "Distribuidora Norte", rut: "78345678-2", telefono: "+56945678901" }
  ],
  gruas: [
    { patente: "ABCD12", modelo: "Volvo FH 460", capacidad: "25 ton", estado: "Activa" },
    { patente: "EFGH34", modelo: "Mercedes Actros", capacidad: "20 ton", estado: "Activa" },
    { patente: "IJKL56", modelo: "Scania R450", capacidad: "30 ton", estado: "Mantenimiento" },
    { patente: "MNOP78", modelo: "DAF XF", capacidad: "18 ton", estado: "Activa" },
    { patente: "QRST90", modelo: "Iveco Stralis", capacidad: "22 ton", estado: "Activa" }
  ],
  operadores: [
    { nombre: "Juan Pérez", telefono: "+56912345678", licencia: "A3", estado: "Activo" },
    { nombre: "Pedro López", telefono: "+56987654321", licencia: "A3", estado: "Activo" },
    { nombre: "Carlos González", telefono: "+56923456789", licencia: "A4", estado: "Activo" },
    { nombre: "Luis Martínez", telefono: "+56956789012", licencia: "A3", estado: "Activo" },
    { nombre: "Roberto Silva", telefono: "+56967890123", licencia: "A4", estado: "Activo" }
  ],
  tiposServicio: [
    "Remolque Completo", 
    "Asistencia In-Situ", 
    "Mantención Preventiva",
    "Rescate de Vehículo", 
    "Transporte de Carga", 
    "Servicio de Emergencia"
  ]
};

export const estadisticasMock = {
  totalMigraciones: 12,
  serviciosProcesados: 2847,
  ultimaMigracion: "2025-06-10",
  exitos: 2701,
  errores: 146
};

export const historialMock = [
  {
    id: "1",
    fecha: new Date("2025-06-10"),
    archivo: "servicios_mayo_2025.xlsx",
    servicios: 235,
    exitos: 220,
    errores: 15,
    estado: "completada" as const
  },
  {
    id: "2", 
    fecha: new Date("2025-06-08"),
    archivo: "migracion_abril.csv",
    servicios: 189,
    exitos: 189,
    errores: 0,
    estado: "completada" as const
  },
  {
    id: "3",
    fecha: new Date("2025-06-05"),
    archivo: "datos_marzo.xlsx", 
    servicios: 156,
    exitos: 142,
    errores: 14,
    estado: "completada" as const
  }
];
