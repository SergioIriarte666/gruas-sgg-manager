
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { servicioFormSchema, type ServicioFormData } from "@/components/forms/schemas/servicioSchema";
import { DatePickerField } from "@/components/forms/fields/DatePickerField";
import { VehicleInfoFields } from "@/components/forms/fields/VehicleInfoFields";
import { LocationFields } from "@/components/forms/fields/LocationFields";
import { ServiceAssignmentFields } from "@/components/forms/fields/ServiceAssignmentFields";
import { useCreateServicio } from "@/hooks/useCreateServicio";
import { useUpdateServicio } from "@/hooks/useServicios";
import { useGruas } from "@/hooks/useGruas";
import { useOperadores } from "@/hooks/useOperadores";
import { useTiposServicio } from "@/hooks/useTiposServicio";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

interface FormularioServicioProps {
  servicio?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FormularioServicio = ({ servicio, onSuccess, onCancel }: FormularioServicioProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createServicio = useCreateServicio();
  const updateServicio = useUpdateServicio();
  const { data: gruas = [] } = useGruas();
  const { data: operadores = [] } = useOperadores();
  const { data: tiposServicio = [] } = useTiposServicio();
  const { toast } = useToast();
  const isEditing = !!servicio;

  const form = useForm<ServicioFormData>({
    resolver: zodResolver(servicioFormSchema),
    defaultValues: {
      fecha: new Date(),
      folio: "",
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
      console.log('Cargando datos del servicio para editar:', servicio);
      
      const fechaServicio = servicio.fecha ? new Date(servicio.fecha) : new Date();
      
      form.reset({
        fecha: fechaServicio,
        folio: servicio.folio || "",
        clienteId: servicio.clienteId || servicio.cliente_id || "",
        ordenCompra: servicio.ordenCompra || servicio.orden_compra || "",
        marcaVehiculo: servicio.marcaVehiculo || servicio.marca_vehiculo || "",
        modeloVehiculo: servicio.modeloVehiculo || servicio.modelo_vehiculo || "",
        patente: servicio.patente || "",
        ubicacionOrigen: servicio.ubicacionOrigen || servicio.ubicacion_origen || "",
        ubicacionDestino: servicio.ubicacionDestino || servicio.ubicacion_destino || "",
        valor: Number(servicio.valor) || 0,
        gruaId: servicio.gruaId || servicio.grua_id || "",
        operadorId: servicio.operadorId || servicio.operador_id || "",
        tipoServicioId: servicio.tipoServicioId || servicio.tipo_servicio_id || "",
        estado: servicio.estado || "en_curso",
        observaciones: servicio.observaciones || "",
      });
    }
  }, [servicio, form]);

  const onSubmit = async (data: ServicioFormData) => {
    console.log('FormularioServicio.onSubmit: Iniciando envío del formulario...');
    console.log('FormularioServicio.onSubmit: Datos del formulario:', data);
    
    try {
      setIsSubmitting(true);
      
      // Validar que todos los campos requeridos estén presentes
      if (!data.clienteId) {
        throw new Error('Cliente es requerido');
      }
      if (!data.gruaId) {
        throw new Error('Grúa es requerida');
      }
      if (!data.operadorId) {
        throw new Error('Operador es requerido');
      }
      if (!data.tipoServicioId) {
        throw new Error('Tipo de servicio es requerido');
      }
      
      // Asegurar que la fecha es válida
      const validatedData: ServicioFormData = {
        ...data,
        fecha: data.fecha instanceof Date ? data.fecha : new Date(data.fecha),
        valor: Number(data.valor),
      };
      
      console.log('FormularioServicio.onSubmit: Datos validados:', validatedData);
      
      if (isEditing) {
        console.log('FormularioServicio.onSubmit: Actualizando servicio:', servicio.id);
        await updateServicio.mutateAsync({
          id: servicio.id,
          ...validatedData,
        });
        toast({
          title: "Servicio actualizado",
          description: "El servicio ha sido actualizado exitosamente.",
        });
      } else {
        console.log('FormularioServicio.onSubmit: Creando nuevo servicio...');
        const result = await createServicio.mutateAsync(validatedData);
        console.log('FormularioServicio.onSubmit: Servicio creado exitosamente:', result);
        toast({
          title: "Servicio creado",
          description: "El servicio ha sido creado exitosamente.",
        });
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('FormularioServicio.onSubmit: Error al guardar servicio:', error);
      
      const errorMessage = error?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el servicio. Intenta nuevamente.`;
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
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
              <DatePickerField 
                control={form.control}
                name="fecha"
                label="Fecha del Servicio"
              />
              
              <FormField
                control={form.control}
                name="folio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folio (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Folio manual (opcional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <VehicleInfoFields control={form.control} />
            </div>

            <LocationFields control={form.control} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ordenCompra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden de Compra (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de orden de compra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor del Servicio</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="Valor en pesos" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <ServiceAssignmentFields 
              control={form.control}
              gruas={gruas}
              operadores={operadores}
              tiposServicio={tiposServicio}
            />

            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observaciones adicionales sobre el servicio"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
