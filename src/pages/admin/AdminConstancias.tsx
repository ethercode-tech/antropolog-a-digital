import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Upload, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { mockConstanciaSolicitudes, mockProfesionales, EstadoSolicitud } from "@/data/profesionalesData";

const estadoLabels: Record<EstadoSolicitud, string> = {
  pendiente: "Pendiente",
  en_revision: "En Revisión",
  observado: "Observado",
  aprobado: "Aprobada",
  rechazado: "Rechazada"
};

const estadoColors: Record<EstadoSolicitud, string> = {
  pendiente: "bg-yellow-100 text-yellow-800",
  en_revision: "bg-blue-100 text-blue-800",
  observado: "bg-orange-100 text-orange-800",
  aprobado: "bg-green-100 text-green-800",
  rechazado: "bg-red-100 text-red-800"
};

export default function AdminConstancias() {
  const { toast } = useToast();
  const [constancias, setConstancias] = useState(mockConstanciaSolicitudes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEstado, setEditEstado] = useState<EstadoSolicitud>("pendiente");
  const [editPdfUrl, setEditPdfUrl] = useState("");

  const getProfesionalName = (id: string) => {
    const prof = mockProfesionales.find(p => p.id === id);
    return prof?.nombre || "Desconocido";
  };

  const getProfesionalMatricula = (id: string) => {
    const prof = mockProfesionales.find(p => p.id === id);
    return prof?.matricula || "-";
  };

  const filteredConstancias = constancias.filter(c => {
    const profName = getProfesionalName(c.profesionalId).toLowerCase();
    const matchSearch = profName.includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === "todos" || c.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const handleEdit = (constancia: typeof constancias[0]) => {
    setEditingId(constancia.id);
    setEditEstado(constancia.estado);
    setEditPdfUrl(constancia.pdfFinalUrl || "");
  };

  const handleSave = () => {
    if (editEstado === "aprobado" && !editPdfUrl) {
      toast({
        title: "PDF requerido",
        description: "Debe subir el PDF de la constancia para aprobar",
        variant: "destructive"
      });
      return;
    }

    setConstancias(constancias.map(c => 
      c.id === editingId 
        ? { ...c, estado: editEstado, pdfFinalUrl: editPdfUrl || undefined }
        : c
    ));
    
    toast({
      title: "Constancia actualizada",
      description: "Los cambios han sido guardados correctamente"
    });
    
    setEditingId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
          Solicitudes de Constancia
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestiona las solicitudes de constancia de habilitación
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">
              {constancias.filter(c => c.estado === "pendiente").length}
            </p>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">
              {constancias.filter(c => c.estado === "aprobado").length}
            </p>
            <p className="text-xs text-muted-foreground">Aprobadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">
              {constancias.filter(c => c.estado === "rechazado").length}
            </p>
            <p className="text-xs text-muted-foreground">Rechazadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre del profesional..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
                <SelectItem value="rechazado">Rechazado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Listado de Solicitudes</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profesional</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>PDF</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConstancias.map((constancia) => (
                  <TableRow key={constancia.id}>
                    <TableCell className="font-medium">
                      {getProfesionalName(constancia.profesionalId)}
                    </TableCell>
                    <TableCell>{getProfesionalMatricula(constancia.profesionalId)}</TableCell>
                    <TableCell>
                      {new Date(constancia.createdAt).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <Badge className={estadoColors[constancia.estado]}>
                        {estadoLabels[constancia.estado]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {constancia.pdfFinalUrl ? (
                        <a 
                          href={constancia.pdfFinalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          Ver PDF
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(constancia)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Gestionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredConstancias.map((constancia) => (
              <div key={constancia.id} className="bg-secondary/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{getProfesionalName(constancia.profesionalId)}</p>
                    <p className="text-sm text-muted-foreground">
                      {getProfesionalMatricula(constancia.profesionalId)}
                    </p>
                  </div>
                  <Badge className={estadoColors[constancia.estado]}>
                    {estadoLabels[constancia.estado]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Solicitado: {new Date(constancia.createdAt).toLocaleDateString('es-ES')}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleEdit(constancia)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Gestionar
                </Button>
              </div>
            ))}
          </div>

          {filteredConstancias.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No se encontraron solicitudes
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingId} onOpenChange={() => setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gestionar Constancia</DialogTitle>
            <DialogDescription>
              Actualice el estado y suba el PDF de la constancia
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={editEstado} onValueChange={(v) => setEditEstado(v as EstadoSolicitud)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="aprobado">Aprobada</SelectItem>
                  <SelectItem value="rechazado">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editEstado === "aprobado" && (
              <div className="space-y-2">
                <Label htmlFor="pdfUrl">URL del PDF de constancia *</Label>
                <div className="flex gap-2">
                  <Input
                    id="pdfUrl"
                    value={editPdfUrl}
                    onChange={(e) => setEditPdfUrl(e.target.value)}
                    placeholder="https://example.com/constancia.pdf"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Suba el PDF o ingrese la URL del documento
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingId(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
