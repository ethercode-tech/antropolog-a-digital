// src/pages/admin/AdminNoticias.tsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { supabase } from "@/integrations/supabase/client";
import type { NewsItem } from "@/lib/types/news";
import { mapRowToNewsItem } from "@/lib/types/news";

async function fetchAdminNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select("id, title, slug, excerpt, content, image_url, published_at, is_published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[AdminNoticias] fetchAdminNews error:", error);
    throw new Error("No se pudieron cargar las noticias");
  }

  return (data ?? []).map(mapRowToNewsItem);
}

async function deleteNewsRequest(id: string): Promise<void> {
  const { error } = await supabase.from("news").delete().eq("id", id);

  if (error) {
    console.error("[AdminNoticias] deleteNews error:", error);
    throw new Error("No se pudo eliminar la noticia");
  }
}

export default function AdminNoticias() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    data: news = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-news"],
    queryFn: fetchAdminNews,
  });

  const deleteNews = useMutation({
    mutationFn: deleteNewsRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      toast({
        title: "Noticia eliminada",
        description: "La noticia ha sido eliminada correctamente.",
      });
    },
    onError: (err: unknown) => {
      toast({
        title: "Error al eliminar",
        description:
          err instanceof Error
            ? err.message
            : "Ocurrió un error al eliminar la noticia.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteNews.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const publishedCount = useMemo(
    () => news.filter((n) => n.isPublished).length,
    [news]
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            Gestión de Noticias
          </h1>
          <p className="text-muted-foreground mt-1">
            {news.length} noticias en total, {publishedCount} publicadas
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/noticias/nueva">
            <Plus className="w-4 h-4 mr-2" />
            Crear noticia
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          Cargando noticias…
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-red-500">
          {(error as Error)?.message || "No se pudieron cargar las noticias."}
        </div>
      )}

      {!isLoading && !isError && (
        <>
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
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            item.isPublished
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {item.isPublished ? "Publicada" : "Borrador"}
                        </span>
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
                  <p className="text-muted-foreground mb-4">
                    No hay noticias cargadas.
                  </p>
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
        </>
      )}

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
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteNews.isPending}
            >
              {deleteNews.isPending ? "Eliminando…" : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
