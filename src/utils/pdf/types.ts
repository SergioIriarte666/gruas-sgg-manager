
export interface CapturedImage {
  id: string;
  file: File;
  preview: string;
  timestamp: Date;
}

export interface FormData {
  fecha: string;
  cliente: string;
  marcaVehiculo: string;
  modeloVehiculo: string;
  patente: string;
  ubicacionOrigen: string;
  ubicacionDestino: string;
  gruaId: string;
  operadorId: string;
  tipoServicioId: string;
  observaciones: string;
  kmInicial: string;
  kmFinal: string;
  kmVehiculo: string;
  nivelCombustible: string;
  tipoAsistenciaDetallado: string;
}

export interface SelectedData {
  selectedGrua?: any;
  selectedOperador?: any;
  selectedTipoServicio?: any;
}
