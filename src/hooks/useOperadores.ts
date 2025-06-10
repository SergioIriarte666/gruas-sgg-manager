
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
    mutationFn: async (operador: { nombreCompleto: string; rut: string; telefono: string; numeroLicencia: string; activo: boolean }) => {
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

export const useUpdateOperador = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { id: string } & { nombreCompleto: string; rut: string; telefono: string; numeroLicencia: string; activo: boolean }) => {
      const { id, ...operador } = params;
      const updateData: any = {};
      
      updateData.nombre_completo = operador.nombreCompleto;
      updateData.rut = operador.rut;
      updateData.telefono = operador.telefono;
      updateData.numero_licencia = operador.numeroLicencia;
      updateData.activo = operador.activo;
      
      const { data, error } = await supabase
        .from('operadores')
        .update(updateData)
        .eq('id', id)
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

export const useDeleteOperador = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('operadores')
        .update({ activo: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operadores'] });
    }
  });
};
