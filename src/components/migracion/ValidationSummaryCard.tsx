
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { ValidacionResultado } from '@/types/migracion';

interface ValidationSummaryCardProps {
  validaciones: ValidacionResultado[];
}

export const ValidationSummaryCard: React.FC<ValidationSummaryCardProps> = ({ validaciones }) => {
  const errores = validaciones.filter(v => v.nivel === 'error');
  const advertencias = validaciones.filter(v => v.nivel === 'advertencia');
  const validos = validaciones.filter(v => v.nivel === 'valido');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Resumen de Validación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="text-2xl font-bold text-green-400">{validos.length}</div>
            <div className="text-sm text-muted-foreground">Registros Válidos</div>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <div className="text-2xl font-bold text-yellow-400">{advertencias.length}</div>
            <div className="text-sm text-muted-foreground">Advertencias</div>
          </div>
          <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/30">
            <div className="text-2xl font-bold text-red-400">{errores.length}</div>
            <div className="text-sm text-muted-foreground">Errores</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
