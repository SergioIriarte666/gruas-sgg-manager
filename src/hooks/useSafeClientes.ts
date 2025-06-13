
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Cliente } from "@/types";
import { useQueryContextReady } from "@/hooks/useQueryContextReady";

export const useSafeClientes = () => {
  const { isReady } = useQueryContextReady();
  
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
        rut: cliente.rut,
        razonSocial: cliente.razon_social,
        email: cliente.email,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        activo: cliente.activo,
        createdAt: new Date(cliente.created_at),
        updatedAt: new Date(cliente.updated_at)
      })) as Cliente[];
    },
    enabled: isReady
  });
};
