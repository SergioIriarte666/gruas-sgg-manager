
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckSquare, Square } from 'lucide-react';

interface EquipmentItem {
  id: string;
  name: string;
  category: string;
}

interface EquipmentChecklistProps {
  checkedItems: Record<string, boolean>;
  onItemToggle: (itemId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const EQUIPMENT_ITEMS: EquipmentItem[] = [
  // Interior
  { id: 'radio', name: 'Radio', category: 'Interior' },
  { id: 'espejo_retrovisor', name: 'Espejo Retrovisor', category: 'Interior' },
  { id: 'cenicero', name: 'Cenicero', category: 'Interior' },
  { id: 'encendedor', name: 'Encendedor', category: 'Interior' },
  { id: 'alfombras', name: 'Alfombras', category: 'Interior' },
  { id: 'tapasoles', name: 'Tapasoles', category: 'Interior' },
  { id: 'guantera', name: 'Guantera', category: 'Interior' },
  { id: 'consola_central', name: 'Consola Central', category: 'Interior' },
  { id: 'aire_acondicionado', name: 'Aire Acondicionado', category: 'Interior' },
  { id: 'calefaccion', name: 'Calefacción', category: 'Interior' },
  
  // Exterior
  { id: 'antena', name: 'Antena', category: 'Exterior' },
  { id: 'espejos_laterales', name: 'Espejos Laterales', category: 'Exterior' },
  { id: 'emblemas', name: 'Emblemas', category: 'Exterior' },
  { id: 'molduras', name: 'Molduras', category: 'Exterior' },
  { id: 'parachoques', name: 'Parachoques', category: 'Exterior' },
  { id: 'rejilla', name: 'Rejilla', category: 'Exterior' },
  { id: 'tapacubos', name: 'Tapacubos', category: 'Exterior' },
  { id: 'llantas', name: 'Llantas', category: 'Exterior' },
  
  // Iluminación
  { id: 'faros_delanteros', name: 'Faros Delanteros', category: 'Iluminación' },
  { id: 'faros_traseros', name: 'Faros Traseros', category: 'Iluminación' },
  { id: 'luces_direccionales', name: 'Luces Direccionales', category: 'Iluminación' },
  { id: 'luz_placa', name: 'Luz de Placa', category: 'Iluminación' },
  { id: 'luces_freno', name: 'Luces de Freno', category: 'Iluminación' },
  { id: 'luz_reversa', name: 'Luz de Reversa', category: 'Iluminación' },
  
  // Seguridad
  { id: 'cinturones', name: 'Cinturones de Seguridad', category: 'Seguridad' },
  { id: 'extintor', name: 'Extintor', category: 'Seguridad' },
  { id: 'triangulos', name: 'Triángulos', category: 'Seguridad' },
  { id: 'botiquin', name: 'Botiquín', category: 'Seguridad' },
  { id: 'llanta_repuesto', name: 'Llanta de Repuesto', category: 'Seguridad' },
  { id: 'gato', name: 'Gato', category: 'Seguridad' },
  { id: 'llave_ruedas', name: 'Llave de Ruedas', category: 'Seguridad' },
  
  // Documentos
  { id: 'manual_usuario', name: 'Manual de Usuario', category: 'Documentos' },
  { id: 'tarjeta_propiedad', name: 'Tarjeta de Propiedad', category: 'Documentos' },
  { id: 'revision_tecnica', name: 'Revisión Técnica', category: 'Documentos' },
  { id: 'seguro', name: 'Seguro', category: 'Documentos' },
  
  // Otros
  { id: 'llaves_contacto', name: 'Llaves de Contacto', category: 'Otros' },
  { id: 'control_alarma', name: 'Control de Alarma', category: 'Otros' },
  { id: 'estuche_llaves', name: 'Estuche de Llaves', category: 'Otros' },
  { id: 'tapa_combustible', name: 'Tapa de Combustible', category: 'Otros' }
];

const CATEGORIES = ['Interior', 'Exterior', 'Iluminación', 'Seguridad', 'Documentos', 'Otros'];

export const EquipmentChecklist: React.FC<EquipmentChecklistProps> = ({
  checkedItems,
  onItemToggle,
  onSelectAll,
  onDeselectAll
}) => {
  const totalItems = EQUIPMENT_ITEMS.length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <Card className="bg-black border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Verificación de Equipamiento ({checkedCount}/{totalItems})
        </CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={onSelectAll}
            variant="outline"
            size="sm"
            className="text-primary border-primary/30 hover:bg-primary/10"
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Seleccionar Todo
          </Button>
          <Button
            onClick={onDeselectAll}
            variant="outline"
            size="sm"
            className="text-primary border-primary/30 hover:bg-primary/10"
          >
            <Square className="h-4 w-4 mr-2" />
            Deseleccionar Todo
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {CATEGORIES.map(category => {
          const categoryItems = EQUIPMENT_ITEMS.filter(item => item.category === category);
          const categoryCheckedCount = categoryItems.filter(item => checkedItems[item.id]).length;
          
          return (
            <div key={category} className="space-y-3">
              <h4 className="text-primary font-semibold text-sm">
                {category} ({categoryCheckedCount}/{categoryItems.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categoryItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-2 p-2 rounded border border-primary/20 hover:bg-primary/5">
                    <Checkbox
                      id={item.id}
                      checked={checkedItems[item.id] || false}
                      onCheckedChange={() => onItemToggle(item.id)}
                      className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-black"
                    />
                    <label
                      htmlFor={item.id}
                      className="text-sm text-primary cursor-pointer flex-1"
                    >
                      {item.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export { EQUIPMENT_ITEMS };
