
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Operador } from "@/types";
import { useQueryContextReady } from "@/hooks/useQueryContextReady";

export const useSafeOperadores = () => {
  const { isReady } = useQueryContextReady();
  
  return useQuery({
    queryKey: ['operadores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operadores')
        .select('*')
        .order('nombre_completo');
      
      if (error) throw error;
      
      return data.map(operador => ({
        id: operador.id,
        nombreCompleto: operador.nombre_completo,
        rut: operador.rut,
        telefono: operador.telefono,
        numeroLicencia: operador.numero_licencia,
        activo: operador.activo,
        createdAt: new Date(operador.created_at),
        updatedAt: new Date(operador.updated_at)
      })) as Operador[];
    },
    enabled: isReady
  });
};
