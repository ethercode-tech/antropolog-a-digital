import { Instagram } from "lucide-react";
import { useState } from "react";
// Agregamos MessageCircle a los imports
import { Mail, Phone, MapPin, Send, MessageCircle, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createContactMessage } from "@/lib/contactApi";

export default function Contacto() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  // Configuración de WhatsApp
  const whatsappNumber = "543883290858"; // Formato internacional sin símbolos
  const whatsappMessage = encodeURIComponent("Hola, me comunico desde la web oficial del Colegio. Quisiera realizar una consulta.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nombre.trim() ||
      !formData.email.trim() ||
      !formData.mensaje.trim()
    ) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un correo electrónico válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createContactMessage({
        full_name: formData.nombre,
        email: formData.email,
        message: formData.mensaje,
        source_page: "/contacto",
      });

      toast({
        title: "Mensaje enviado",
        description:
          "Tu mensaje fue enviado correctamente. Nos comunicaremos a la brevedad.",
      });

      setFormData({ nombre: "", email: "", mensaje: "" });
    } catch (error: any) {
      toast({
        title: "Error al enviar",
        description:
          error?.message ??
          "Ocurrió un problema al enviar el mensaje. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">
            Solicitudes y contacto
          </h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Canal institucional de contacto para consultas, solicitudes y
            comunicaciones formales con el Colegio.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Información institucional */}
            <div className="animate-fade-in-up">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                Información de contacto
              </h2>

              <p className="text-muted-foreground mb-8 leading-relaxed">
                Atención de lunes a viernes de 8:00 a 13:00 horas.
              </p>

              <div className="space-y-8">
                {/* Dirección */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Dirección</h3>
                    <p className="text-muted-foreground">
                      Otero 25, 1.º piso <br />
                      San Salvador de Jujuy (CP 4600)
                    </p>
                  </div>
                </div>

                {/* Teléfono y WhatsApp */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-primary/20">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Contacto Directo</h3>
                    <p className="text-muted-foreground mb-2">+54 388 329-0858</p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-all border-b border-primary/20 hover:border-primary pb-0.5"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Escribinos por WhatsApp
                    </a>
                  </div>
                </div>

                {/* Instagram - NUEVO ITEM */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-primary/20">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Redes Sociales</h3>
                    <p className="text-muted-foreground mb-2">Seguí nuestras novedades</p>
                    <a
                      href="https://www.instagram.com/cole.giodeantropologiajujuy/?hl=en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-all border-b border-primary/20 hover:border-primary pb-0.5"
                    >
                      <span className="mr-2">@colegioantropologosjujuy</span>
                    </a>
                  </div>
                </div>

                {/* Correo */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Correo electrónico</h3>
                    <p className="text-muted-foreground">
                      colegioantropologjujuy@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <Card className="border-border bg-card">
                <CardContent className="p-6 md:p-8">
                  <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                    Enviar un mensaje
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        placeholder="Tu nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensaje">Mensaje</Label>
                      <Textarea
                        id="mensaje"
                        name="mensaje"
                        placeholder="Escribe tu mensaje aquí..."
                        value={formData.mensaje}
                        onChange={handleChange}
                        className="input-field min-h-[150px]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Enviando..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar mensaje
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}