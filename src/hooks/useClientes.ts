
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Cliente } from "@/types";

export const useClientes = () => {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('razon_social');
      
      if (error) throw error;
      
      return data.map(cliente => ({
        id: cliente.id,
        razonSocial: cliente.razon_social,
        rut: cliente.rut,
        telefono: cliente.telefono,
        email: cliente.email,
        direccion: cliente.direccion,
        activo: cliente.activo,
        createdAt: new Date(cliente.created_at),
        updatedAt: new Date(cliente.updated_at)
      })) as Cliente[];
    }
  });
};

export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cliente: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('clientes')
        .insert({
          razon_social: cliente.razonSocial,
          rut: cliente.rut,
          telefono: cliente.telefono,
          email: cliente.email,
          direccion: cliente.direccion,
          activo: cliente.activo
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    }
  });
};
