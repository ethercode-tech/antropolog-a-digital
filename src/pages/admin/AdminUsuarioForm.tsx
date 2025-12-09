import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { mockAdminUsers } from "@/lib/dataAdapter";

export default function AdminUsuarioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const existingUser = isEditing ? mockAdminUsers.find(u => u.id === id) : null;

  const [formData, setFormData] = useState({
    nombre: existingUser?.nombre || "",
    email: existingUser?.email || "",
    password: "",
    confirmPassword: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete nombre y email",
        variant: "destructive"
      });
      return;
    }

    if (!isEditing && !formData.password) {
      toast({
        title: "Contraseña requerida",
        description: "Por favor ingrese una contraseña para el nuevo usuario",
        variant: "destructive"
      });
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Por favor verifique que las contraseñas sean iguales",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: isEditing ? "Usuario actualizado" : "Usuario creado",
      description: isEditing 
        ? "Los datos del usuario han sido actualizados" 
        : "El nuevo usuario administrador ha sido creado"
    });
    
    navigate("/admin/usuarios");
  };

  return (
    <div className="animate-fade-in">
      <Link 
        to="/admin/usuarios"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a usuarios
      </Link>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="font-serif">
            {isEditing ? "Editar Usuario" : "Nuevo Usuario Administrador"}
          </CardTitle>
          <CardDescription>
            {isEditing 
              ? "Modifique los datos del usuario administrador"
              : "Complete los datos para crear un nuevo usuario administrador"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo *</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre del administrador"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {isEditing ? "Nueva contraseña (dejar vacío para mantener)" : "Contraseña *"}
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Guardando..." : "Guardar Usuario"}
              </Button>
              <Link to="/admin/usuarios">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
