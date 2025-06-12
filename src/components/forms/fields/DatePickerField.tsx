
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
  placeholder?: string;
  disabled?: boolean;
}

export function DatePickerField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = "Seleccionar fecha",
  disabled = false,
}: DatePickerFieldProps<TFieldValues>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col space-y-2">
          <FormLabel className="text-sm font-medium text-foreground">
            {label}
          </FormLabel>
          <DatePicker
            selected={field.value ? new Date(field.value) : undefined}
            onSelect={(date) => field.onChange(date)}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full"
          />
          {description && (
            <FormDescription className="text-xs text-muted-foreground">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
