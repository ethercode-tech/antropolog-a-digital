import { NewsCard } from "@/components/ui/NewsCard";
import { mockNews } from "@/lib/dataAdapter";

export default function Noticias() {
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
          {/* Featured News */}
          {mockNews.length > 0 && (
            <div className="mb-10">
              <NewsCard news={mockNews[0]} featured />
            </div>
          )}

          {/* News Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockNews.slice(1).map((news, index) => (
              <div 
                key={news.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <NewsCard news={news} />
              </div>
            ))}
          </div>

          {mockNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay noticias disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
