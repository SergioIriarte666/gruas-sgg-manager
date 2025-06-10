
import { useState, useEffect } from "react";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
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
  onDateChange?: (date: Date | undefined) => void;
}

export function DatePickerField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  onDateChange,
}: DatePickerFieldProps<TFieldValues>) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  }, [selectedDate, onDateChange]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onSelect={setSelectedDate}
                dateFormat="dd/MM/yyyy"
              />
            )}
          />
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
