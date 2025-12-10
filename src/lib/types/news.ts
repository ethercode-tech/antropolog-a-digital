// src/lib/types/news.ts
export type NewsItem = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageUrl: string | null;
    publishedAt: string; // ISO string
    isPublished: boolean;
  };
  
  export function mapRowToNewsItem(row: any): NewsItem {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt:
        row.excerpt ??
        (row.content ? row.content.replace(/\s+/g, " ").slice(0, 200) + "…" : ""),
      content: row.content ?? "",
      imageUrl: row.image_url ?? null,
      publishedAt: row.published_at ?? row.created_at,
      isPublished: row.is_published,
    };
  }
  