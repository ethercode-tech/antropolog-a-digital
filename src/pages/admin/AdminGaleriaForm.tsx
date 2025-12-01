import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { mockGalleryImages } from "@/data/mockData";

export default function AdminGaleriaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = id && id !== "nueva";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: "",
    altText: "",
    position: mockGalleryImages.length + 1,
  });

  useEffect(() => {
    if (isEditing) {
      const image = mockGalleryImages.find((img) => img.id === id);
      if (image) {
        setFormData({
          imageUrl: image.imageUrl,
          altText: image.altText,
          position: image.position,
        });
      }
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.imageUrl.trim() || !formData.altText.trim()) {
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
      title: isEditing ? "Imagen actualizada" : "Imagen agregada",
      description: isEditing 
        ? "Los cambios han sido guardados correctamente."
        : "La imagen ha sido agregada a la galería.",
    });

    navigate("/admin/galeria");
  };

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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL de la imagen *</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.imageUrl}
                onChange={handleChange}
                className="input-field"
                required
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
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
        </CardContent>
      </Card>
    </div>
  );
}
