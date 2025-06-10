
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useCreateCliente, useUpdateCliente } from "@/hooks/useClientes";
import { Cliente } from "@/types";
import { toast } from "@/components/ui/sonner";

const esquemaCliente = z.object({
  razonSocial: z.string().min(1, "La razón social es requerida"),
  rut: z.string().min(1, "El RUT es requerido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  email: z.string().email("Debe ser un email válido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  activo: z.boolean(),
});

type DatosFormulario = z.infer<typeof esquemaCliente>;

interface Props {
  cliente?: Cliente;
  onSuccess: () => void;
  onCancel: () => void;
}

export function FormularioCliente({ cliente, onSuccess, onCancel }: Props) {
  const createMutation = useCreateCliente();
  const updateMutation = useUpdateCliente();
  
  const form = useForm<DatosFormulario>({
    resolver: zodResolver(esquemaCliente),
    defaultValues: {
      razonSocial: cliente?.razonSocial || "",
      rut: cliente?.rut || "",
      telefono: cliente?.telefono || "",
      email: cliente?.email || "",
      direccion: cliente?.direccion || "",
      activo: cliente?.activo ?? true,
    },
  });

  const onSubmit = async (datos: DatosFormulario) => {
    try {
      // Asegurarse de que todos los campos obligatorios existan
      const datosValidados = {
        razonSocial: datos.razonSocial || "",
        rut: datos.rut || "",
        telefono: datos.telefono || "",
        email: datos.email || "",
        direccion: datos.direccion || "",
        activo: datos.activo,
      };

      if (cliente) {
        await updateMutation.mutateAsync({ id: cliente.id, ...datosValidados });
        toast.success("Cliente actualizado exitosamente");
      } else {
        await createMutation.mutateAsync(datosValidados);
        toast.success("Cliente creado exitosamente");
      }
      onSuccess();
    } catch (error) {
      toast.error("Error al guardar el cliente");
      console.error(error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="razonSocial">Razón Social</Label>
        <Input
          id="razonSocial"
          {...form.register("razonSocial")}
          placeholder="Nombre de la empresa"
        />
        {form.formState.errors.razonSocial && (
          <p className="text-sm text-red-500">{form.formState.errors.razonSocial.message}</p>
        )}
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="contacto@empresa.cl"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion">Dirección</Label>
        <Input
          id="direccion"
          {...form.register("direccion")}
          placeholder="Dirección completa"
        />
        {form.formState.errors.direccion && (
          <p className="text-sm text-red-500">{form.formState.errors.direccion.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="activo"
          checked={form.watch("activo")}
          onCheckedChange={(checked) => form.setValue("activo", checked)}
        />
        <Label htmlFor="activo">Cliente activo</Label>
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
          {cliente ? "Actualizar" : "Crear"} Cliente
        </Button>
      </div>
    </form>
  );
}
