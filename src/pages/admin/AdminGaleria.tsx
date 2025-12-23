// src/pages/admin/AdminGaleria.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

import {
  fetchAdminGalleryImages,
  deleteGalleryImage,
  type GalleryImageRecord,
} from "@/lib/galleryApi";

const MAX_IMAGES = 30;

export default function AdminGaleria() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteImage, setDeleteImage] = useState<GalleryImageRecord | null>(null);

  const {
    data: images = [],
    isLoading,
    isError,
    error,
  } = useQuery<GalleryImageRecord[], Error>({
    queryKey: ["admin-gallery-images"],
    queryFn: fetchAdminGalleryImages,
  });

  const canAddMore = images.length < MAX_IMAGES;

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error al cargar galería",
        description:
          error?.message ?? "No se pudieron cargar las imágenes de la galería.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  const deleteMutation = useMutation({
    mutationFn: (img: GalleryImageRecord) => deleteGalleryImage(img),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-images"] });
      toast({
        title: "Imagen eliminada",
        description: "La imagen ha sido eliminada de la galería.",
      });
      setDeleteImage(null);
    },
    onError: (err: any) => {
      toast({
        title: "Error al eliminar",
        description: err?.message ?? "No se pudo eliminar la imagen.",
        variant: "destructive",
      });
    },
  });

  const handleConfirmDelete = () => {
    if (deleteImage) {
      deleteMutation.mutate(deleteImage);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            Gestión de Galería
          </h1>
          <p className="text-muted-foreground mt-1">
            {images.length} de {MAX_IMAGES} imágenes
          </p>
        </div>
        {canAddMore ? (
          <Button asChild>
            <Link to="/admin/galeria/nueva">
              <Plus className="w-4 h-4 mr-2" />
              Agregar imagen
            </Link>
          </Button>
        ) : (
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Límite alcanzado
          </Button>
        )}
      </div>

      {!canAddMore && (
        <Card className="border-amber-500/50 bg-amber-50 mb-6">
          <CardContent className="p-4">
            <p className="text-amber-800 text-sm">
              Has alcanzado el límite máximo de {MAX_IMAGES} imágenes. Elimina algunas para agregar nuevas.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="border-border">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="py-10 text-center text-muted-foreground">
              Cargando imágenes…
            </div>
          ) : images.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              <p className="mb-4">No hay imágenes en la galería.</p>
              <Button asChild>
                <Link to="/admin/galeria/nueva">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar primera imagen
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <Card
                  key={image.id}
                  className="border-border overflow-hidden group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="aspect-square relative">
                    <img
                      src={image.public_url ?? "/placeholder.png"}
                      alt={image.alt_text ?? ""}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" asChild>
                        <Link to={`/admin/galeria/${image.id}`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteImage(image)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {image.alt_text}
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      Orden: {image.order_index ?? "-"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!deleteImage}
        onOpenChange={(open) => !open && setDeleteImage(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar imagen?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La imagen será eliminada de la galería y del almacenamiento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
