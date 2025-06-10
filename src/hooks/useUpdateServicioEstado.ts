
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useUpdateServicioEstado = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: 'en_curso' | 'cerrado' | 'facturado' }) => {
      const { data, error } = await supabase
        .from('servicios')
        .update({ estado })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['estadisticas-servicios'] });
      queryClient.invalidateQueries({ queryKey: ['servicios-elegibles'] });
      toast({
        title: "Estado actualizado",
        description: "El estado del servicio ha sido actualizado exitosamente.",
      });
    },
    onError: (error) => {
      console.error("Error updating servicio estado:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del servicio.",
        variant: "destructive",
      });
    },
  });
};
