
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCreateGrua, useUpdateGrua } from "@/hooks/useGruas";
import { Grua } from "@/types";
import { toast } from "@/components/ui/sonner";

const esquemaGrua = z.object({
  patente: z.string().min(1, "La patente es requerida"),
  marca: z.string().min(1, "La marca es requerida"),
  modelo: z.string().min(1, "El modelo es requerido"),
  tipo: z.enum(['Liviana', 'Mediana', 'Pesada'], {
    required_error: "Debe seleccionar un tipo",
  }),
  activo: z.boolean(),
});

type DatosFormulario = z.infer<typeof esquemaGrua>;

interface Props {
  grua?: Grua;
  onSuccess: () => void;
  onCancel: () => void;
}

export function FormularioGrua({ grua, onSuccess, onCancel }: Props) {
  const createMutation = useCreateGrua();
  const updateMutation = useUpdateGrua();
  
  const form = useForm<DatosFormulario>({
    resolver: zodResolver(esquemaGrua),
    defaultValues: {
      patente: grua?.patente || "",
      marca: grua?.marca || "",
      modelo: grua?.modelo || "",
      tipo: grua?.tipo || "Liviana",
      activo: grua?.activo ?? true,
    },
  });

  const onSubmit = async (datos: DatosFormulario) => {
    try {
      // Asegurarse de que todos los campos obligatorios existan
      const datosValidados = {
        patente: datos.patente || "",
        marca: datos.marca || "",
        modelo: datos.modelo || "",
        tipo: datos.tipo as 'Liviana' | 'Mediana' | 'Pesada',
        activo: datos.activo,
      };

      if (grua) {
        await updateMutation.mutateAsync({ id: grua.id, ...datosValidados });
        toast.success("Grúa actualizada exitosamente");
      } else {
        await createMutation.mutateAsync(datosValidados);
        toast.success("Grúa creada exitosamente");
      }
      onSuccess();
    } catch (error) {
      toast.error("Error al guardar la grúa");
      console.error(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="patente">Patente</Label>
        <Input
          id="patente"
          {...form.register("patente")}
          placeholder="ABC123"
          className="uppercase"
        />
        {form.formState.errors.patente && (
          <p className="text-sm text-red-500">{form.formState.errors.patente.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="marca">Marca</Label>
          <Input
            id="marca"
            {...form.register("marca")}
            placeholder="Mercedes-Benz"
          />
          {form.formState.errors.marca && (
            <p className="text-sm text-red-500">{form.formState.errors.marca.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo</Label>
          <Input
            id="modelo"
            {...form.register("modelo")}
            placeholder="Atego 1725"
          />
          {form.formState.errors.modelo && (
            <p className="text-sm text-red-500">{form.formState.errors.modelo.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo de Grúa</Label>
        <Select onValueChange={(value: any) => form.setValue("tipo", value)} value={form.watch("tipo")}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Liviana">Liviana</SelectItem>
            <SelectItem value="Mediana">Mediana</SelectItem>
            <SelectItem value="Pesada">Pesada</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.tipo && (
          <p className="text-sm text-red-500">{form.formState.errors.tipo.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="activo"
          checked={form.watch("activo")}
          onCheckedChange={(checked) => form.setValue("activo", checked)}
        />
        <Label htmlFor="activo">Grúa activa</Label>
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
          {grua ? "Actualizar" : "Crear"} Grúa
        </Button>
      </div>
    </form>
  );
}
