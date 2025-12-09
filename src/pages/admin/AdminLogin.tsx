// src/pages/admin/AdminLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error || !data.session) {
        throw new Error(error?.message || "Credenciales inválidas");
      }

      // El SDK ya guarda el session en localStorage por defecto.
      // Acá podés marcar "adminAuth" solo como flag del panel.
      localStorage.setItem("adminAuth", "true");

      toast({
        title: "Bienvenido",
        description: "Has iniciado sesión correctamente.",
      });

      navigate("/admin");
    } catch (err: any) {
      toast({
        title: "Error de autenticación",
        description: err.message || "No se pudo iniciar sesión.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Panel Administrativo
          </h1>
          <p className="text-muted-foreground mt-1">Colegio de Antropología</p>
        </div>

        {/* Login Card */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <h2 className="font-serif text-xl font-semibold text-center">
              Iniciar sesión
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Ingresando..." : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Ingresar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Volver al sitio público
          </a>
        </div>
      </div>
    </div>
  );
}
