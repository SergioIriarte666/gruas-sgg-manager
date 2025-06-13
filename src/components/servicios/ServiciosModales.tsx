
import { Button } from "@/components/ui/button";
import { FormularioServicio } from "@/components/FormularioServicio";
import { ServicioDetailsModal } from "@/components/ServicioDetailsModal";

interface ServiciosModalesProps {
  showNewForm: boolean;
  showEditForm: boolean;
  selectedServicio: any;
  isModalOpen: boolean;
  onFormSuccess: () => void;
  onFormCancel: () => void;
  onCloseModal: () => void;
}

export function ServiciosModales({
  showNewForm,
  showEditForm,
  selectedServicio,
  isModalOpen,
  onFormSuccess,
  onFormCancel,
  onCloseModal
}: ServiciosModalesProps) {
  return (
    <>
      {/* Modal de Nuevo Servicio */}
      {showNewForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Nuevo Servicio</h2>
                <Button variant="outline" onClick={onFormCancel}>
                  Cancelar
                </Button>
              </div>
              <FormularioServicio onSuccess={onFormSuccess} onCancel={onFormCancel} />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Servicio */}
      {showEditForm && selectedServicio && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Editar Servicio</h2>
                <Button variant="outline" onClick={onFormCancel}>
                  Cancelar
                </Button>
              </div>
              <FormularioServicio 
                servicio={selectedServicio}
                onSuccess={onFormSuccess} 
                onCancel={onFormCancel} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles del Servicio */}
      <ServicioDetailsModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        servicio={selectedServicio}
      />
    </>
  );
}
