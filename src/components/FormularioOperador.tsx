
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useCreateOperador, useUpdateOperador } from "@/hooks/useOperadores";
import { Operador } from "@/types";
import { toast } from "@/components/ui/sonner";

const esquemaOperador = z.object({
  nombreCompleto: z.string().min(1, "El nombre completo es requerido"),
  rut: z.string().min(1, "El RUT es requerido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  numeroLicencia: z.string().min(1, "El número de licencia es requerido"),
  activo: z.boolean(),
});

type DatosFormulario = z.infer<typeof esquemaOperador>;

interface Props {
  operador?: Operador;
  onSuccess: () => void;
  onCancel: () => void;
}

export function FormularioOperador({ operador, onSuccess, onCancel }: Props) {
  const createMutation = useCreateOperador();
  const updateMutation = useUpdateOperador();
  
  const form = useForm<DatosFormulario>({
    resolver: zodResolver(esquemaOperador),
    defaultValues: {
      nombreCompleto: operador?.nombreCompleto || "",
      rut: operador?.rut || "",
      telefono: operador?.telefono || "",
      numeroLicencia: operador?.numeroLicencia || "",
      activo: operador?.activo ?? true,
    },
  });

  const onSubmit = async (datos: DatosFormulario) => {
    try {
      // Asegurarse de que todos los campos obligatorios existan
      const datosValidados = {
        nombreCompleto: datos.nombreCompleto || "",
        rut: datos.rut || "",
        telefono: datos.telefono || "",
        numeroLicencia: datos.numeroLicencia || "",
        activo: datos.activo,
      };

      if (operador) {
        await updateMutation.mutateAsync({ id: operador.id, ...datosValidados });
        toast.success("Operador actualizado exitosamente");
      } else {
        await createMutation.mutateAsync(datosValidados);
        toast.success("Operador creado exitosamente");
      }
      onSuccess();
    } catch (error) {
      toast.error("Error al guardar el operador");
      console.error(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombreCompleto">Nombre Completo</Label>
        <Input
          id="nombreCompleto"
          {...form.register("nombreCompleto")}
          placeholder="Juan Pérez García"
        />
        {form.formState.errors.nombreCompleto && (
          <p className="text-sm text-red-500">{form.formState.errors.nombreCompleto.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rut">RUT</Label>
          <Input
            id="rut"
            {...form.register("rut")}
            placeholder="12.345.678-9"
          />
          {form.formState.errors.rut && (
            <p className="text-sm text-red-500">{form.formState.errors.rut.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            {...form.register("telefono")}
            placeholder="+56 9 1234 5678"
          />
          {form.formState.errors.telefono && (
            <p className="text-sm text-red-500">{form.formState.errors.telefono.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numeroLicencia">Número de Licencia</Label>
        <Input
          id="numeroLicencia"
          {...form.register("numeroLicencia")}
          placeholder="A2-1234567"
        />
        {form.formState.errors.numeroLicencia && (
          <p className="text-sm text-red-500">{form.formState.errors.numeroLicencia.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="activo"
          checked={form.watch("activo")}
          onCheckedChange={(checked) => form.setValue("activo", checked)}
        />
        <Label htmlFor="activo">Operador activo</Label>
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
          {operador ? "Actualizar" : "Crear"} Operador
        </Button>
      </div>
    </form>
  );
}
