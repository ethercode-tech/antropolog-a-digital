import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, FileText, Image, Mail, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NewsCard } from "@/components/ui/NewsCard";
import { mockNews } from "@/data/mockData";

const features = [
  { icon: History, title: "Historia", description: "Conoce nuestra trayectoria", href: "/historia" },
  { icon: BookOpen, title: "Servicios", description: "Áreas de trabajo profesional", href: "/servicios" },
  { icon: FileText, title: "Noticias", description: "Actualidad institucional", href: "/noticias" },
  { icon: Users, title: "Publicaciones", description: "Documentos y revistas", href: "/publicaciones" },
  { icon: Image, title: "Galería", description: "Registro fotográfico", href: "/galeria" },
  { icon: Mail, title: "Contacto", description: "Comunícate con nosotros", href: "/contacto" },
];

export default function Index() {
  const latestNews = mockNews.slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-[image:var(--hero-gradient)] py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-in-up">
              Colegio de Antropología
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Institución que agrupa a los profesionales de la antropología, promoviendo el ejercicio ético, la formación continua y el desarrollo de la disciplina al servicio de la sociedad.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <Link to="/historia">
                  Conocer más <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/contacto">Contactar</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="section-title">Explora el Colegio</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Descubre todo lo que ofrecemos a nuestros colegiados y a la comunidad académica.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map((feature, index) => (
              <Link key={feature.href} to={feature.href} className="group">
                <Card 
                  className="h-full card-hover border-border bg-card text-center p-4 md:p-6"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-0">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-serif font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-xs md:text-sm hidden md:block">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container-main">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h2 className="section-title mb-2">Últimas Noticias</h2>
              <p className="text-muted-foreground">Mantente informado sobre las actividades del Colegio.</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/noticias">
                Ver todas <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((news, index) => (
              <div key={news.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <NewsCard news={news} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <Card className="bg-accent text-accent-foreground overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                ¿Eres antropólogo profesional?
              </h2>
              <p className="text-accent-foreground/80 mb-6 max-w-2xl mx-auto">
                Únete al Colegio de Antropología y forma parte de la comunidad profesional más importante del país. Accede a beneficios exclusivos, formación continua y respaldo institucional.
              </p>
              <Button asChild size="lg" className="bg-primary-foreground text-accent hover:bg-primary-foreground/90">
                <Link to="/contacto">Contáctanos para más información</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
