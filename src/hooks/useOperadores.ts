
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
        vencimientoLicencia: operador.vencimiento_licencia ? new Date(operador.vencimiento_licencia) : undefined,
        vencimientoExamenes: operador.vencimiento_examenes ? new Date(operador.vencimiento_examenes) : undefined,
        createdAt: new Date(operador.created_at),
        updatedAt: new Date(operador.updated_at)
      })) as Operador[];
    }
  });
};

export const useCreateOperador = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (operador: { 
      nombreCompleto: string; 
      rut: string; 
      telefono: string; 
      numeroLicencia: string; 
      activo: boolean;
      vencimientoLicencia?: Date;
      vencimientoExamenes?: Date;
    }) => {
      const { data, error } = await supabase
        .from('operadores')
        .insert({
          nombre_completo: operador.nombreCompleto,
          rut: operador.rut,
          telefono: operador.telefono,
          numero_licencia: operador.numeroLicencia,
          activo: operador.activo,
          vencimiento_licencia: operador.vencimientoLicencia?.toISOString().split('T')[0],
          vencimiento_examenes: operador.vencimientoExamenes?.toISOString().split('T')[0]
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
    mutationFn: async (params: { 
      id: string; 
      nombreCompleto: string; 
      rut: string; 
      telefono: string; 
      numeroLicencia: string; 
      activo: boolean;
      vencimientoLicencia?: Date;
      vencimientoExamenes?: Date;
    }) => {
      const { id, ...operador } = params;
      
      const { data, error } = await supabase
        .from('operadores')
        .update({
          nombre_completo: operador.nombreCompleto,
          rut: operador.rut,
          telefono: operador.telefono,
          numero_licencia: operador.numeroLicencia,
          activo: operador.activo,
          vencimiento_licencia: operador.vencimientoLicencia?.toISOString().split('T')[0],
          vencimiento_examenes: operador.vencimientoExamenes?.toISOString().split('T')[0]
        })
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
