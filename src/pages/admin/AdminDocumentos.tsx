import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { mockDocuments } from "@/lib/dataAdapter";
import type { DocumentT as Document } from "@/lib/dataAdapter";

export default function AdminDocumentos() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      setDocuments((prev) => prev.filter((d) => d.id !== deleteId));
      toast({
        title: "Documento eliminado",
        description: "El documento ha sido eliminado correctamente.",
      });
      setDeleteId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            Gestión de Documentos
          </h1>
          <p className="text-muted-foreground mt-1">
            {documents.length} documentos publicados
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/documentos/nuevo">
            <Plus className="w-4 h-4 mr-2" />
            Cargar documento
          </Link>
        </Button>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((doc, index) => (
          <Card 
            key={doc.id} 
            className="border-border animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {doc.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-1 mt-0.5">
                    {doc.description}
                  </p>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                    <Calendar className="w-4 h-4" />
                    <time>{formatDate(doc.publishedAt)}</time>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/documentos/${doc.id}`}>
                      <Pencil className="w-4 h-4 mr-1" />
                      Editar
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(doc.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {documents.length === 0 && (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No hay documentos publicados.</p>
              <Button asChild>
                <Link to="/admin/documentos/nuevo">
                  <Plus className="w-4 h-4 mr-2" />
                  Cargar primer documento
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar documento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El documento será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
