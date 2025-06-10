
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Grua } from "@/types";

export const useGruas = () => {
  return useQuery({
    queryKey: ['gruas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gruas')
        .select('*')
        .order('patente');
      
      if (error) throw error;
      
      return data.map(grua => ({
        id: grua.id,
        patente: grua.patente,
        marca: grua.marca,
        modelo: grua.modelo,
        tipo: grua.tipo as 'Liviana' | 'Mediana' | 'Pesada',
        activo: grua.activo,
        createdAt: new Date(grua.created_at),
        updatedAt: new Date(grua.updated_at)
      })) as Grua[];
    }
  });
};

export const useCreateGrua = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (grua: Omit<Grua, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('gruas')
        .insert({
          patente: grua.patente,
          marca: grua.marca,
          modelo: grua.modelo,
          tipo: grua.tipo,
          activo: grua.activo
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gruas'] });
    }
  });
};
