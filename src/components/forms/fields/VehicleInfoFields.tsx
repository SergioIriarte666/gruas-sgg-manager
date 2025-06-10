
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

interface VehicleInfoFieldsProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
}

export function VehicleInfoFields<TFieldValues extends FieldValues>({
  control,
}: VehicleInfoFieldsProps<TFieldValues>) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <FormField
          control={control}
          name="marcaVehiculo" as any
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
          control={control}
          name="modeloVehiculo" as any
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
        control={control}
        name="patente" as any
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
    </>
  );
}
