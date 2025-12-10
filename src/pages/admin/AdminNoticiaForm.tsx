// src/pages/admin/AdminNoticiaForm.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { NewsItem } from "@/lib/types/news";
import { mapRowToNewsItem } from "@/lib/types/news";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

async function fetchNewsForEdit(id: string): Promise<NewsItem | null> {
  const { data, error } = await supabase
    .from("news")
    .select("id, title, slug, excerpt, content, image_url, published_at, is_published")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[AdminNoticiaForm] fetchNewsForEdit error:", error);
    throw new Error("No se pudo cargar la noticia");
  }

  if (!data) return null;
  return mapRowToNewsItem(data);
}

type FormState = {
  title: string;
  content: string;
  publishedAt: string;
  imageUrl: string;
  isPublished: boolean;
};

function buildExcerpt(content: string): string {
  if (!content) return "";
  return content.replace(/\s+/g, " ").slice(0, 200).trim() + (content.length > 200 ? "…" : "");
}

export default function AdminNoticiaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isEditing = !!id && id !== "nueva";

  const [formData, setFormData] = useState<FormState>({
    title: "",
    content: "",
    publishedAt: new Date().toISOString().split("T")[0],
    imageUrl: "",
    isPublished: true,
  });

  const {
    data: existingNews,
    isLoading: isLoadingExisting,
    isError: isErrorExisting,
    error: errorExisting,
  } = useQuery({
    queryKey: ["admin-news-detail", id],
    queryFn: () => fetchNewsForEdit(id || ""),
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingNews) {
      setFormData({
        title: existingNews.title,
        content: existingNews.content,
        publishedAt: existingNews.publishedAt
          ? new Date(existingNews.publishedAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        imageUrl: existingNews.imageUrl || "",
        isPublished: existingNews.isPublished,
      });
    }
  }, [existingNews]);

  const upsertNews = useMutation({
    mutationFn: async (payload: FormState) => {
      if (!payload.title.trim() || !payload.content.trim() || !payload.publishedAt) {
        throw new Error("Título, contenido y fecha de publicación son obligatorios.");
      }

      const slug = slugify(payload.title);
      const published_at = new Date(payload.publishedAt).toISOString();
      const excerpt = buildExcerpt(payload.content);

      const basePayload = {
        title: payload.title.trim(),
        slug,
        excerpt,
        content: payload.content,
        image_url: payload.imageUrl || null,
        is_published: payload.isPublished,
        published_at,
      };

      if (isEditing && id) {
        const { error } = await supabase
          .from("news")
          .update(basePayload)
          .eq("id", id);

        if (error) {
          console.error("[AdminNoticiaForm] update error:", error);
          throw new Error("No se pudo actualizar la noticia.");
        }
      } else {
        const { error } = await supabase.from("news").insert(basePayload);

        if (error) {
          console.error("[AdminNoticiaForm] insert error:", error);
          throw new Error("No se pudo crear la noticia.");
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news"] });
      queryClient.invalidateQueries({ queryKey: ["public-news"] });

      toast({
        title: isEditing ? "Noticia actualizada" : "Noticia creada",
        description: isEditing
          ? "Los cambios han sido guardados correctamente."
          : "La noticia ha sido publicada correctamente.",
      });

      navigate("/admin/noticias");
    },
    onError: (err: unknown) => {
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "No se pudo guardar la noticia.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertNews.mutate(formData);
  };

  if (isEditing && isLoadingExisting) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        Cargando noticia…
      </div>
    );
  }

  if (isEditing && isErrorExisting) {
    return (
      <div className="py-16 text-center text-red-500">
        {(errorExisting as Error)?.message ||
          "No se pudo cargar la noticia para editar."}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/admin/noticias">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a noticias
          </Link>
        </Button>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
          {isEditing ? "Editar noticia" : "Nueva noticia"}
        </h1>
      </div>

      <Card className="border-border max-w-3xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Título de la noticia"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="publishedAt">Fecha de publicación *</Label>
                <Input
                  id="publishedAt"
                  name="publishedAt"
                  type="date"
                  value={formData.publishedAt}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 flex items-end">
                <label className="flex items-center gap-2 text-sm mt-6">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                  />
                  <span>Publicar en el sitio</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de imagen (opcional)</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
              />
              {formData.imageUrl && (
                <div className="mt-2 aspect-video max-w-sm rounded-lg overflow-hidden">
                  <img
                    src={formData.imageUrl}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido *</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Escribe el contenido de la noticia..."
                value={formData.content}
                onChange={handleChange}
                className="min-h-[300px]"
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={upsertNews.isPending}>
                {upsertNews.isPending ? (
                  "Guardando..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? "Guardar cambios" : "Publicar noticia"}
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/noticias">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
