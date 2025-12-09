// src/lib/dataAdapter.ts
// Adapter que centraliza acceso a datos (mocks en dev, TODO: conectar a Supabase en prod)

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

export type Profesional = any;

// -----------------------------
// IMPORTS ESTÁTICOS de mocks (funciona en browser y dev)
// -----------------------------
// Nota: esto hace que dev-only/data se incluya en el bundle.
// Antes de producción deberíamos eliminar dev-only del repo o proteger su inclusión.
import * as md from "../../dev-only/data/mockData";
import * as pd from "../../dev-only/data/profesionalesData";

// Async getters (para futuro uso con API/Supabase)
export async function getNews(): Promise<News[]> {
  if (process.env.NODE_ENV === "development") {
    return md.mockNews ?? [];
  }
  // TODO: fetch real desde /api/news o Supabase
  return [];
}

export async function getDocuments(): Promise<DocumentT[]> {
  if (process.env.NODE_ENV === "development") {
    return md.mockDocuments ?? [];
  }
  return [];
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (process.env.NODE_ENV === "development") {
    return md.mockGalleryImages ?? [];
  }
  return [];
}

export async function getUsefulLinks(): Promise<{ title: string; url: string }[]> {
  if (process.env.NODE_ENV === "development") {
    return md.usefulLinks ?? [];
  }
  return [];
}

export async function getProfesionales(): Promise<Profesional[]> {
  if (process.env.NODE_ENV === "development") {
    return pd.mockProfesionales ?? [];
  }
  // TODO: fetch real
  return [];
}

// -----------------------------
// Re-exports síncronos (compatibilidad con componentes existentes)
// -----------------------------
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
// Helpers delegados
// -----------------------------
export function getProfesionalByDniMatricula(dni: string, matricula: string) {
  return typeof pd.getProfesionalByDniMatricula === "function"
    ? pd.getProfesionalByDniMatricula(dni, matricula)
    : undefined;
}

export function getProfesionalByDni(dni: string) {
  return typeof pd.getProfesionalByDni === "function" ? pd.getProfesionalByDni(dni) : undefined;
}

export function getDeudasByProfesional(profesionalId: string) {
  return typeof pd.getDeudasByProfesional === "function" ? pd.getDeudasByProfesional(profesionalId) : [];
}

export function getFacturasByProfesional(profesionalId: string) {
  return typeof pd.getFacturasByProfesional === "function" ? pd.getFacturasByProfesional(profesionalId) : [];
}

export function getConstanciaByProfesional(profesionalId: string) {
  return typeof pd.getConstanciaByProfesional === "function" ? pd.getConstanciaByProfesional(profesionalId) : undefined;
}

export function getMatriculacionByDni(dni: string) {
  return typeof pd.getMatriculacionByDni === "function" ? pd.getMatriculacionByDni(dni) : undefined;
}
