// src/lib/dataAdapter.ts
// Adapter que centraliza acceso a datos usando Supabase

import { supabase } from "@/integrations/supabase/client";

// Tipos
export type EstadoSolicitud = "pendiente" | "en_revision" | "observado" | "aprobado" | "rechazado";
export type EstadoDeuda = "pagado" | "pendiente";

export type News = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  imageUrl?: string;
};

export type DocumentT = {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  publishedAt: string;
};

export type GalleryImage = {
  id: string;
  imageUrl: string;
  altText: string;
  position: number;
};

export type ProfesionalPublico = {
  id: string;
  nombre: string;
  matricula: string;
  tipo: "Licenciado" | "Técnico / Otro";
  especialidad: string;
  lugarTrabajo: string;
  estadoMatricula: "Activa" | "Inactiva" | "En revisión";
  email?: string;
  telefono?: string;
  cvPdfUrl?: string;
};

export type MatriculacionSolicitudPublica = {
  id: string;
  nombre: string;
  dni: string;
  email: string;
  telefono: string;
  especialidad: string;
  estado: EstadoSolicitud;
  observaciones?: string;
  numeroMatriculaAsignado?: string;
  documentos?: { url: string; nombre?: string; tipo?: string }[];
  creadoEn: string;
};

export type Deuda = {
  id: string;
  profesionalId: string;
  periodo: string;
  concepto: string;
  monto: number;
  estado: EstadoDeuda;
  fechaVencimiento?: string;
  fechaPago?: string;
};

export type Factura = {
  id: string;
  profesionalId: string;
  numero: string;
  periodo: string;
  concepto: string;
  importe: number;
  estado: string;
  urlPdf?: string;
  fechaEmision: string;
};

// -----------------------------
// IMPORTS ESTÁTICOS de mocks (funciona en browser y dev)
// -----------------------------
import * as md from "../../dev-only/data/mockData";
import * as pd from "../../dev-only/data/profesionalesData";

// Re-exports síncronos (compatibilidad con componentes existentes que usan mocks)
export const mockNews = md.mockNews ?? [];
export const mockDocuments = md.mockDocuments ?? [];
export const mockGalleryImages = md.mockGalleryImages ?? [];
export const usefulLinks = md.usefulLinks ?? [];

export const mockProfesionales = pd.mockProfesionales ?? [];
export const mockMatriculacionSolicitudes = pd.mockMatriculacionSolicitudes ?? [];
export const mockDeudas = pd.mockDeudas ?? [];
export const mockConstanciaSolicitudes = pd.mockConstanciaSolicitudes ?? [];
export const mockFacturas = pd.mockFacturas ?? [];
export const mockAdminUsers = pd.mockAdminUsers ?? [];

// -----------------------------
// Funciones de acceso a Supabase
// -----------------------------

// Mapea el tipo de la DB a lo que espera la UI pública
function mapTipoToUI(tipo: string): "Licenciado" | "Técnico / Otro" {
  return tipo === "licenciado" ? "Licenciado" : "Técnico / Otro";
}

function mapEstadoMatriculaToUI(estado: string): "Activa" | "Inactiva" | "En revisión" {
  switch (estado) {
    case "activa": return "Activa";
    case "inactiva": return "Inactiva";
    case "en_revision": return "En revisión";
    case "suspendida": return "Inactiva";
    default: return "Activa";
  }
}

export async function getProfesionales(): Promise<ProfesionalPublico[]> {
  const { data, error } = await supabase
    .from("profesionales")
    .select("*")
    .eq("habilitado_ejercer", true)
    .order("apellido", { ascending: true });

  if (error) {
    console.error("Error fetching profesionales:", error);
    return [];
  }

  return (data ?? []).map((p) => ({
    id: p.id,
    nombre: `${p.nombre} ${p.apellido}`,
    matricula: p.matricula,
    tipo: mapTipoToUI(p.tipo),
    especialidad: p.especialidad_principal,
    lugarTrabajo: p.lugar_trabajo || p.localidad || "",
    estadoMatricula: mapEstadoMatriculaToUI(p.estado_matricula),
    email: p.email || undefined,
    telefono: p.telefono || undefined,
    cvPdfUrl: p.cv_pdf_url || undefined,
  }));
}

export async function getProfesionalById(id: string): Promise<ProfesionalPublico | null> {
  const { data, error } = await supabase
    .from("profesionales")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    console.error("Error fetching profesional:", error);
    return null;
  }

  return {
    id: data.id,
    nombre: `${data.nombre} ${data.apellido}`,
    matricula: data.matricula,
    tipo: mapTipoToUI(data.tipo),
    especialidad: data.especialidad_principal,
    lugarTrabajo: data.lugar_trabajo || data.localidad || "",
    estadoMatricula: mapEstadoMatriculaToUI(data.estado_matricula),
    email: data.email || undefined,
    telefono: data.telefono || undefined,
    cvPdfUrl: data.cv_pdf_url || undefined,
  };
}

