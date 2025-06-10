
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useCreateTipoServicio, useUpdateTipoServicio } from "@/hooks/useTiposServicio";
import { TipoServicio } from "@/types";
import { toast } from "@/components/ui/sonner";

const esquemaTipoServicio = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  activo: z.boolean(),
});

type DatosFormulario = z.infer<typeof esquemaTipoServicio>;

interface Props {
  tipoServicio?: TipoServicio;
  onSuccess: () => void;
  onCancel: () => void;
}

export function FormularioTipoServicio({ tipoServicio, onSuccess, onCancel }: Props) {
  const createMutation = useCreateTipoServicio();
  const updateMutation = useUpdateTipoServicio();
  
  const form = useForm<DatosFormulario>({
    resolver: zodResolver(esquemaTipoServicio),
    defaultValues: {
      nombre: tipoServicio?.nombre || "",
      descripcion: tipoServicio?.descripcion || "",
      activo: tipoServicio?.activo ?? true,
    },
  });

  const onSubmit = async (datos: DatosFormulario) => {
    try {
      // Asegurarse de que todos los campos obligatorios existan
      const datosValidados = {
        nombre: datos.nombre || "",
        descripcion: datos.descripcion || "",
        activo: datos.activo,
      };

      if (tipoServicio) {
        await updateMutation.mutateAsync({ id: tipoServicio.id, ...datosValidados });
        toast.success("Tipo de servicio actualizado exitosamente");
      } else {
        await createMutation.mutateAsync(datosValidados);
        toast.success("Tipo de servicio creado exitosamente");
      }
      onSuccess();
    } catch (error) {
      toast.error("Error al guardar el tipo de servicio");
      console.error(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          {...form.register("nombre")}
          placeholder="Traslado de Vehículos"
        />
        {form.formState.errors.nombre && (
          <p className="text-sm text-red-500">{form.formState.errors.nombre.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          {...form.register("descripcion")}
          placeholder="Descripción detallada del tipo de servicio"
          rows={3}
        />
        {form.formState.errors.descripcion && (
          <p className="text-sm text-red-500">{form.formState.errors.descripcion.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="activo"
          checked={form.watch("activo")}
          onCheckedChange={(checked) => form.setValue("activo", checked)}
        />
        <Label htmlFor="activo">Tipo de servicio activo</Label>
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
          {tipoServicio ? "Actualizar" : "Crear"} Tipo de Servicio
        </Button>
      </div>
    </form>
  );
}
