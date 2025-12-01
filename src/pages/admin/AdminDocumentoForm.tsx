import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { mockDocuments } from "@/data/mockData";

export default function AdminDocumentoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = id && id !== "nuevo";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    publishedAt: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (isEditing) {
      const doc = mockDocuments.find((d) => d.id === id);
      if (doc) {
        setFormData({
          title: doc.title,
          description: doc.description,
          fileUrl: doc.fileUrl,
          publishedAt: doc.publishedAt,
        });
      }
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.fileUrl.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: isEditing ? "Documento actualizado" : "Documento creado",
      description: isEditing 
        ? "Los cambios han sido guardados correctamente."
        : "El documento ha sido publicado correctamente.",
    });

    navigate("/admin/documentos");
  };

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

            <div className="space-y-2">
              <Label htmlFor="fileUrl">URL del PDF *</Label>
              <Input
                id="fileUrl"
                name="fileUrl"
                type="url"
                placeholder="https://ejemplo.com/documento.pdf"
                value={formData.fileUrl}
                onChange={handleChange}
                className="input-field"
                required
              />
              <p className="text-xs text-muted-foreground">
                Ingresa la URL donde está alojado el archivo PDF.
              </p>
            </div>

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

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
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
        </CardContent>
      </Card>
    </div>
  );
}
