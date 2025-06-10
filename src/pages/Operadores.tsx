import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, UserCheck, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { useOperadores, useDeleteOperador } from "@/hooks/useOperadores";
import { FormularioOperador } from "@/components/FormularioOperador";
import { Operador } from "@/types";
import { toast } from "@/components/ui/sonner";

export default function Operadores() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [operadorSeleccionado, setOperadorSeleccionado] = useState<Operador | undefined>();
  const [alertaEliminar, setAlertaEliminar] = useState<string | null>(null);
  
  const { data: operadores = [], isLoading, error } = useOperadores();
  const deleteMutation = useDeleteOperador();
  
  const operadoresFiltrados = operadores.filter(operador =>
    operador.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operador.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operador.telefono.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operador.numeroLicencia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando operadores...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error al cargar operadores: {error.message}
      </div>
    );
  }

  const handleNuevoOperador = () => {
    setOperadorSeleccionado(undefined);
    setModalAbierto(true);
  };

  const handleEditarOperador = (operador: Operador) => {
    setOperadorSeleccionado(operador);
    setModalAbierto(true);
  };

  const handleEliminarOperador = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Operador desactivado exitosamente");
      setAlertaEliminar(null);
    } catch (error) {
      toast.error("Error al desactivar el operador");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Operadores</h1>
          <p className="text-muted-foreground">Gestión de operadores de grúas</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark text-white" onClick={handleNuevoOperador}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Operador
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Búsqueda y Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre, RUT, teléfono o licencia..."
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Operadores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Lista de Operadores ({operadoresFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-muted-foreground">Nombre Completo</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">RUT</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Teléfono</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Licencia</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Estado</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {operadoresFiltrados.map((operador) => (
                  <tr key={operador.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="font-medium">{operador.nombreCompleto}</div>
                    </td>
                    <td className="p-3 font-mono text-sm">{operador.rut}</td>
                    <td className="p-3 text-sm">{operador.telefono}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="font-mono">
                        {operador.numeroLicencia}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant={operador.activo ? "default" : "secondary"}
                        className={operador.activo ? "bg-green-500/20 text-green-300 border-green-500/30" : ""}
                      >
                        {operador.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2"
                          onClick={() => handleEditarOperador(operador)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-2 text-red-400 hover:text-red-300"
                          onClick={() => setAlertaEliminar(operador.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {operadoresFiltrados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron operadores que coincidan con la búsqueda.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary text-sm">Total Operadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operadores.length}</div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <CardTitle className="text-green-400 text-sm">Operadores Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {operadores.filter(o => o.activo).length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-500/30 bg-gray-500/5">
          <CardHeader>
            <CardTitle className="text-gray-400 text-sm">Operadores Inactivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {operadores.filter(o => !o.activo).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {operadorSeleccionado ? "Editar Operador" : "Crear Nuevo Operador"}
            </DialogTitle>
          </DialogHeader>
          <FormularioOperador
            operador={operadorSeleccionado}
            onSuccess={() => setModalAbierto(false)}
            onCancel={() => setModalAbierto(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!alertaEliminar} onOpenChange={() => setAlertaEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará el operador. No podrá ser asignado a nuevos servicios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => alertaEliminar && handleEliminarOperador(alertaEliminar)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
