
import { Control, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiceAssignmentFieldsProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  gruas: Array<{ id: string; patente: string; marca: string; modelo: string }>;
  operadores: Array<{ id: string; nombreCompleto: string }>;
  tiposServicio: Array<{ id: string; nombre: string }>;
}

export function ServiceAssignmentFields<TFieldValues extends FieldValues>({
  control,
  gruas,
  operadores,
  tiposServicio,
}: ServiceAssignmentFieldsProps<TFieldValues>) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={"gruaId" as any}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grúa</FormLabel>
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
              Grúa asignada al servicio.
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
              Operador asignado al servicio.
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo de servicio" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tiposServicio.map((tipo) => (
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
  );
}
