
import React, { useCallback, useState } from 'react';
import { Upload, FileText, Download, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
  selectedFile?: File | null;
  onRemoveFile?: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  isProcessing = false,
  selectedFile,
  onRemoveFile
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Formato no válido",
        description: "Solo se permiten archivos Excel (.xlsx, .xls) o CSV",
        variant: "destructive"
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "Archivo muy grande",
        description: "El archivo no puede superar los 10MB",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect, toast]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
    // Reset input
    e.target.value = '';
  }, [onFileSelect, toast]);

  const downloadTemplate = () => {
    // Crear template CSV básico
    const headers = [
      'fecha_servicio',
      'marca_vehiculo', 
      'modelo_vehiculo',
      'patente',
      'ubicacion_origen',
      'ubicacion_destino',
      'cliente_nombre',
      'cliente_rut',
      'grua_patente',
      'operador_nombre',
      'tipo_servicio',
      'valor_servicio',
      'observaciones'
    ];

    const csvContent = headers.join(',') + '\n' +
      '2025-06-15,Toyota,Corolla,ABCD12,"Av. Providencia 123","Av. Las Condes 456","Empresa Transporte A",76123456-7,EFGH34,"Juan Pérez","Remolque Completo",50000,"Servicio de ejemplo"';

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template_servicios_sgg.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Template descargado",
      description: "Se ha descargado el archivo template_servicios_sgg.csv"
    });
  };

  if (selectedFile) {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-green-500" />
              <div>
                <div className="font-medium text-green-400">{selectedFile.name}</div>
                <div className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            </div>
            {onRemoveFile && !isProcessing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemoveFile}
                className="text-muted-foreground hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isProcessing && (
            <div className="mt-4 text-center text-muted-foreground">
              Procesando archivo...
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <CardContent 
          className="p-8 text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              Arrastra tu archivo aquí o haz clic para seleccionar
            </h3>
            <p className="text-muted-foreground">
              Formatos soportados: Excel (.xlsx, .xls) o CSV • Máximo 10MB
            </p>
          </div>
          
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          
          <Button asChild className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Seleccionar Archivo
            </label>
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="h-4 w-4 mr-2" />
          Descargar Template
        </Button>
      </div>
    </div>
  );
};
