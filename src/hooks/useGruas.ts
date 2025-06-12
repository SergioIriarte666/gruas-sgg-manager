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
        vencimientoPermisoCirculacion: grua.vencimiento_permiso_circulacion ? new Date(grua.vencimiento_permiso_circulacion + 'T00:00:00') : undefined,
        vencimientoSeguroObligatorio: grua.vencimiento_seguro_obligatorio ? new Date(grua.vencimiento_seguro_obligatorio + 'T00:00:00') : undefined,
        vencimientoRevisionTecnica: grua.vencimiento_revision_tecnica ? new Date(grua.vencimiento_revision_tecnica + 'T00:00:00') : undefined,
        createdAt: new Date(grua.created_at),
        updatedAt: new Date(grua.updated_at)
      })) as Grua[];
    }
  });
};

export const useCreateGrua = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (grua: { 
      patente: string; 
      marca: string; 
      modelo: string; 
      tipo: 'Liviana' | 'Mediana' | 'Pesada'; 
      activo: boolean;
      vencimientoPermisoCirculacion?: Date;
      vencimientoSeguroObligatorio?: Date;
      vencimientoRevisionTecnica?: Date;
    }) => {
      const formatDateForDB = (date: Date | undefined) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const { data, error } = await supabase
        .from('gruas')
        .insert({
          patente: grua.patente,
          marca: grua.marca,
          modelo: grua.modelo,
          tipo: grua.tipo,
          activo: grua.activo,
          vencimiento_permiso_circulacion: formatDateForDB(grua.vencimientoPermisoCirculacion),
          vencimiento_seguro_obligatorio: formatDateForDB(grua.vencimientoSeguroObligatorio),
          vencimiento_revision_tecnica: formatDateForDB(grua.vencimientoRevisionTecnica)
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
    mutationFn: async (params: { 
      id: string; 
      patente: string; 
      marca: string; 
      modelo: string; 
      tipo: 'Liviana' | 'Mediana' | 'Pesada'; 
      activo: boolean;
      vencimientoPermisoCirculacion?: Date;
      vencimientoSeguroObligatorio?: Date;
      vencimientoRevisionTecnica?: Date;
    }) => {
      const { id, ...grua } = params;
      
      const formatDateForDB = (date: Date | undefined) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const { data, error } = await supabase
        .from('gruas')
        .update({
          patente: grua.patente,
          marca: grua.marca,
          modelo: grua.modelo,
          tipo: grua.tipo,
          activo: grua.activo,
          vencimiento_permiso_circulacion: formatDateForDB(grua.vencimientoPermisoCirculacion),
          vencimiento_seguro_obligatorio: formatDateForDB(grua.vencimientoSeguroObligatorio),
          vencimiento_revision_tecnica: formatDateForDB(grua.vencimientoRevisionTecnica)
        })
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
