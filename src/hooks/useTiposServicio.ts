
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TipoServicio } from "@/types";

export const useTiposServicio = () => {
  return useQuery({
    queryKey: ['tipos-servicio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tipos_servicio')
        .select('*')
        .order('nombre');
      
      if (error) throw error;
      
      return data.map(tipo => ({
        id: tipo.id,
        nombre: tipo.nombre,
        descripcion: tipo.descripcion,
        activo: tipo.activo,
        createdAt: new Date(tipo.created_at),
        updatedAt: new Date(tipo.updated_at)
      })) as TipoServicio[];
    }
  });
};

export const useCreateTipoServicio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tipo: Omit<TipoServicio, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('tipos_servicio')
        .insert({
          nombre: tipo.nombre,
          descripcion: tipo.descripcion,
          activo: tipo.activo
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-servicio'] });
    }
  });
};