// Buscar profesional por DNI y Matrícula (para trámites públicos)
export async function getProfesionalByDniMatricula(
  dni: string, 
  matricula: string
): Promise<ProfesionalPublico | null> {
  // Como no hay campo DNI en profesionales, buscamos por matrícula
  // y validamos que el profesional existe
  const { data, error } = await supabase
    .from("profesionales")
    .select("*")
    .eq("matricula", matricula)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    nombre: `${data.nombre} ${data.apellido}`,
    matricula: data.matricula,
    tipo: mapTipoToUI(data.tipo),
    especialidad: data.especialidad_principal,
    lugarTrabajo: data.lugar_trabajo || data.localidad || "",
    estadoMatricula: mapEstadoMatriculaToUI(data.estado_matricula),
    email: data.email || undefined,
    telefono: data.telefono || undefined,
    cvPdfUrl: data.cv_pdf_url || undefined,
  };
}

// Obtener deudas de un profesional
export async function getDeudasByProfesional(profesionalId: string): Promise<Deuda[]> {
  const { data, error } = await supabase
    .from("profesional_deudas")
    .select("*")
    .eq("profesional_id", profesionalId)
    .order("periodo", { ascending: false });

  if (error) {
    console.error("Error fetching deudas:", error);
    return [];
  }

  return (data ?? []).map((d) => ({
    id: d.id,
    profesionalId: d.profesional_id,
    periodo: d.periodo,
    concepto: d.concepto,
    monto: Number(d.monto),
    estado: d.estado as EstadoDeuda,
    fechaVencimiento: d.fecha_vencimiento || undefined,
    fechaPago: d.fecha_pago || undefined,
  }));
}

// Obtener facturas de un profesional
export async function getFacturasByProfesional(profesionalId: string): Promise<Factura[]> {
  const { data, error } = await supabase
    .from("profesional_facturas")
    .select("*")
    .eq("profesional_id", profesionalId)
    .order("fecha_emision", { ascending: false });

  if (error) {
    console.error("Error fetching facturas:", error);
    return [];
  }

  return (data ?? []).map((f) => ({
    id: f.id,
    profesionalId: f.profesional_id,
    numero: f.numero,
    periodo: f.periodo || "",
    concepto: f.concepto,
    importe: Number(f.importe),
    estado: f.estado,
    urlPdf: f.url_pdf || undefined,
    fechaEmision: f.fecha_emision,
  }));
}

// Obtener solicitud de matriculación por DNI
export async function getMatriculacionByDni(dni: string): Promise<MatriculacionSolicitudPublica | null> {
  const { data, error } = await supabase
    .from("profesional_matriculacion_solicitudes")
    .select("*")
    .eq("dni", dni)
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    nombre: data.nombre,
    dni: data.dni,
    email: data.email,
    telefono: data.telefono,
    especialidad: data.especialidad,
    estado: data.estado as EstadoSolicitud,
    observaciones: data.observaciones || undefined,
    numeroMatriculaAsignado: data.numero_matricula_asignado || undefined,
    documentos: data.documentos as any || undefined,
    creadoEn: data.creado_en,
  };
}

