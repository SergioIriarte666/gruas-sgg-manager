
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClientes } from "@/hooks/useClientes";
import { useGruas } from "@/hooks/useGruas";
import { useOperadores } from "@/hooks/useOperadores";
import { useTiposServicio } from "@/hooks/useTiposServicio";
import { useCreateServicio } from "@/hooks/useCreateServicio";
import { servicioFormSchema, ServicioFormData } from "@/components/forms/schemas/servicioSchema";
import { DatePickerField } from "@/components/forms/fields/DatePickerField";
import { VehicleInfoFields } from "@/components/forms/fields/VehicleInfoFields";
import { LocationFields } from "@/components/forms/fields/LocationFields";
import { ServiceAssignmentFields } from "@/components/forms/fields/ServiceAssignmentFields";

interface FormularioServicioProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const FormularioServicio: React.FC<FormularioServicioProps> = ({ onSuccess, onCancel }) => {
  const { data: clientes = [] } = useClientes();
  const { data: gruas = [] } = useGruas();
  const { data: operadores = [] } = useOperadores();
  const { data: tiposServicio = [] } = useTiposServicio();
  const { mutate: crearServicio, isPending, error } = useCreateServicio();

  const form = useForm<ServicioFormData>({
    resolver: zodResolver(servicioFormSchema),
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

  function onSubmit(values: ServicioFormData) {
    console.log('Form values:', values);
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
        <DatePickerField
          control={form.control}
          name="fecha"
          label="Fecha"
          description="Fecha en la que se realizó el servicio."
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

        <VehicleInfoFields control={form.control} />
        <LocationFields control={form.control} />

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

        <ServiceAssignmentFields
          control={form.control}
          gruas={gruas}
          operadores={operadores}
          tiposServicio={tiposServicio}
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
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creando...' : 'Crear Servicio'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
