
import * as z from "zod";

export const servicioFormSchema = z.object({
  fecha: z.date({
    required_error: "Se requiere una fecha.",
  }),
  clienteId: z.string({
    required_error: "Se requiere un cliente.",
  }),
  ordenCompra: z.string().optional(),
  marcaVehiculo: z.string({
    required_error: "Se requiere la marca del vehículo.",
  }),
  modeloVehiculo: z.string({
    required_error: "Se requiere el modelo del vehículo.",
  }),
  patente: z.string({
    required_error: "Se requiere la patente del vehículo.",
  }),
  ubicacionOrigen: z.string({
    required_error: "Se requiere la ubicación de origen.",
  }),
  ubicacionDestino: z.string({
    required_error: "Se requiere la ubicación de destino.",
  }),
  valor: z.number({
    required_error: "Se requiere un valor.",
  }).min(1, "El valor debe ser mayor a 0"),
  gruaId: z.string({
    required_error: "Se requiere una grúa.",
  }),
  operadorId: z.string({
    required_error: "Se requiere un operador.",
  }),
  tipoServicioId: z.string({
    required_error: "Se requiere un tipo de servicio.",
  }),
  estado: z.enum(['en_curso', 'cerrado', 'facturado'], {
    required_error: "Se requiere un estado.",
  }),
  observaciones: z.string().optional(),
});

export type ServicioFormData = z.infer<typeof servicioFormSchema>;
