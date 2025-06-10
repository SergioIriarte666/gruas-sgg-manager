
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useClientes } from "@/hooks/useClientes";
import { useGruas } from "@/hooks/useGruas";
import { useOperadores } from "@/hooks/useOperadores";
import { useTiposServicio } from "@/hooks/useTiposServicio";
import { useCreateServicio, useUpdateServicio } from "@/hooks/useServicios";
import { Servicio } from "@/types";
import { toast } from "@/components/ui/sonner";

const esquemaServicio = z.object({
  fecha: z.date({
    required_error: "La fecha es requerida",
  }),
  clienteId: z.string().min(1, "Debe seleccionar un cliente"),
  ordenCompra: z.string().optional(),
  marcaVehiculo: z.string().min(1, "La marca del vehículo es requerida"),
  modeloVehiculo: z.string().min(1, "El modelo del vehículo es requerido"),
  patente: z.string().min(1, "La patente es requerida"),
  ubicacionOrigen: z.string().min(1, "La ubicación de origen es requerida"),
  ubicacionDestino: z.string().min(1, "La ubicación de destino es requerida"),
  valor: z.number().min(0, "El valor debe ser mayor a 0"),
  gruaId: z.string().min(1, "Debe seleccionar una grúa"),
  operadorId: z.string().min(1, "Debe seleccionar un operador"),
  tipoServicioId: z.string().min(1, "Debe seleccionar un tipo de servicio"),
  estado: z.enum(['en_curso', 'cerrado', 'facturado']),
  observaciones: z.string().optional(),
});

type DatosFormulario = z.infer<typeof esquemaServicio>;

interface Props {
  servicio?: Servicio;
  onSuccess: () => void;
  onCancel: () => void;
}

