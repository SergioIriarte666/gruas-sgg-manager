
import React from 'react';
import { ValidacionResultado } from '@/types/migracion';
import { ValidationSummaryCard } from './ValidationSummaryCard';
import { ValidationDetailsTable } from './ValidationDetailsTable';
import { ValidationActions } from './ValidationActions';
import { ValidationErrorAlert } from './ValidationErrorAlert';

interface ValidacionDatosProps {
  datos: any[];
  validaciones: ValidacionResultado[];
  onContinuar: () => void;
  onVolver: () => void;
}

export const ValidacionDatos: React.FC<ValidacionDatosProps> = ({
  datos,
  validaciones,
  onContinuar,
  onVolver
}) => {
  const errores = validaciones.filter(v => v.nivel === 'error');

  return (
    <div className="space-y-6">
      <ValidationSummaryCard validaciones={validaciones} />
      <ValidationDetailsTable validaciones={validaciones} />
      <ValidationActions 
        errores={errores}
        onVolver={onVolver}
        onContinuar={onContinuar}
      />
      <ValidationErrorAlert errores={errores} />
    </div>
  );
};
