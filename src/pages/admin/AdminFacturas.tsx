import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { mockFacturas, mockProfesionales } from "@/lib/dataAdapter";

export default function AdminFacturas() {
  const { toast } = useToast();
  const [facturas, setFacturas] = useState(mockFacturas);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getProfesionalName = (id: string) => {
    const prof = mockProfesionales.find(p => p.id === id);
    return prof?.nombre || "Desconocido";
  };

  const getProfesionalMatricula = (id: string) => {
    const prof = mockProfesionales.find(p => p.id === id);
    return prof?.matricula || "-";
  };

  const getProfesionalDni = (id: string) => {
    const prof = mockProfesionales.find(p => p.id === id);
    return prof?.dni || "-";
  };

  const formatMes = (mes: string) => {
    const [year, month] = mes.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  };

  const filteredFacturas = facturas.filter(f => {
    const profName = getProfesionalName(f.profesionalId).toLowerCase();
    const profMatricula = getProfesionalMatricula(f.profesionalId).toLowerCase();
    return profName.includes(searchTerm.toLowerCase()) || 
           profMatricula.includes(searchTerm.toLowerCase());
  });

  const handleDelete = () => {
    if (deleteId) {
      setFacturas(facturas.filter(f => f.id !== deleteId));
      toast({
        title: "Factura eliminada",
        description: "La factura ha sido eliminada correctamente"
      });
      setDeleteId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            Gestión de Facturas
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra las facturas de los profesionales
          </p>
        </div>
        <Link to="/admin/facturas/nueva">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Factura
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">{facturas.length}</p>
            <p className="text-xs text-muted-foreground">Total Facturas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">
              {new Set(facturas.map(f => f.profesionalId)).size}
            </p>
            <p className="text-xs text-muted-foreground">Profesionales con Facturas</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Listado de Facturas</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profesional</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Fecha Emisión</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFacturas.map((factura) => (
                  <TableRow key={factura.id}>
                    <TableCell className="font-medium">
                      {getProfesionalName(factura.profesionalId)}
                    </TableCell>
                    <TableCell>{getProfesionalMatricula(factura.profesionalId)}</TableCell>
                    <TableCell>{getProfesionalDni(factura.profesionalId)}</TableCell>
                    <TableCell>{formatMes(factura.mes)}</TableCell>
                    <TableCell>
                      {new Date(factura.createdAt).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <a 
                          href={factura.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </a>
                        <Link to={`/admin/facturas/${factura.id}`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setDeleteId(factura.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredFacturas.map((factura) => (
              <div key={factura.id} className="bg-secondary/50 rounded-lg p-4">
                <div className="mb-3">
                  <p className="font-medium">{getProfesionalName(factura.profesionalId)}</p>
                  <p className="text-sm text-muted-foreground">
                    {getProfesionalMatricula(factura.profesionalId)} • DNI: {getProfesionalDni(factura.profesionalId)}
                  </p>
                </div>
                <p className="text-sm font-medium mb-1">{formatMes(factura.mes)}</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Emitida: {new Date(factura.createdAt).toLocaleDateString('es-ES')}
                </p>
                <div className="flex gap-2">
                  <a 
                    href={factura.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </a>
                  <Link to={`/admin/facturas/${factura.id}`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDeleteId(factura.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredFacturas.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No se encontraron facturas
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar factura?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La factura será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
