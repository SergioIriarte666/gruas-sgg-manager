
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
    mutationFn: async (grua: { patente: string; marca: string; modelo: string; tipo: 'Liviana' | 'Mediana' | 'Pesada'; activo: boolean }) => {
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

export const useUpdateGrua = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...grua }: { id: string; patente?: string; marca?: string; modelo?: string; tipo?: 'Liviana' | 'Mediana' | 'Pesada'; activo?: boolean }) => {
      const updateData: any = {};
      
      if (grua.patente) updateData.patente = grua.patente;
      if (grua.marca) updateData.marca = grua.marca;
      if (grua.modelo) updateData.modelo = grua.modelo;
      if (grua.tipo) updateData.tipo = grua.tipo;
      if (grua.activo !== undefined) updateData.activo = grua.activo;
      
      const { data, error } = await supabase
        .from('gruas')
        .update(updateData)
        .eq('id', id)
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

export const useDeleteGrua = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gruas')
        .update({ activo: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gruas'] });
    }
  });
};
