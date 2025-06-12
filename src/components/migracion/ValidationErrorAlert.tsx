
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { ValidacionResultado } from '@/types/migracion';

interface ValidationErrorAlertProps {
  errores: ValidacionResultado[];
}

export const ValidationErrorAlert: React.FC<ValidationErrorAlertProps> = ({ errores }) => {
  if (errores.length === 0) return null;

  return (
    <Card className="border-red-500/30 bg-red-500/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span className="font-medium">Errores encontrados</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Debes corregir los errores en el archivo antes de continuar con el procesamiento.
        </p>
      </CardContent>
    </Card>
  );
};
