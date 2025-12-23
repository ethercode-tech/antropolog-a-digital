// src/lib/galleryApi.ts
import { supabase } from "@/integrations/supabase/client";

export type GalleryImageRecord = {
  id: string;
  bucket_id: string;
  storage_path: string;
  public_url: string | null;
  alt_text: string | null;
  category: string | null;
  order_index: number | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

const TABLE = "gallery_images";
const BUCKET = "galeria";

export async function fetchAdminGalleryImages(): Promise<GalleryImageRecord[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("order_index", { ascending: true, nullsFirst: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as GalleryImageRecord[];
}

export async function fetchPublicGalleryImages(): Promise<GalleryImageRecord[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("is_public", true)
    .order("order_index", { ascending: true, nullsFirst: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as GalleryImageRecord[];
}

export async function fetchGalleryImageById(
  id: string
): Promise<GalleryImageRecord | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as GalleryImageRecord;
}

export async function uploadGalleryImage(file: File) {
  const timestamp = Date.now();
  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const path = `${timestamp}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return {
    storage_path: path,
    public_url: publicData.publicUrl,
  };
}

type UpsertPayload = {
  id?: string;
  altText: string;
  orderIndex?: number | null;
  category?: string | null;
  isPublic?: boolean;
  storageMeta?: {
    storage_path: string;
    public_url: string | null;
  };
};

export async function upsertGalleryImage(payload: UpsertPayload) {
  const {
    id,
    altText,
    orderIndex = null,
    category = null,
    isPublic = true,
    storageMeta,
  } = payload;

  const base: any = {
    alt_text: altText.trim(),
    order_index: orderIndex,
    category,
    is_public: isPublic,
  };

  if (storageMeta) {
    base.bucket_id = BUCKET;
    base.storage_path = storageMeta.storage_path;
    base.public_url = storageMeta.public_url;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      id
        ? { id, ...base }
        : base,
      {
        onConflict: "id",
      }
    )
    .select("*")
    .single();

  if (error) throw error;
  return data as GalleryImageRecord;
}

export async function deleteGalleryImage(image: GalleryImageRecord) {
  // Primero borramos el archivo del storage
  if (image.storage_path) {
    const { error: storageError } = await supabase.storage
      .from(image.bucket_id || BUCKET)
      .remove([image.storage_path]);

    // Si falla el storage, igual intentamos borrar el registro
    if (storageError) {
      console.error("Error eliminando archivo de storage:", storageError);
    }
  }

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", image.id);

  if (error) throw error;
}
