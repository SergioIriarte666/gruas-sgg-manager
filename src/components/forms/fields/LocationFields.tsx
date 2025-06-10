
import { Control, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface LocationFieldsProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
}

export function LocationFields<TFieldValues extends FieldValues>({
  control,
}: LocationFieldsProps<TFieldValues>) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <FormField
        control={control}
        name="ubicacionOrigen" as any
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
        control={control}
        name="ubicacionDestino" as any
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
  );
}