export function FormularioServicio({ servicio, onSuccess, onCancel }: Props) {
  const [fechaOpen, setFechaOpen] = useState(false);
  
  const { data: clientes = [] } = useClientes();
  const { data: gruas = [] } = useGruas();
  const { data: operadores = [] } = useOperadores();
  const { data: tiposServicio = [] } = useTiposServicio();
  
  const createMutation = useCreateServicio();
  const updateMutation = useUpdateServicio();
  
  const form = useForm<DatosFormulario>({
    resolver: zodResolver(esquemaServicio),
    defaultValues: {
      fecha: servicio?.fecha || new Date(),
      clienteId: servicio?.clienteId || "",
      ordenCompra: servicio?.ordenCompra || "",
      marcaVehiculo: servicio?.marcaVehiculo || "",
      modeloVehiculo: servicio?.modeloVehiculo || "",
      patente: servicio?.patente || "",
      ubicacionOrigen: servicio?.ubicacionOrigen || "",
      ubicacionDestino: servicio?.ubicacionDestino || "",
      valor: servicio?.valor || 0,
      gruaId: servicio?.gruaId || "",
      operadorId: servicio?.operadorId || "",
      tipoServicioId: servicio?.tipoServicioId || "",
      estado: servicio?.estado || "en_curso",
      observaciones: servicio?.observaciones || "",
    },
  });

  const onSubmit = async (datos: DatosFormulario) => {
    try {
      if (servicio) {
        await updateMutation.mutateAsync({ id: servicio.id, ...datos });
        toast.success("Servicio actualizado exitosamente");
      } else {
        await createMutation.mutateAsync(datos);
        toast.success("Servicio creado exitosamente");
      }
      onSuccess();
    } catch (error) {
      toast.error("Error al guardar el servicio");
      console.error(error);
    }
  };

  const clientesActivos = clientes.filter(c => c.activo);
  const gruasActivas = gruas.filter(g => g.activo);
  const operadoresActivos = operadores.filter(o => o.activo);
  const tiposActivos = tiposServicio.filter(t => t.activo);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha">Fecha del Servicio</Label>
          <Popover open={fechaOpen} onOpenChange={setFechaOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.watch("fecha") && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("fecha") ? (
                  format(form.watch("fecha"), "PPP", { locale: es })
                ) : (
                  <span>Seleccionar fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.watch("fecha")}
                onSelect={(date) => {
                  form.setValue("fecha", date || new Date());
                  setFechaOpen(false);
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.fecha && (
            <p className="text-sm text-red-500">{form.formState.errors.fecha.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cliente">Cliente</Label>
          <Select onValueChange={(value) => form.setValue("clienteId", value)} value={form.watch("clienteId")}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              {clientesActivos.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.razonSocial}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.clienteId && (
            <p className="text-sm text-red-500">{form.formState.errors.clienteId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ordenCompra">Orden de Compra (Opcional)</Label>
          <Input
            id="ordenCompra"
            {...form.register("ordenCompra")}
            placeholder="Número de orden de compra"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipoServicio">Tipo de Servicio</Label>
          <Select onValueChange={(value) => form.setValue("tipoServicioId", value)} value={form.watch("tipoServicioId")}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposActivos.map((tipo) => (
                <SelectItem key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.tipoServicioId && (
            <p className="text-sm text-red-500">{form.formState.errors.tipoServicioId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="marcaVehiculo">Marca del Vehículo</Label>
          <Input
            id="marcaVehiculo"
            {...form.register("marcaVehiculo")}
            placeholder="Ej: Toyota"
          />
          {form.formState.errors.marcaVehiculo && (
            <p className="text-sm text-red-500">{form.formState.errors.marcaVehiculo.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="modeloVehiculo">Modelo del Vehículo</Label>
          <Input
            id="modeloVehiculo"
            {...form.register("modeloVehiculo")}
            placeholder="Ej: Corolla"
          />
          {form.formState.errors.modeloVehiculo && (
            <p className="text-sm text-red-500">{form.formState.errors.modeloVehiculo.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="patente">Patente</Label>
          <Input
            id="patente"
            {...form.register("patente")}
            placeholder="Ej: ABC123"
            className="uppercase"
          />
          {form.formState.errors.patente && (
            <p className="text-sm text-red-500">{form.formState.errors.patente.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor">Valor del Servicio</Label>
          <Input
            id="valor"
            type="number"
            {...form.register("valor", { valueAsNumber: true })}
            placeholder="0"
          />
          {form.formState.errors.valor && (
            <p className="text-sm text-red-500">{form.formState.errors.valor.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ubicacionOrigen">Ubicación de Origen</Label>
        <Input
          id="ubicacionOrigen"
          {...form.register("ubicacionOrigen")}
          placeholder="Dirección de recogida"
        />
        {form.formState.errors.ubicacionOrigen && (
          <p className="text-sm text-red-500">{form.formState.errors.ubicacionOrigen.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ubicacionDestino">Ubicación de Destino</Label>
        <Input
          id="ubicacionDestino"
          {...form.register("ubicacionDestino")}
          placeholder="Dirección de entrega"
        />
        {form.formState.errors.ubicacionDestino && (
          <p className="text-sm text-red-500">{form.formState.errors.ubicacionDestino.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="grua">Grúa Asignada</Label>
          <Select onValueChange={(value) => form.setValue("gruaId", value)} value={form.watch("gruaId")}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar grúa" />
            </SelectTrigger>
            <SelectContent>
              {gruasActivas.map((grua) => (
                <SelectItem key={grua.id} value={grua.id}>
                  {grua.patente} - {grua.marca} {grua.modelo} ({grua.tipo})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.gruaId && (
            <p className="text-sm text-red-500">{form.formState.errors.gruaId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="operador">Operador Asignado</Label>
          <Select onValueChange={(value) => form.setValue("operadorId", value)} value={form.watch("operadorId")}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar operador" />
            </SelectTrigger>
            <SelectContent>
              {operadoresActivos.map((operador) => (
                <SelectItem key={operador.id} value={operador.id}>
                  {operador.nombreCompleto}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.operadorId && (
            <p className="text-sm text-red-500">{form.formState.errors.operadorId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estado">Estado del Servicio</Label>
        <Select onValueChange={(value: any) => form.setValue("estado", value)} value={form.watch("estado")}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en_curso">En Curso</SelectItem>
            <SelectItem value="cerrado">Cerrado</SelectItem>
            <SelectItem value="facturado">Facturado</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.estado && (
          <p className="text-sm text-red-500">{form.formState.errors.estado.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
        <Textarea
          id="observaciones"
          {...form.register("observaciones")}
          placeholder="Observaciones adicionales del servicio"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {(createMutation.isPending || updateMutation.isPending) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {servicio ? "Actualizar" : "Crear"} Servicio
        </Button>
      </div>
    </form>
  );
}
