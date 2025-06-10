
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { servicioSchema, type ServicioFormData } from "@/components/forms/schemas/servicioSchema";
import { DatePickerField } from "@/components/forms/fields/DatePickerField";
import { VehicleInfoFields } from "@/components/forms/fields/VehicleInfoFields";
import { LocationFields } from "@/components/forms/fields/LocationFields";
import { ServiceAssignmentFields } from "@/components/forms/fields/ServiceAssignmentFields";
import { useCreateServicio } from "@/hooks/useCreateServicio";
import { useUpdateServicio } from "@/hooks/useServicios";
import { Form } from "@/components/ui/form";

interface FormularioServicioProps {
  servicio?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FormularioServicio = ({ servicio, onSuccess, onCancel }: FormularioServicioProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createServicio = useCreateServicio();
  const updateServicio = useUpdateServicio();
  const isEditing = !!servicio;

  const form = useForm<ServicioFormData>({
    resolver: zodResolver(servicioSchema),
    defaultValues: {
      fecha: new Date(),
      clienteId: "",
      ordenCompra: "",
      marcaVehiculo: "",
      modeloVehiculo: "",
      patente: "",
      ubicacionOrigen: "",
      ubicacionDestino: "",
      valor: 0,
      gruaId: "",
      operadorId: "",
      tipoServicioId: "",
      estado: "en_curso" as const,
      observaciones: "",
    },
  });

  // Pre-cargar datos para edición
  useEffect(() => {
    if (servicio) {
      form.reset({
        fecha: new Date(servicio.fecha),
        clienteId: servicio.clienteId,
        ordenCompra: servicio.ordenCompra || "",
        marcaVehiculo: servicio.marcaVehiculo,
        modeloVehiculo: servicio.modeloVehiculo,
        patente: servicio.patente,
        ubicacionOrigen: servicio.ubicacionOrigen,
        ubicacionDestino: servicio.ubicacionDestino,
        valor: Number(servicio.valor),
        gruaId: servicio.gruaId,
        operadorId: servicio.operadorId,
        tipoServicioId: servicio.tipoServicioId,
        estado: servicio.estado,
        observaciones: servicio.observaciones || "",
      });
    }
  }, [servicio, form]);

  const onSubmit = async (data: ServicioFormData) => {
    try {
      setIsSubmitting(true);
      
      if (isEditing) {
        await updateServicio.mutateAsync({
          id: servicio.id,
          ...data
        });
      } else {
        await createServicio.mutateAsync(data);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Servicio' : 'Nuevo Servicio de Grúa'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DatePickerField form={form} />
              
              <div className="space-y-4">
                <VehicleInfoFields form={form} />
              </div>
            </div>

            <LocationFields form={form} />
            
            <ServiceAssignmentFields form={form} />

            <div className="flex justify-end gap-4 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary-dark"
              >
                {isSubmitting 
                  ? (isEditing ? "Actualizando..." : "Creando...") 
                  : (isEditing ? "Actualizar Servicio" : "Crear Servicio")
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
