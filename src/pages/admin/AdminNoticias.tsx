import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
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
import { mockNews, News } from "@/lib/dataAdapter";

export default function AdminNoticias() {
  const { toast } = useToast();
  const [news, setNews] = useState<News[]>(mockNews);
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
      setNews((prev) => prev.filter((n) => n.id !== deleteId));
      toast({
        title: "Noticia eliminada",
        description: "La noticia ha sido eliminada correctamente.",
      });
      setDeleteId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            Gestión de Noticias
          </h1>
          <p className="text-muted-foreground mt-1">
            {news.length} noticias publicadas
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/noticias/nueva">
            <Plus className="w-4 h-4 mr-2" />
            Crear noticia
          </Link>
        </Button>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {news.map((item, index) => (
          <Card 
            key={item.id} 
            className="border-border animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {item.imageUrl && (
                  <div className="w-full md:w-24 h-32 md:h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                    <Calendar className="w-4 h-4" />
                    <time>{formatDate(item.publishedAt)}</time>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/noticias/${item.id}`}>
                      <Pencil className="w-4 h-4 mr-1" />
                      Editar
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {news.length === 0 && (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No hay noticias publicadas.</p>
              <Button asChild>
                <Link to="/admin/noticias/nueva">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear primera noticia
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
            <AlertDialogTitle>¿Eliminar noticia?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La noticia será eliminada permanentemente.
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
