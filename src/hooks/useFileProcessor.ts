
import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface FileProcessResult {
  data: any[];
  headers: string[];
  totalRows: number;
  errors: string[];
}

export const useFileProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<FileProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File): Promise<FileProcessResult> => {
    setIsProcessing(true);
    setError(null);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let processResult: FileProcessResult;

      if (fileExtension === 'csv') {
        processResult = await processCSV(file);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        processResult = await processExcel(file);
      } else {
        throw new Error('Formato de archivo no soportado. Use CSV o Excel (.xlsx, .xls)');
      }

      setResult(processResult);
      return processResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error procesando archivo';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processCSV = (file: File): Promise<FileProcessResult> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`Errores en CSV: ${results.errors.map(e => e.message).join(', ')}`));
            return;
          }

          const headers = results.meta.fields || [];
          const data = results.data;

          resolve({
            data,
            headers,
            totalRows: data.length,
            errors: []
          });
        },
        error: (error) => {
          reject(new Error(`Error leyendo CSV: ${error.message}`));
        }
      });
    });
  };

  const processExcel = async (file: File): Promise<FileProcessResult> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Usar la primera hoja
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convertir a JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            reject(new Error('El archivo Excel está vacío'));
            return;
          }

          // La primera fila son los headers
          const headers = (jsonData[0] as string[]).map(h => String(h || '').trim());
          const rows = jsonData.slice(1).filter(row => 
            Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && String(cell).trim() !== '')
          );

          // Convertir filas a objetos
          const data = rows.map(row => {
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header] = row[index] || '';
            });
            return obj;
          });

          resolve({
            data,
            headers,
            totalRows: data.length,
            errors: []
          });
        } catch (error) {
          reject(new Error(`Error procesando Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error leyendo el archivo'));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    processFile,
    isProcessing,
    result,
    error,
    reset
  };
};
