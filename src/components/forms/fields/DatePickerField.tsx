
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

interface DatePickerFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  description?: string;
}

export function DatePickerField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
}: DatePickerFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <DatePicker
            selected={field.value} // Siempre Date válido
            onSelect={(date) => field.onChange(date)}
            placeholder="Seleccionar fecha"
          />
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
