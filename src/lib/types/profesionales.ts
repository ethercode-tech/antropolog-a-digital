// src/types/profesionales.ts

// Tipos “canonical” en minúsculas para usar en DB y lógica
export type ProfesionalTipo = "licenciado" | "tecnico_otro";

export type ProfesionalEstadoMatricula =
  | "activa"
  | "inactiva"
  | "en_revision"
  | "suspendida";

export interface Profesional {
  id: string;
  // identificador interno (UUID en la DB idealmente)
  matricula: string;
  apellido: string;
  nombre: string;

  tipo: ProfesionalTipo;

  especialidadPrincipal: string;
  otrasEspecialidades?: string;

  // Ubicación / trabajo
  lugarTrabajo?: string;
  institucion?: string;
  localidad?: string;
  provincia?: string;

  // Contacto
  email?: string;
  telefono?: string;

  // Estado de matrícula y relación con otros módulos
  estadoMatricula: ProfesionalEstadoMatricula;
  habilitadoEjercer: boolean;
  tieneDeuda: boolean;
  ultimoPeriodoPago?: string; // "2025-01", por ejemplo

  // Meta
  cvPdfUrl?: string;
  notasInternas?: string;

  fechaAlta: string; // ISO
  fechaActualizacion?: string; // ISO
}

// Helpers de presentación para la parte pública / UI

export function getTipoProfesionalLabel(tipo: ProfesionalTipo): string {
  switch (tipo) {
    case "licenciado":
      return "Licenciado";
    case "tecnico_otro":
      return "Técnico / Otro";
    default:
      return tipo;
  }
}

export function getEstadoMatriculaLabel(
  estado: ProfesionalEstadoMatricula
): string {
  switch (estado) {
    case "activa":
      return "Activa";
    case "inactiva":
      return "Inactiva";
    case "en_revision":
      return "En revisión";
    case "suspendida":
      return "Suspendida";
    default:
      return estado;
  }
}
