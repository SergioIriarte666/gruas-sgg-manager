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
        vencimientoLicencia: operador.vencimiento_licencia ? new Date(operador.vencimiento_licencia + 'T00:00:00') : undefined,
        vencimientoExamenes: operador.vencimiento_examenes ? new Date(operador.vencimiento_examenes + 'T00:00:00') : undefined,
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
      const formatDateForDB = (date: Date | undefined) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const { data, error } = await supabase
        .from('operadores')
        .insert({
          nombre_completo: operador.nombreCompleto,
          rut: operador.rut,
          telefono: operador.telefono,
          numero_licencia: operador.numeroLicencia,
          activo: operador.activo,
          vencimiento_licencia: formatDateForDB(operador.vencimientoLicencia),
          vencimiento_examenes: formatDateForDB(operador.vencimientoExamenes)
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
      
      const formatDateForDB = (date: Date | undefined) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const { data, error } = await supabase
        .from('operadores')
        .update({
          nombre_completo: operador.nombreCompleto,
          rut: operador.rut,
          telefono: operador.telefono,
          numero_licencia: operador.numeroLicencia,
          activo: operador.activo,
          vencimiento_licencia: formatDateForDB(operador.vencimientoLicencia),
          vencimiento_examenes: formatDateForDB(operador.vencimientoExamenes)
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
