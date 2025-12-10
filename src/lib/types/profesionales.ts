// src/types/profesionales.ts

// Tipos “canonical” en minúsculas para usar en DB y lógica
export type ProfesionalTipo = "licenciado" | "tecnico_otro";

export type ProfesionalEstadoMatricula =
  | "activa"
  | "inactiva"
  | "en_revision"
  | "suspendida";

export interface Profesional {
  id: string;                // uuid NOT NULL
  matricula: string;         // text NOT NULL (unique)
  apellido: string;          // text NOT NULL
  nombre: string;            // text NOT NULL

  tipo: ProfesionalTipo;     // profesional_tipo NOT NULL (default 'licenciado')

  // especialidad_principal text NOT NULL
  especialidadPrincipal: string;

  // otras_especialidades text NULL
  otrasEspecialidades: string | null;

  // Ubicación / trabajo (todas NULL en DB)
  lugarTrabajo: string | null;   // lugar_trabajo
  institucion: string | null;
  localidad: string | null;
  provincia: string | null;

  // Contacto (NULL en DB)
  email: string | null;
  telefono: string | null;

  // Estado de matrícula y relación con otros módulos
  estadoMatricula: ProfesionalEstadoMatricula; // NOT NULL con default
  habilitadoEjercer: boolean;                  // NOT NULL default true
  tieneDeuda: boolean;                         // NOT NULL default false
  ultimoPeriodoPago: string | null;           // ultimo_periodo_pago text NULL, ej "2025-01"

  // Meta
  cvPdfUrl: string | null;        // cv_pdf_url
  notasInternas: string | null;   // notas_internas

  // Fechas (NOT NULL en DB, con default now())
  fechaAlta: string;              // fecha_alta (ISO recomendada al mapear)
  fechaActualizacion: string;     // fecha_actualizacion

  // FK opcional a solicitud
  solicitudMatriculacionId: string | null; // solicitud_matriculacion_id uuid NULL
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
