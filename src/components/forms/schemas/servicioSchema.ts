
import * as z from "zod";

export const servicioFormSchema = z.object({
  fecha: z.date({
    required_error: "Se requiere una fecha.",
  }),
  folio: z.string().optional(), // Folio manual opcional
  clienteId: z.string({
    required_error: "Se requiere un cliente.",
  }).min(1, "Cliente requerido"),
  ordenCompra: z.string().optional(),
  marcaVehiculo: z.string({
    required_error: "Se requiere la marca del vehículo.",
  }).min(1, "Marca requerida"),
  modeloVehiculo: z.string({
    required_error: "Se requiere el modelo del vehículo.",
  }).min(1, "Modelo requerido"),
  patente: z.string({
    required_error: "Se requiere la patente del vehículo.",
  }).min(1, "Patente requerida"),
  ubicacionOrigen: z.string({
    required_error: "Se requiere la ubicación de origen.",
  }).min(1, "Ubicación origen requerida"),
  ubicacionDestino: z.string({
    required_error: "Se requiere la ubicación de destino.",
  }).min(1, "Ubicación destino requerida"),
  valor: z.number({
    required_error: "Se requiere un valor.",
  }).min(1, "El valor debe ser mayor a 0"),
  gruaId: z.string({
    required_error: "Se requiere una grúa.",
  }).min(1, "Grúa requerida"),
  operadorId: z.string({
    required_error: "Se requiere un operador.",
  }).min(1, "Operador requerido"),
  tipoServicioId: z.string({
    required_error: "Se requiere un tipo de servicio.",
  }).min(1, "Tipo de servicio requerido"),
  estado: z.enum(['en_curso', 'cerrado', 'facturado'], {
    required_error: "Se requiere un estado.",
  }),
  observaciones: z.string().optional(),
});

// Tipo que coincide exactamente con lo que espera la API
export type ServicioFormData = {
  fecha: Date;
  folio?: string;
  clienteId: string;
  ordenCompra?: string;
  marcaVehiculo: string;
  modeloVehiculo: string;
  patente: string;
  ubicacionOrigen: string;
  ubicacionDestino: string;
  valor: number;
  gruaId: string;
  operadorId: string;
  tipoServicioId: string;
  estado: 'en_curso' | 'cerrado' | 'facturado';
  observaciones?: string;
};

// Alias para compatibilidad
export const servicioSchema = servicioFormSchema;
