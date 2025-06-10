import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from 'date-fns';
import { DatePicker } from "@/components/ui/date-picker"
import { CalendarIcon } from "@radix-ui/react-icons"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClientes } from "@/hooks/useClientes";
import { useGruas } from "@/hooks/useGruas";
import { useOperadores } from "@/hooks/useOperadores";
import { useTiposServicio } from "@/hooks/useTiposServicio";
import { useCreateServicio } from "@/hooks/useCreateServicio";

const formSchema = z.object({
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
  ubicacionOrigen: z.string().optional(),
  ubicacionDestino: z.string().optional(),
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

interface FormularioServicioProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const FormularioServicio: React.FC<FormularioServicioProps> = ({ onSuccess, onCancel }) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(new Date());
  const { data: clientes = [] } = useClientes();
  const { data: gruas = [] } = useGruas();
  const { data: operadores = [] } = useOperadores();
  const { data: tiposServicio = [] } = useTiposServicio();
  const { mutate: crearServicio, isLoading, error } = useCreateServicio();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha: new Date(),
      clienteId: "",
      ordenCompra: "",
      marcaVehiculo: "",
      modeloVehiculo: "",
      patente: "",
      ubicacionOrigen: "",
      ubicacionDestino: "",
      valor: 10000,
      gruaId: "",
      operadorId: "",
      tipoServicioId: "",
      estado: 'en_curso',
      observaciones: "",
    },
  });

  useEffect(() => {
    if (fechaSeleccionada) {
      form.setValue("fecha", fechaSeleccionada);
    }
  }, [fechaSeleccionada, form.setValue]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    crearServicio(values, {
      onSuccess: () => {
        form.reset();
        onSuccess();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha</FormLabel>
              <Controller
                name="fecha"
                control={form.control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onSelect={setFechaSeleccionada}
                    dateFormat="dd/MM/yyyy"
                  />
                )}
              />
              <FormDescription>
                Fecha en la que se realizó el servicio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clienteId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.razonSocial}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Cliente que solicitó el servicio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ordenCompra"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orden de Compra</FormLabel>
              <FormControl>
                <Input placeholder="Número de orden de compra" {...field} />
              </FormControl>
              <FormDescription>
                Número de orden de compra del cliente (opcional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="marcaVehiculo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Marca del Vehículo</FormLabel>
                <FormControl>
                  <Input placeholder="Marca" {...field} />
                </FormControl>
                <FormDescription>
                  Marca del vehículo a remolcar.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="modeloVehiculo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Modelo del Vehículo</FormLabel>
                <FormControl>
                  <Input placeholder="Modelo" {...field} />
                </FormControl>
                <FormDescription>
                  Modelo del vehículo a remolcar.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="patente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patente del Vehículo</FormLabel>
              <FormControl>
                <Input placeholder="Patente" {...field} />
              </FormControl>
              <FormDescription>
                Patente del vehículo a remolcar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="ubicacionOrigen"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Ubicación de Origen</FormLabel>
                <FormControl>
                  <Input placeholder="Ubicación de origen" {...field} />
                </FormControl>
                <FormDescription>
                  Ubicación donde se recogió el vehículo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ubicacionDestino"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Ubicación de Destino</FormLabel>
                <FormControl>
                  <Input placeholder="Ubicación de destino" {...field} />
                </FormControl>
                <FormDescription>
                  Ubicación a donde se llevó el vehículo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor del Servicio</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Valor"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Valor del servicio en pesos chilenos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gruaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grúa Asignada</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una grúa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {gruas.map((grua) => (
                    <SelectItem key={grua.id} value={grua.id}>
                      {grua.patente} - {grua.marca} {grua.modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Grúa asignada para realizar el servicio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="operadorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operador Asignado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un operador" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {operadores.map((operador) => (
                    <SelectItem key={operador.id} value={operador.id}>
                      {operador.nombreCompleto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Operador asignado para realizar el servicio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipoServicioId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Servicio</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo de servicio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tiposServicio.map((tipoServicio) => (
                    <SelectItem key={tipoServicio.id} value={tipoServicio.id}>
                      {tipoServicio.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Tipo de servicio realizado.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado del Servicio</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="en_curso">En Curso</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                  <SelectItem value="facturado">Facturado</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Estado actual del servicio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="observaciones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observaciones adicionales"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Observaciones adicionales sobre el servicio (opcional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <div className="text-red-500">
            {error instanceof Error ? error.message : 'Error al crear el servicio'}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creando...' : 'Crear Servicio'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
