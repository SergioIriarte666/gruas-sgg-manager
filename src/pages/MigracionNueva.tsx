
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileUp, Eye, CheckCircle, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FileUploader } from '@/components/migracion/FileUploader';
import { ValidacionDatos } from '@/components/migracion/ValidacionDatos';
import { ProcesarMigracion } from '@/components/migracion/ProcesarMigracion';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { useMigracionValidator } from '@/hooks/useMigracionValidator';
import { EstadoProceso } from '@/types/migracion';
import { useToast } from '@/hooks/use-toast';

const MigracionNueva = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { processFile, isProcessing, result, error, reset } = useFileProcessor();
  const { validarDatos } = useMigracionValidator();
  
  const [estado, setEstado] = useState<EstadoProceso>({
    paso: 1,
    procesando: false,
    completado: false
  });

  const pasos = [
    { numero: 1, titulo: 'Preparación y Carga', icono: FileUp, completado: !!estado.archivo },
    { numero: 2, titulo: 'Vista Previa y Mapeo', icono: Eye, completado: !!estado.datos },
    { numero: 3, titulo: 'Validación de Datos', icono: CheckCircle, completado: !!estado.validaciones },
    { numero: 4, titulo: 'Procesamiento', icono: Play, completado: estado.completado }
  ];

  const handleFileSelect = async (file: File) => {
    try {
      setEstado(prev => ({ ...prev, archivo: file, procesando: true }));
      
      const resultado = await processFile(file);
      
      setEstado(prev => ({
        ...prev,
        datos: resultado.data,
        procesando: false,
        paso: 2
      }));

      toast({
        title: "Archivo procesado",
        description: `Se encontraron ${resultado.totalRows} registros para procesar`,
      });
    } catch (err) {
      setEstado(prev => ({ ...prev, procesando: false }));
      toast({
        title: "Error al procesar archivo",
        description: error || "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFile = () => {
    reset();
    setEstado({
      paso: 1,
      procesando: false,
      completado: false
    });
  };

  const handleContinuarValidacion = () => {
    if (estado.datos) {
      const validaciones = validarDatos(estado.datos);
      setEstado(prev => ({
        ...prev,
        validaciones,
        paso: 3
      }));
      
      toast({
        title: "Validación completada",
        description: `Se validaron ${estado.datos.length} registros`,
      });
    }
  };

  const handleContinuarProcesamiento = () => {
    setEstado(prev => ({ ...prev, paso: 4 }));
  };

  const handleVolverValidacion = () => {
    setEstado(prev => ({ ...prev, paso: 2 }));
  };

  const handleVolverProcesamiento = () => {
    setEstado(prev => ({ ...prev, paso: 3 }));
  };

  const handleFinalizarMigracion = () => {
    setEstado(prev => ({ ...prev, completado: true }));
    toast({
      title: "Migración finalizada",
      description: "La migración se ha completado exitosamente",
    });
    navigate('/migraciones');
  };

  const renderPaso1 = () => (
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
        onFileSelect={handleFileSelect}
        isProcessing={isProcessing || estado.procesando}
        selectedFile={estado.archivo}
        onRemoveFile={handleRemoveFile}
      />
    </div>
  );

  const renderPaso2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vista Previa de Datos</CardTitle>
        </CardHeader>
        <CardContent>
          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="outline">{result.totalRows} registros</Badge>
                <Badge variant="outline">{result.headers.length} columnas</Badge>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {result.headers.slice(0, 6).map((header, index) => (
                        <th key={index} className="text-left p-2 font-medium">
                          {header}
                        </th>
                      ))}
                      {result.headers.length > 6 && <th className="text-left p-2">...</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {result.data.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-b">
                        {result.headers.slice(0, 6).map((header, colIndex) => (
                          <td key={colIndex} className="p-2 text-muted-foreground">
                            {String(row[header] || '').substring(0, 20)}
                            {String(row[header] || '').length > 20 ? '...' : ''}
                          </td>
                        ))}
                        {result.headers.length > 6 && <td className="p-2 text-muted-foreground">...</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {result.data.length > 5 && (
                <p className="text-muted-foreground text-sm">
                  Mostrando 5 de {result.data.length} registros
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setEstado(prev => ({ ...prev, paso: 1 }))}>
          Cambiar Archivo
        </Button>
        <Button onClick={handleContinuarValidacion}>
          Continuar a Validación
        </Button>
      </div>
    </div>
  );

  const renderPasoActual = () => {
    switch (estado.paso) {
      case 1:
        return renderPaso1();
      case 2:
        return renderPaso2();
      case 3:
        return estado.datos && estado.validaciones ? (
          <ValidacionDatos
            datos={estado.datos}
            validaciones={estado.validaciones}
            onContinuar={handleContinuarProcesamiento}
            onVolver={handleVolverValidacion}
          />
        ) : null;
      case 4:
        return estado.datos ? (
          <ProcesarMigracion
            datos={estado.datos}
            onVolver={handleVolverProcesamiento}
            onFinalizar={handleFinalizarMigracion}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/migraciones')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Nueva Carga Masiva</h1>
          <p className="text-muted-foreground">
            Proceso de migración de servicios paso a paso
          </p>
        </div>
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {pasos.map((paso, index) => {
              const Icon = paso.icono;
              const isActive = estado.paso === paso.numero;
              const isCompleted = paso.completado;
              
              return (
                <div key={paso.numero} className="flex items-center">
                  <div className={`flex items-center gap-3 ${
                    isActive ? 'text-primary' : isCompleted ? 'text-green-400' : 'text-muted-foreground'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-primary text-primary-foreground' : 
                      isCompleted ? 'bg-green-500 text-white' : 'bg-muted'
                    }`}>
                      {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <div className="hidden md:block">
                      <div className="font-medium">{paso.titulo}</div>
                      <div className="text-xs text-muted-foreground">Paso {paso.numero}</div>
                    </div>
                  </div>
                  {index < pasos.length - 1 && (
                    <div className="w-8 md:w-16 h-px bg-border mx-4" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contenido del paso actual */}
      {renderPasoActual()}
    </div>
  );
};

export default MigracionNueva;
