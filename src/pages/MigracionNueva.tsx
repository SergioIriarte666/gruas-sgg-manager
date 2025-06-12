
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MigracionStepper } from '@/components/migracion/MigracionStepper';
import { PreparacionStep } from '@/components/migracion/PreparacionStep';
import { VistaPreviaStep } from '@/components/migracion/VistaPreviaStep';
import { ValidacionDatos } from '@/components/migracion/ValidacionDatos';
import { ProcesarMigracion } from '@/components/migracion/ProcesarMigracion';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { useMigracionValidator } from '@/hooks/useMigracionValidator';
import { useMigracionState } from '@/hooks/useMigracionState';
import { useToast } from '@/hooks/use-toast';

const MigracionNueva = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { processFile, isProcessing, result, error, reset } = useFileProcessor();
  const { validarDatos } = useMigracionValidator();
  const {
    estado,
    avanzarPaso,
    retrocederPaso,
    irAPaso,
    setArchivo,
    setDatos,
    setValidaciones,
    setProcesando,
    setCompletado,
    resetEstado
  } = useMigracionState();

  const handleFileSelect = async (file: File) => {
    try {
      setArchivo(file);
      setProcesando(true);
      
      const resultado = await processFile(file);
      
      setDatos(resultado.data);
      setProcesando(false);
      avanzarPaso();

      toast({
        title: "Archivo procesado",
        description: `Se encontraron ${resultado.totalRows} registros para procesar`,
      });
    } catch (err) {
      setProcesando(false);
      toast({
        title: "Error al procesar archivo",
        description: error || "Error desconocido",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFile = () => {
    reset();
    resetEstado();
  };

  const handleContinuarValidacion = () => {
    if (estado.datos && result) {
      const validaciones = validarDatos(estado.datos, result.headers);
      setValidaciones(validaciones);
      avanzarPaso();
      
      toast({
        title: "Validación completada",
        description: `Se validaron ${estado.datos.length} registros`,
      });
    }
  };

  const handleFinalizarMigracion = () => {
    setCompletado(true);
    toast({
      title: "Migración finalizada",
      description: "La migración se ha completado exitosamente",
    });
    navigate('/migraciones');
  };

  const renderPasoActual = () => {
    switch (estado.paso) {
      case 1:
        return (
          <PreparacionStep
            onFileSelect={handleFileSelect}
            isProcessing={isProcessing || estado.procesando}
            selectedFile={estado.archivo}
            onRemoveFile={handleRemoveFile}
          />
        );
      case 2:
        return result ? (
          <VistaPreviaStep
            result={result}
            onCambiarArchivo={() => irAPaso(1)}
            onContinuar={handleContinuarValidacion}
          />
        ) : null;
      case 3:
        return estado.datos && estado.validaciones ? (
          <ValidacionDatos
            datos={estado.datos}
            validaciones={estado.validaciones}
            onContinuar={() => avanzarPaso()}
            onVolver={() => retrocederPaso()}
          />
        ) : null;
      case 4:
        return estado.datos ? (
          <ProcesarMigracion
            datos={estado.datos}
            onVolver={() => retrocederPaso()}
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
      <MigracionStepper
        pasoActual={estado.paso}
        archivoCompleto={!!estado.archivo}
        datosCompletos={!!estado.datos}
        validacionesCompletas={!!estado.validaciones}
        procesoCompletado={estado.completado}
      />

      {/* Contenido del paso actual */}
      {renderPasoActual()}
    </div>
  );
};

export default MigracionNueva;
