import { Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardList,
  DollarSign,
  Receipt,
  Award,
  Users,
  FileText,
  Mail,
  History,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NewsCard } from "@/components/ui/NewsCard";
import { mockNews } from "@/data/mockData";

const professionalShortcuts = [
  {
    title: "Solicitar matriculación",
    description: "Inicie su trámite de matriculación profesional en línea.",
    href: "/tramites/matriculacion",
    icon: ClipboardList,
    badge: "Trámite online",
  },
  {
    title: "Consultar estado de matriculación",
    description: "Revise el estado de su solicitud con su DNI.",
    href: "/tramites/matriculacion#consultar",
    icon: FileText,
  },
  {
    title: "Consulta de deuda",
    description: "Verifique cuotas pendientes y situación de pago.",
    href: "/tramites/deuda",
    icon: DollarSign,
  },
  {
    title: "Descarga de facturas",
    description: "Acceda al historial de facturación y comprobantes.",
    href: "/tramites/facturas",
    icon: Receipt,
  },
  // {
  //   title: "Tramitar constancia",
  //   description: "Solicite constancias de matrícula y habilitación.",
  //   href: "/tramites/constancia",
  //   icon: Award,
  // },
  {
    title: "Padrón de matriculados",
    description: "Busque profesionales habilitados por nombre o especialidad.",
    href: "/matriculados",
    icon: Users,
  },
];

const infoBlocks = [
  {
    icon: History,
    title: "Institución y normativa",
    description: "Conozca la historia del Colegio y el marco normativo vigente.",
    href: "/historia",
  },
  {
    icon: BookOpen,
    title: "Áreas y servicios",
    description: "Descubra las áreas de trabajo y servicios para profesionales.",
    href: "/servicios",
  },
  {
    icon: FileText,
    title: "Publicaciones",
    description: "Acceso a documentos, resoluciones y material de consulta.",
    href: "/publicaciones",
  },
  {
    icon: Mail,
    title: "Contacto institucional",
    description: "Canales oficiales para consultas y gestiones específicas.",
    href: "/contacto",
  },
];

export default function Index() {
  const latestNews = mockNews.slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero Section funcional */}
      <section className="relative bg-[image:var(--hero-gradient)] py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&h=1080&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-in-up">
              Portal de servicios del Colegio de Antropología
            </h1>
            <p
              className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Acceso centralizado a trámites en línea, padrón de profesionales,
              constancias, facturación y gestiones institucionales. Diseñado para
              que los matriculados encuentren todo en un solo lugar.
            </p>
            <div
              className="flex flex-wrap gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <Link to="/tramites/matriculacion">
                  Iniciar trámite de matriculación
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/tramites/deuda">Consultar deuda y facturas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Accesos directos para profesionales */}
      <section className="py-16 md:py-24 bg-primary/5">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <h2 className="section-title mb-2">Accesos directos para profesionales</h2>
              <p className="section-subtitle max-w-2xl">
                Ingrese rápidamente a los trámites y consultas más frecuentes:
                matriculación, deudas, facturación, constancias y padrón público.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/servicios">
                Ver todos los trámites
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {professionalShortcuts.map((item, index) => (
              <Link key={item.href} to={item.href} className="group">
                <Card
                  className="h-full card-hover border-primary/20 hover:border-primary/50 bg-card"
                  style={{ animationDelay: `${index * 0.07}s` }}
                >
                  <CardContent className="p-6 md:p-7 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {item.badge && (
                      <p className="text-xs font-medium text-primary mt-1">
                        {item.badge}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bloques informativos institucionales */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="section-title">Información institucional y recursos</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Además de los trámites, el Colegio ofrece marco institucional, normativa,
              publicaciones y canales de contacto para acompañar el ejercicio profesional.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {infoBlocks.map((block, index) => (
              <Link key={block.href} to={block.href} className="group">
                <Card
                  className="h-full card-hover border-border bg-card"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <block.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-serif font-semibold text-foreground mb-2">
                      {block.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {block.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Últimas noticias, pero como complemento, no protagonista */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container-main">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="section-title mb-2">Novedades institucionales</h2>
              <p className="text-muted-foreground max-w-xl">
                Información relevante sobre actividades, comunicados y agenda del Colegio.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/noticias">
                Ver todas las noticias
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((news, index) => (
              <div
                key={news.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <NewsCard news={news} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final orientada a acción concreta */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <Card className="bg-accent text-accent-foreground overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4">
                ¿Necesitás gestionar tu situación como profesional?
              </h2>
              <p className="text-accent-foreground/80 mb-6 max-w-2xl mx-auto">
                Iniciá tu matriculación, regularizá tu situación de pago o solicitá
                constancias oficiales desde el portal de trámites en línea.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="bg-primary-foreground text-accent hover:bg-primary-foreground/90">
                  <Link to="/tramites/matriculacion">Trámite de matriculación</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/tramites/deuda">Consulta de deuda y facturas</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
