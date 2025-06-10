
import { Control, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cliente, Grua, Operador, TipoServicio } from "@/types";
import { useClientes } from "@/hooks/useClientes";

interface ServiceAssignmentFieldsProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  gruas: Grua[];
  operadores: Operador[];
  tiposServicio: TipoServicio[];
}

export function ServiceAssignmentFields<TFieldValues extends FieldValues>({
  control,
  gruas,
  operadores,
  tiposServicio,
}: ServiceAssignmentFieldsProps<TFieldValues>) {
  const { data: clientes = [] } = useClientes();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Asignación del Servicio</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={"clienteId" as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clientes
                    .filter(cliente => cliente.activo)
                    .map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.razonSocial} - {cliente.rut}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Cliente que solicita el servicio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={"gruaId" as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grúa</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar grúa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {gruas
                    .filter(grua => grua.activo)
                    .map((grua) => (
                      <SelectItem key={grua.id} value={grua.id}>
                        {grua.patente} - {grua.marca} {grua.modelo} ({grua.tipo})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Grúa asignada para el servicio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={"operadorId" as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operador</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar operador" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {operadores
                    .filter(operador => operador.activo)
                    .map((operador) => (
                      <SelectItem key={operador.id} value={operador.id}>
                        {operador.nombreCompleto} - {operador.rut}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Operador asignado para el servicio.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={"tipoServicioId" as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Servicio</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tiposServicio
                    .filter(tipo => tipo.activo)
                    .map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Tipo de servicio a realizar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
