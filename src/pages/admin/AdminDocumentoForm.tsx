// src/pages/admin/AdminDocumentoForm.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  fetchDocumentById,
  upsertDocument,
  uploadDocumentFile,
  type DocumentRecord,
} from "@/lib/dataAdapter";

type RouteParams = {
  id: string;
};

export default function AdminDocumentoForm() {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isEditing = id && id !== "nuevo";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    publishedAt: new Date().toISOString().split("T")[0],
    isPublic: true,
    category: "",
    year: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: existingDoc, isLoading: isLoadingDoc } = useQuery({
    queryKey: ["admin-document", id],
    queryFn: () => fetchDocumentById(id as string),
    enabled: !!isEditing,
  });

  useEffect(() => {
    if (existingDoc) {
      setFormData({
        title: existingDoc.title,
        description: existingDoc.description ?? "",
        publishedAt: existingDoc.published_at
          ? existingDoc.published_at.split("T")[0]
          : new Date().toISOString().split("T")[0],
        isPublic: existingDoc.is_public,
        category: existingDoc.category ?? "",
        year: existingDoc.year?.toString() ?? "",
      });
    }
  }, [existingDoc]);

  const mutation = useMutation({
    mutationFn: async () => {
      let storageMeta = undefined;

      // Si hay archivo nuevo, subirlo
      if (file) {
        setIsUploading(true);
        try {
          storageMeta = await uploadDocumentFile(file);
        } finally {
          setIsUploading(false);
        }
      }

      return upsertDocument({
        id: isEditing ? id : undefined,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        publishedAt: formData.publishedAt || null,
        isPublic: formData.isPublic,
        category: formData.category.trim() || null,
        year: formData.year ? Number(formData.year) : null,
        storageMeta: storageMeta,
      });
    },
    onSuccess: (doc) => {
      queryClient.invalidateQueries({ queryKey: ["admin-documents"] });
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ["admin-document", id] });
      }

      toast({
        title: isEditing ? "Documento actualizado" : "Documento creado",
        description: isEditing
          ? "Los cambios han sido guardados correctamente."
          : "El documento ha sido publicado correctamente.",
      });

      navigate("/admin/documentos");
    },
    onError: (error: any) => {
      toast({
        title: "Error al guardar",
        description: error.message ?? "No se pudo guardar el documento.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.type !== "application/pdf") {
        toast({
          title: "Formato no válido",
          description: "Solo se admiten archivos PDF.",
          variant: "destructive",
        });
        return;
      }
      setFile(f);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "El título es obligatorio.",
        variant: "destructive",
      });
      return;
    }

    if (!isEditing && !file) {
      toast({
        title: "Archivo requerido",
        description: "Para crear un nuevo documento debes subir un PDF.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate();
  };

  const isSaving = mutation.isPending || isUploading;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/admin/documentos">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a documentos
          </Link>
        </Button>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
          {isEditing ? "Editar documento" : "Nuevo documento"}
        </h1>
      </div>

      <Card className="border-border max-w-3xl">
        <CardContent className="p-6">
          {isEditing && isLoadingDoc ? (
            <p>Cargando datos del documento…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Título del documento"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Breve descripción del documento..."
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field min-h-[100px]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="publishedAt">Fecha de publicación</Label>
                  <Input
                    id="publishedAt"
                    name="publishedAt"
                    type="date"
                    value={formData.publishedAt}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Año (opcional)</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    min="1900"
                    max="2100"
                    value={formData.year}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría (opcional)</Label>
                <Input
                  id="category"
                  name="category"
                  type="text"
                  placeholder="Ej: Boletín, Resolución, Revista..."
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Archivo PDF {isEditing ? "(opcional)" : "*"}</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="input-field"
                />
                <p className="text-xs text-muted-foreground">
                  {isEditing && existingDoc?.file_name
                    ? `Archivo actual: ${existingDoc.file_name}`
                    : "Selecciona un archivo PDF para subir al repositorio."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="isPublic"
                  name="isPublic"
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="isPublic" className="text-sm">
                  Documento público
                </Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    "Guardando..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? "Guardar cambios" : "Publicar documento"}
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/admin/documentos">Cancelar</Link>
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
