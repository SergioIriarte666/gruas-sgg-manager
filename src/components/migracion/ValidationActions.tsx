
import React from 'react';
import { Button } from '@/components/ui/button';
import { ValidacionResultado } from '@/types/migracion';

interface ValidationActionsProps {
  errores: ValidacionResultado[];
  onVolver: () => void;
  onContinuar: () => void;
}

export const ValidationActions: React.FC<ValidationActionsProps> = ({
  errores,
  onVolver,
  onContinuar
}) => {
  return (
    <div className="flex gap-3">
      <Button variant="outline" onClick={onVolver}>
        Volver a Vista Previa
      </Button>
      <Button 
        onClick={onContinuar}
        disabled={errores.length > 0}
        className={errores.length > 0 ? "opacity-50 cursor-not-allowed" : ""}
      >
        {errores.length > 0 ? 
          `No se puede continuar (${errores.length} errores)` : 
          'Continuar al Procesamiento'
        }
      </Button>
    </div>
  );
};
