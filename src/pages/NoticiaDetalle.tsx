// src/pages/NoticiaDetalle.tsx
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { NewsItem } from "@/lib/types/news";
import { mapRowToNewsItem } from "@/lib/types/news";

async function fetchNewsById(id: string): Promise<NewsItem | null> {
  const { data, error } = await supabase
    .from("news")
    .select("id, title, slug, excerpt, content, image_url, published_at, is_published")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[NoticiaDetalle] fetchNewsById error:", error);
    throw new Error("No se pudo cargar la noticia");
  }

  if (!data) return null;
  return mapRowToNewsItem(data);
}

export default function NoticiaDetalle() {
  const { id } = useParams<{ id: string }>();

  const {
    data: news,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["news-detail", id],
    queryFn: () => fetchNewsById(id || ""),
    enabled: !!id,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="container-main py-24 text-center text-muted-foreground">
        Cargando noticia…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-main py-24 text-center">
        <h1 className="section-title">Error al cargar la noticia</h1>
        <p className="text-muted-foreground mb-6">
          {(error as Error)?.message || "Intenta nuevamente en unos minutos."}
        </p>
        <Button asChild>
          <Link to="/noticias">Volver a noticias</Link>
        </Button>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container-main py-24 text-center">
        <h1 className="section-title">Noticia no encontrada</h1>
        <p className="text-muted-foreground mb-6">
          La noticia que buscas no existe o ha sido eliminada.
        </p>
        <Button asChild>
          <Link to="/noticias">Volver a noticias</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header simple con back */}
      <section className="bg-secondary py-8">
        <div className="container-main">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/noticias">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a noticias
            </Link>
          </Button>
        </div>
      </section>

      {/* Article */}
      <article className="py-12 md:py-16">
        <div className="container-main">
          <div className="max-w-3xl mx-auto">
            {/* Meta */}
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              <time dateTime={news.publishedAt}>
                {formatDate(news.publishedAt)}
              </time>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {news.title}
            </h1>

            {/* Image */}
            {news.imageUrl && (
              <div className="aspect-video rounded-lg overflow-hidden mb-8">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {news.content
                .split("\n\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-foreground/80 leading-relaxed mb-4"
                  >
                    {paragraph}
                  </p>
                ))}
            </div>

            {/* Back button */}
            <div className="mt-12 pt-8 border-t border-border">
              <Button asChild variant="outline">
                <Link to="/noticias">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a noticias
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
