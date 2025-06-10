
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cierresApi } from "@/api/cierresApi";
import { useToast } from "@/hooks/use-toast";

export const useCierres = () => {
  return useQuery({
    queryKey: ['cierres'],
    queryFn: cierresApi.getAll,
    onError: (error: any) => {
      console.error('Error en useCierres:', error);
    }
  });
};

export const useCierreById = (id: string) => {
  return useQuery({
    queryKey: ['cierre', id],
    queryFn: () => cierresApi.getById(id),
    enabled: !!id
  });
};

export const useServiciosElegibles = (fechaInicio: string, fechaFin: string, clienteId?: string) => {
  return useQuery({
    queryKey: ['servicios-elegibles', fechaInicio, fechaFin, clienteId],
    queryFn: () => cierresApi.getServiciosElegibles(fechaInicio, fechaFin, clienteId),
    enabled: !!(fechaInicio && fechaFin)
  });
};

export const useCreateCierre = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: cierresApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cierres'] });
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['servicios-elegibles'] });
      toast({
        title: "Cierre creado",
        description: "El cierre se ha creado exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error al crear cierre:', error);
      const errorMessage = error?.message || "No se pudo crear el cierre. Intenta nuevamente.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useMarkCierreAsFacturado = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ cierreId, facturaId }: { cierreId: string; facturaId: string }) =>
      cierresApi.markAsFacturado(cierreId, facturaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cierres'] });
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['facturas'] });
      toast({
        title: "Cierre facturado",
        description: "El cierre ha sido marcado como facturado exitosamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error al marcar cierre como facturado:', error);
      const errorMessage = error?.message || "No se pudo marcar el cierre como facturado.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
