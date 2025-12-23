// src/pages/admin/AdminGaleriaForm.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import {
  fetchGalleryImageById,
  uploadGalleryImage,
  upsertGalleryImage,
  type GalleryImageRecord,
} from "@/lib/galleryApi";

type RouteParams = {
  id: string;
};

export default function AdminGaleriaForm() {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isEditing = id && id !== "nueva";

  const [formData, setFormData] = useState({
    altText: "",
    position: 1,
  });

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: existingImage, isLoading: isLoadingImage } = useQuery<
    GalleryImageRecord | null
  >({
    queryKey: ["admin-gallery-image", id],
    queryFn: () => fetchGalleryImageById(id as string),
    enabled: !!isEditing,
  });

  useEffect(() => {
    if (existingImage) {
      setFormData({
        altText: existingImage.alt_text ?? "",
        position: existingImage.order_index ?? 1,
      });
      setPreviewUrl(existingImage.public_url);
    }
  }, [existingImage]);

  const mutation = useMutation({
    mutationFn: async () => {
      let storageMeta: { storage_path: string; public_url: string | null } | undefined;

      // Si es nuevo o el usuario eligió un archivo, subimos
      if (!isEditing || file) {
        if (!file) {
          throw new Error("Debes seleccionar un archivo de imagen.");
        }

        storageMeta = await uploadGalleryImage(file);
      }

      return upsertGalleryImage({
        id: isEditing ? (id as string) : undefined,
        altText: formData.altText,
        orderIndex: formData.position || null,
        isPublic: true,
        category: null,
        storageMeta,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery-images"] });
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ["admin-gallery-image", id] });
      }

      toast({
        title: isEditing ? "Imagen actualizada" : "Imagen agregada",
        description: isEditing
          ? "Los cambios han sido guardados correctamente."
          : "La imagen ha sido agregada a la galería.",
      });

      navigate("/admin/galeria");
    },
    onError: (error: any) => {
      toast({
        title: "Error al guardar",
        description: error?.message ?? "No se pudo guardar la imagen.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      toast({
        title: "Formato no válido",
        description: "Solo se admiten archivos de imagen.",
        variant: "destructive",
      });
      return;
    }

    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.altText.trim()) {
      toast({
        title: "Error",
        description: "El texto alternativo es obligatorio.",
        variant: "destructive",
      });
      return;
    }

    if (!isEditing && !file) {
      toast({
        title: "Error",
        description: "Debes seleccionar una imagen para agregarla a la galería.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate();
  };

  const isSaving = mutation.isPending;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/admin/galeria">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a galería
          </Link>
        </Button>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
          {isEditing ? "Editar imagen" : "Nueva imagen"}
        </h1>
      </div>

      <Card className="border-border max-w-3xl">
        <CardContent className="p-6">
          {isEditing && isLoadingImage ? (
            <p>Cargando datos de la imagen…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file">Archivo de imagen {isEditing ? "(opcional)" : "*"}</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="input-field"
                />
                <p className="text-xs text-muted-foreground">
                  Se subirá al bucket de almacenamiento de galería.
                </p>

                {previewUrl && (
                  <div className="mt-3 aspect-video max-w-sm rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="altText">Texto alternativo *</Label>
                <Input
                  id="altText"
                  name="altText"
                  type="text"
                  placeholder="Descripción de la imagen"
                  value={formData.altText}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Describe brevemente el contenido de la imagen para accesibilidad.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Posición / Orden</Label>
                <Input
                  id="position"
                  name="position"
                  type="number"
                  min="1"
                  value={formData.position}
                  onChange={handleChange}
                  className="input-field max-w-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  Número que determina el orden de aparición en la galería.
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? "Guardar cambios" : "Agregar imagen"}
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/admin/galeria">Cancelar</Link>
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
