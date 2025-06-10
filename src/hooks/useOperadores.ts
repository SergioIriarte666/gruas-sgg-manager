
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Operador } from "@/types";

export const useOperadores = () => {
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
    }
  });
};

export const useCreateOperador = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (operador: Omit<Operador, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('operadores')
        .insert({
          nombre_completo: operador.nombreCompleto,
          rut: operador.rut,
          telefono: operador.telefono,
          numero_licencia: operador.numeroLicencia,
          activo: operador.activo
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operadores'] });
    }
  });
};
