
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

export const useUpdateTipoServicio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...tipo }: Partial<TipoServicio> & { id: string }) => {
      const updateData: any = {};
      
      if (tipo.nombre) updateData.nombre = tipo.nombre;
      if (tipo.descripcion) updateData.descripcion = tipo.descripcion;
      if (tipo.activo !== undefined) updateData.activo = tipo.activo;
      
      const { data, error } = await supabase
        .from('tipos_servicio')
        .update(updateData)
        .eq('id', id)
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

export const useDeleteTipoServicio = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tipos_servicio')
        .update({ activo: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-servicio'] });
    }
  });
};