// Crear nueva solicitud de matriculación
export async function createMatriculacionSolicitud(solicitud: {
  nombre: string;
  dni: string;
  email: string;
  telefono: string;
  especialidad: string;
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("profesional_matriculacion_solicitudes")
    .insert({
      nombre: solicitud.nombre,
      dni: solicitud.dni,
      email: solicitud.email,
      telefono: solicitud.telefono,
      especialidad: solicitud.especialidad,
      estado: "pendiente",
    });

  if (error) {
    console.error("Error creating matriculacion:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}


export async function getUltimaFacturaPorMatricula(
  matricula: string
): Promise<
  | { profesional: ProfesionalPublico; factura: Factura | null }
  | null
> {
  // Buscar profesional por matrícula
  const { data: prof, error: errProf } = await supabase
    .from("profesionales")
    .select("id, nombre, apellido, matricula")
    .ilike("matricula", matricula)
    .maybeSingle();

  if (errProf) {
    console.error("[getUltimaFacturaPorMatricula] error profesional:", errProf);
    return null;
  }

  if (!prof) return null;

  const profesional: ProfesionalPublico = {
    id: prof.id,
    nombre: prof.apellido && prof.nombre ? `${prof.apellido}, ${prof.nombre}` : (prof.nombre ?? ""),
    matricula: prof.matricula,
    tipo: "Licenciado",
    especialidad: "",
    lugarTrabajo: "",
    estadoMatricula: "Activa"
  };

  // Última factura
  const { data: facturaRow, error: errFact } = await supabase
    .from("profesional_facturas")
    .select("id, numero, fecha_emision, periodo, importe, url_pdf")
    .eq("profesional_id", prof.id)
    .order("fecha_emision", { ascending: false })
    .order("creado_en", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errFact) {
    console.error("[getUltimaFacturaPorMatricula] error factura:", errFact);
    return { profesional, factura: null };
  }

  if (!facturaRow) {
    return { profesional, factura: null };
  }

  const factura: Factura = {
    id: facturaRow.id,
    numero: facturaRow.numero,
    fechaEmision: facturaRow.fecha_emision,
    periodo: facturaRow.periodo,
    importe: Number(facturaRow.importe),
    urlPdf: facturaRow.url_pdf,
    profesionalId: "",
    concepto: "",
    estado: ""
  };

  return { profesional, factura };
}

// -----------------------------
// News, Documents, Gallery (mantener mocks por ahora)
// -----------------------------
export async function getNews(limit?: number): Promise<News[]> {
  let query = supabase
    .from("news") // o "noticias" si así se llama tu tabla
    .select("id, title, content, excerpt, image_url, published_at")
    .order("published_at", { ascending: false });

  if (limit && limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getNews] error:", error);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    imageUrl: row.image_url || undefined,
    publishedAt: row.published_at,
  }));
}

export async function getDocuments(): Promise<DocumentT[]> {
  return mockDocuments;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return mockGalleryImages;
}

export async function getUsefulLinks() {
  return [
    { title: "Ley 5753 – Colegio de Antropología de Jujuy", url: "https://boletinoficial.jujuy.gob.ar/?p=66286" },
    { title: "Colegio de Graduados en Antropología de la República Argentina (CGA)", url: "https://cgantropologia.org.ar/" },
    { title: "Instituto Nacional de Antropología y Pensamiento Latinoamericano (INAPL)", url: "https://inapl.cultura.gob.ar/" },
    { title: "Cuadernos del INAPL (publicaciones antropológicas)", url: "https://inapl.cultura.gob.ar/" },
    { title: "13° Congreso Argentino de Antropología Social – Jujuy (CAAS)", url: "https://13caas.unju.edu.ar/" }
  ];
}

// Helpers legacy (compatibilidad)
export function getProfesionalByDni(dni: string) {
  return pd.getProfesionalByDni?.(dni);
}

export function getConstanciaByProfesional(profesionalId: string) {
  return pd.getConstanciaByProfesional?.(profesionalId);
}


export type DocumentRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string | null;
  year: number | null;
  bucket_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  file_size: number | null;
  public_url: string | null;
  is_public: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

const TABLE = "documents";
const BUCKET = "documentos";

export function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Admin: listar todos, sin filtro de is_public
export async function fetchAdminDocuments(): Promise<DocumentRecord[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Público: solo is_public = true y published_at no nulo, ordenados
export async function fetchPublicDocuments(): Promise<DocumentRecord[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("is_public", true)
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchDocumentById(id: string): Promise<DocumentRecord | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

// Subir archivo al bucket y devolver info
export async function uploadDocumentFile(file: File) {
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
    file_name: file.name,
    mime_type: file.type || "application/pdf",
    file_size: file.size,
    public_url: publicData.publicUrl,
  };
}

type UpsertPayload = {
  id?: string;
  title: string;
  description?: string;
  publishedAt?: string | null;
  isPublic?: boolean;
  category?: string | null;
  year?: number | null;
  storageMeta?: {
    storage_path: string;
    file_name: string;
    mime_type: string | null;
    file_size: number | null;
    public_url: string | null;
  };
};

// Crear o actualizar documento
export async function upsertDocument(payload: UpsertPayload): Promise<DocumentRecord> {
  const {
    id,
    title,
    description,
    publishedAt,
    isPublic = true,
    category = null,
    year = null,
    storageMeta,
  } = payload;

  const slug = slugify(title);

  const base: any = {
    title,
    slug,
    description: description ?? null,
    category,
    year,
    is_public: isPublic,
    bucket_id: BUCKET,
    published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
  };

  if (storageMeta) {
    base.storage_path = storageMeta.storage_path;
    base.file_name = storageMeta.file_name;
    base.mime_type = storageMeta.mime_type;
    base.file_size = storageMeta.file_size;
    base.public_url = storageMeta.public_url;
  }

  let query = supabase.from(TABLE).upsert(
    id
      ? { id, ...base }
      : base,
    {
      onConflict: "slug",
    }
  ).select("*").single();

  const { data, error } = await query;
  if (error) throw error;
  return data as DocumentRecord;
}

export async function deleteDocument(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}