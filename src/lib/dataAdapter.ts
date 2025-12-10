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

// -----------------------------
// News, Documents, Gallery (mantener mocks por ahora)
// -----------------------------
export async function getNews(): Promise<News[]> {
  return mockNews;
}

export async function getDocuments(): Promise<DocumentT[]> {
  return mockDocuments;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return mockGalleryImages;
}

export async function getUsefulLinks(): Promise<{ title: string; url: string }[]> {
  return usefulLinks;
}

// Helpers legacy (compatibilidad)
export function getProfesionalByDni(dni: string) {
  return pd.getProfesionalByDni?.(dni);
}

export function getConstanciaByProfesional(profesionalId: string) {
  return pd.getConstanciaByProfesional?.(profesionalId);
}
