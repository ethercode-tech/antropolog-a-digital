import { Link } from "react-router-dom";
import {
  ArrowRight,
  ClipboardList,
  DollarSign,
  Receipt,
  Users,
  FileText,
  Mail,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NewsCard } from "@/components/ui/NewsCard";
import { getNews, mockNews } from "@/lib/dataAdapter";
import { useQuery } from "@tanstack/react-query";

const professionalShortcuts = [
  {
    title: "Solicitar matriculación",
    description: "Iniciá tu trámite de matriculación profesional en línea.",
    href: "/tramites/matriculacion",
    icon: ClipboardList,
    badge: "Trámite online",
  },
  {
    title: "Consultar estado de matriculación",
    description: "Revisá el estado de tu solicitud con tu DNI.",
    href: "/tramites/matriculacion#consultar",
    icon: FileText,
  },
  {
    title: "Consulta de deuda",
    description: "Verificá cuotas pendientes y tu situación de pago.",
    href: "/tramites/deuda",
    icon: DollarSign,
  },
  {
    title: "Descarga de factura",
    description: "Descargá la última factura emitida para tu matrícula.",
    href: "/tramites/facturas",
    icon: Receipt,
  },
  {
    title: "Padrón de matriculados",
    description: "Buscá profesionales habilitados por nombre o especialidad.",
    href: "/matriculados",
    icon: Users,
  },
];

const infoBlocks = [
  {
    icon: History,
    title: "Institución y normativa",
    description: "Historia del Colegio y marco normativo vigente.",
    href: "/historia",
  },
  {
    icon: FileText,
    title: "Noticias y comunicados",
    description: "Novedades, comunicados oficiales y actividades recientes.",
    href: "/noticias",
  },
  {
    icon: Mail,
    title: "Contacto institucional",
    description: "Canales oficiales para consultas y gestiones específicas.",
    href: "/contacto",
  },
];

export default function Index() {
  const {
    data: latestNews = [],
    isLoading: isLoadingNews,
    isError: isErrorNews,
  } = useQuery({
    queryKey: ["public-news-home"],
    queryFn: () => getNews(3),
  });

  return (
    <div className="animate-fade-in">
      {/* Hero funcional */}
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
      <section className="py-14 md:py-20 bg-primary/5">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
            <div className="space-y-2">
              <h2 className="section-title">Accesos directos para profesionales</h2>
              <p className="section-subtitle max-w-2xl">
                Ingresá rápidamente a los trámites y consultas más utilizados:
                matriculación, deuda, facturas y padrón público de matriculados.
              </p>
            </div>
            <Button asChild variant="outline" className="self-start md:self-auto">
              <Link to="/contacto">
                Necesito ayuda con un trámite
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {professionalShortcuts.map((item, index) => (
              <Link key={item.href} to={item.href} className="group">
                <Card
                  className="h-full border-primary/15 hover:border-primary/60 bg-card transition-colors card-hover"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <CardContent className="p-5 sm:p-6 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {item.badge && (
                      <p className="text-[11px] font-medium text-primary mt-1">
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

      {/* Información institucional y recursos */}
      <section className="py-14 md:py-20">
        <div className="container-main">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="section-title">Información institucional y recursos</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Documentación institucional, noticias y canales de contacto para
              acompañar el ejercicio profesional y la vida colegiada.
            </p>
          </div>

          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {infoBlocks.map((block, index) => (
              <Link key={block.href} to={block.href} className="group">
                <Card
                  className="h-full border-border bg-card hover:border-primary/40 transition-colors card-hover"
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  <CardContent className="p-5 sm:p-6">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <block.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <h3 className="font-serif font-semibold text-foreground mb-2 text-base sm:text-lg">
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

      {/* Últimas noticias */}
      <section className="py-14 md:py-20 bg-secondary/60">
        <div className="container-main">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="section-title mb-2">Novedades institucionales</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                Información relevante sobre actividades, comunicados y agenda del
                Colegio de Antropología.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/noticias">
                Ver todas las noticias
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Loading */}
          {isLoadingNews && (
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-xl bg-muted/60 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {isErrorNews && !isLoadingNews && (
            <p className="text-sm text-red-500">
              Ocurrió un problema al cargar las noticias. Intente nuevamente más tarde.
            </p>
          )}

          {/* Noticias reales */}
          {!isLoadingNews && !isErrorNews && latestNews.length > 0 && (
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestNews.map((news, index) => (
                <div
                  key={news.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <NewsCard news={news} />
                </div>
              ))}
            </div>
          )}

          {/* Sin noticias */}
          {!isLoadingNews && !isErrorNews && latestNews.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Todavía no hay noticias publicadas en el portal.
            </p>
          )}
        </div>
      </section>


      {/* CTA final */}
      <section className="py-14 md:py-20">
        <div className="container-main">
          <Card className="bg-[#5A3E2B] text-white overflow-hidden">
            <CardContent className="p-7 sm:p-8 md:p-10 text-center space-y-4 md:space-y-6">

              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold">
                ¿Necesitás gestionar tu situación como profesional?
              </h2>

              <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
                Iniciá tu matriculación, consultá tu deuda y descargá tu última factura
                desde el portal de trámites en línea, sin desplazarte y con soporte institucional cuando lo necesites.
              </p>

              <div className="flex flex-wrap justify-center gap-3">

                {/* Botón principal que contrasta */}
                <Button
                  asChild
                  size="lg"
                  className="bg-[#F2E6D8] text-[#5A3E2B] font-semibold hover:bg-[#e8d9c8]"
                >
                  <Link to="/tramites/matriculacion">
                    Trámite de matriculación
                  </Link>
                </Button>

                {/* Botón secundario outline, visible sobre marrón */}
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-black hover:bg-white/10"
                >
                  <Link to="/tramites/deuda">
                    Consulta de deuda y facturas
                  </Link>
                </Button>

              </div>

            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
}
