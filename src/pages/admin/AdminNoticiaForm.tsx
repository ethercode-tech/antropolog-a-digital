import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { mockNews } from "@/lib/dataAdapter";

export default function AdminNoticiaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = id && id !== "nueva";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    publishedAt: new Date().toISOString().split("T")[0],
    imageUrl: "",
  });

  useEffect(() => {
    if (isEditing) {
      const news = mockNews.find((n) => n.id === id);
      if (news) {
        setFormData({
          title: news.title,
          content: news.content,
          publishedAt: news.publishedAt,
          imageUrl: news.imageUrl || "",
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

    if (!formData.title.trim() || !formData.content.trim() || !formData.publishedAt) {
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
      title: isEditing ? "Noticia actualizada" : "Noticia creada",
      description: isEditing 
        ? "Los cambios han sido guardados correctamente."
        : "La noticia ha sido publicada correctamente.",
    });

    navigate("/admin/noticias");
  };

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
                className="input-field"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishedAt">Fecha de publicación *</Label>
              <Input
                id="publishedAt"
                name="publishedAt"
                type="date"
                value={formData.publishedAt}
                onChange={handleChange}
                className="input-field"
                required
              />
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
                className="input-field"
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
                className="input-field min-h-[300px]"
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
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
