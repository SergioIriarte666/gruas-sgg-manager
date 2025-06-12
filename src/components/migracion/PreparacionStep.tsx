
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploader } from '@/components/migracion/FileUploader';

interface PreparacionStepProps {
  onFileSelect: (file: File) => Promise<void>;
  isProcessing: boolean;
  selectedFile?: File;
  onRemoveFile: () => void;
}

export const PreparacionStep: React.FC<PreparacionStepProps> = ({
  onFileSelect,
  isProcessing,
  selectedFile,
  onRemoveFile
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preparación de Datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Campos Obligatorios:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Fecha del servicio</li>
                <li>• Marca y modelo del vehículo</li>
                <li>• Patente del vehículo</li>
                <li>• Ubicaciones origen y destino</li>
                <li>• Datos del cliente</li>
                <li>• Grúa asignada</li>
                <li>• Operador asignado</li>
                <li>• Tipo de servicio</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Validaciones Automáticas:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Formato de patentes chilenas</li>
                <li>• Validación de RUT</li>
                <li>• Fechas válidas</li>
                <li>• Existencia de grúas y operadores</li>
                <li>• Tipos de servicio válidos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <FileUploader
        onFileSelect={onFileSelect}
        isProcessing={isProcessing}
        selectedFile={selectedFile}
        onRemoveFile={onRemoveFile}
      />
    </div>
  );
};
