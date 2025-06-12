
import { useQuery } from "@tanstack/react-query";
import { useOperadores } from "./useOperadores";
import { useGruas } from "./useGruas";

export interface AlertaVencimiento {
  id: string;
  tipo: 'operador' | 'grua';
  entidad: string;
  campo: string;
  fechaVencimiento: Date;
  diasRestantes: number;
  estado: 'proximo' | 'vencido';
}

export const useVencimientos = () => {
  const { data: operadores = [] } = useOperadores();
  const { data: gruas = [] } = useGruas();

  return useQuery({
    queryKey: ['vencimientos', operadores, gruas],
    queryFn: () => {
      const alertas: AlertaVencimiento[] = [];
      const hoy = new Date();
      const limiteDias = 15;

      // Verificar vencimientos de operadores
      operadores.forEach(operador => {
        if (!operador.activo) return;

        const campos = [
          { campo: 'Licencia de Conducir', fecha: operador.vencimientoLicencia },
          { campo: 'Exámenes', fecha: operador.vencimientoExamenes }
        ];

        campos.forEach(({ campo, fecha }) => {
          if (fecha) {
            const diasRestantes = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diasRestantes <= limiteDias) {
              alertas.push({
                id: `${operador.id}-${campo.toLowerCase().replace(/\s+/g, '-')}`,
                tipo: 'operador',
                entidad: operador.nombreCompleto,
                campo,
                fechaVencimiento: fecha,
                diasRestantes,
                estado: diasRestantes < 0 ? 'vencido' : 'proximo'
              });
            }
          }
        });
      });

      // Verificar vencimientos de grúas
      gruas.forEach(grua => {
        if (!grua.activo) return;

        const campos = [
          { campo: 'Permiso de Circulación', fecha: grua.vencimientoPermisoCirculacion },
          { campo: 'Seguro Obligatorio', fecha: grua.vencimientoSeguroObligatorio },
          { campo: 'Revisión Técnica', fecha: grua.vencimientoRevisionTecnica }
        ];

        campos.forEach(({ campo, fecha }) => {
          if (fecha) {
            const diasRestantes = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
            
            if (diasRestantes <= limiteDias) {
              alertas.push({
                id: `${grua.id}-${campo.toLowerCase().replace(/\s+/g, '-')}`,
                tipo: 'grua',
                entidad: `${grua.patente} (${grua.marca} ${grua.modelo})`,
                campo,
                fechaVencimiento: fecha,
                diasRestantes,
                estado: diasRestantes < 0 ? 'vencido' : 'proximo'
              });
            }
          }
        });
      });

      // Ordenar por días restantes (más urgente primero)
      return alertas.sort((a, b) => a.diasRestantes - b.diasRestantes);
    },
    enabled: operadores.length > 0 || gruas.length > 0
  });
};
