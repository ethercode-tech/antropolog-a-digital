import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { News } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NewsCardProps {
  news: News;
  featured?: boolean;
}

export function NewsCard({ news, featured = false }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (featured) {
    return (
      <Card className="overflow-hidden card-hover border-border bg-card">
        <div className="grid md:grid-cols-2 gap-0">
          {news.imageUrl && (
            <div className="aspect-video md:aspect-auto md:h-full">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardContent className={`p-6 md:p-8 flex flex-col justify-center ${!news.imageUrl ? 'md:col-span-2' : ''}`}>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
              <Calendar className="w-4 h-4" />
              <time dateTime={news.publishedAt}>{formatDate(news.publishedAt)}</time>
            </div>
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-3 line-clamp-2">
              {news.title}
            </h3>
            <p className="text-muted-foreground mb-4 line-clamp-3">{news.excerpt}</p>
            <Button asChild variant="default" className="w-fit">
              <Link to={`/noticias/${news.id}`}>
                Ver más <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden card-hover border-border bg-card h-full flex flex-col">
      {news.imageUrl && (
        <div className="aspect-video">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <Calendar className="w-4 h-4" />
          <time dateTime={news.publishedAt}>{formatDate(news.publishedAt)}</time>
        </div>
        <h3 className="font-serif text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {news.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">{news.excerpt}</p>
        <Link
          to={`/noticias/${news.id}`}
          className="text-primary font-medium text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
        >
          Ver noticia <ArrowRight className="w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
