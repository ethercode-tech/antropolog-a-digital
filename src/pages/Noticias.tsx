// src/pages/Noticias.tsx
import { useQuery } from "@tanstack/react-query";
import { NewsCard } from "@/components/ui/NewsCard";
import { supabase } from "@/integrations/supabase/client";
import type { NewsItem } from "@/lib/types/news";
import { mapRowToNewsItem } from "@/lib/types/news";

async function fetchPublicNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select("id, title, slug, excerpt, content, image_url, published_at, is_published")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[Noticias] fetchPublicNews error:", error);
    throw new Error("No se pudieron cargar las noticias");
  }

  return (data ?? []).map(mapRowToNewsItem);
}

export default function Noticias() {
  const {
    data: news = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["public-news"],
    queryFn: fetchPublicNews,
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container-main">
          <h1 className="section-title text-center">Noticias</h1>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            Mantente informado sobre las últimas actividades, eventos y comunicados del Colegio de Antropología.
          </p>
        </div>
      </section>

      {/* News List */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          {isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              Cargando noticias…
            </div>
          )}

          {isError && (
            <div className="text-center py-12 text-red-500">
              {(error as Error)?.message || "No se pudieron cargar las noticias."}
            </div>
          )}

          {!isLoading && !isError && news.length > 0 && (
            <>
              {/* Featured News */}
              <div className="mb-10">
                <NewsCard news={news[0]} featured />
              </div>

              {/* News Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.slice(1).map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <NewsCard news={item} />
                  </div>
                ))}
              </div>
            </>
          )}

          {!isLoading && !isError && news.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No hay noticias disponibles en este momento.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
