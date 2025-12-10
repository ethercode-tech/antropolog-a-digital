import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../_supabaseAdmin";
import type { Profesional } from "../../src/lib/types/profesionales";

// ─────────────────────────────────────────
// LOG HELPER
// ─────────────────────────────────────────
function log(...args: any[]) {
  console.log("[ADMIN/PROFESIONALES]", ...args);
}

// ─────────────────────────────────────────
// CORS
// ─────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "http://localhost:8080",
  "https://colegiodeantropologos.vercel.app",
];

function setCors(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || "NO_ORIGIN";
  log("CORS origin recibido:", origin);

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-admin-token"
  );

  log("CORS aplicado");
}

// ─────────────────────────────────────────
// Auth simple
// ─────────────────────────────────────────
function assertAdmin(req: VercelRequest) {
  log("Validando admin token...");
  const token = req.headers["x-admin-token"];

  if (!token) {
    log("ERROR: Token faltante");
    const error: any = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  if (token !== process.env.ADMIN_INTERNAL_TOKEN) {
    log("ERROR: Token inválido", token);
    const error: any = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  log("Admin autorizado");
}

// ─────────────────────────────────────────
// Mapper
// ─────────────────────────────────────────
function mapProfesionalRow(row: any): Profesional {
  log("Mapeando fila DB:", row?.id);
  return {
    id: row.id,
    matricula: row.matricula,
    apellido: row.apellido,
    nombre: row.nombre,
    tipo: row.tipo,
    especialidadPrincipal: row.especialidad_principal,
    otrasEspecialidades: row.otras_especialidades,
    lugarTrabajo: row.lugar_trabajo,
    institucion: row.institucion,
    localidad: row.localidad,
    provincia: row.provincia,
    email: row.email,
    telefono: row.telefono,
    estadoMatricula: row.estado_matricula,
    habilitadoEjercer: row.habilitado_ejercer,
    tieneDeuda: row.tiene_deuda,
    ultimoPeriodoPago: row.ultimo_periodo_pago,
    cvPdfUrl: row.cv_pdf_url,
    notasInternas: row.notas_internas,
    fechaAlta: row.fecha_alta,
    fechaActualizacion: row.fecha_actualizacion,
    solicitudMatriculacionId: row.solicitud_matriculacion_id ?? null,
  };
}

// ─────────────────────────────────────────
// Handler principal
// ─────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  log("──────────────────────────────────────────");
  log("Nueva request:", req.method, req.url);

  setCors(req, res);

  if (req.method === "OPTIONS") {
    log("OPTIONS finalizado");
    return res.status(200).end();
  }

  try {
    if (req.method === "GET") {
      log("Procesando GET profesionales...");
      log("Query params:", req.query);

      let query = supabaseAdmin
        .from("profesionales")
        .select("*")
        .order("apellido", { ascending: true });

      const estado = req.query.estado;
      if (estado && estado !== "todos") {
        log("Aplicando filtro estado:", estado);
        query = query.eq("estado_matricula", estado);
      }

      const { data, error } = await query;

      if (error) {
        log("ERROR DB GET:", error);
        return res.status(500).json({ error: "DB_ERROR" });
      }

      log("Query OK. Cantidad:", data?.length);

      const mapped = (data ?? []).map(mapProfesionalRow);

      log("Finalizando GET profesionales OK");
      return res.status(200).json(mapped);
    }

    if (req.method === "POST") {
      log("Procesando POST profesional...");
      log("Body recibido:", req.body);

      assertAdmin(req);

      const body = req.body as Partial<Profesional>;

      if (!body.matricula || !body.apellido || !body.nombre) {
        log("ERROR: Campos faltantes");
        return res.status(400).json({ error: "MISSING_FIELDS" });
      }

      const payload = {
        matricula: body.matricula,
        apellido: body.apellido,
        nombre: body.nombre,
        tipo: body.tipo ?? "licenciado",
        especialidad_principal: body.especialidadPrincipal ?? "",
        otras_especialidades: body.otrasEspecialidades ?? null,
        lugar_trabajo: body.lugarTrabajo ?? null,
        institucion: body.institucion ?? null,
        localidad: body.localidad ?? null,
        provincia: body.provincia ?? null,
        email: body.email ?? null,
        telefono: body.telefono ?? null,
        estado_matricula: body.estadoMatricula ?? "activa",
        habilitado_ejercer: body.habilitadoEjercer ?? true,
        tiene_deuda: body.tieneDeuda ?? false,
        ultimo_periodo_pago: body.ultimoPeriodoPago ?? null,
        cv_pdf_url: body.cvPdfUrl ?? null,
        notas_internas: body.notasInternas ?? null,
      };

      log("Payload final POST:", payload);

      const { data, error } = await supabaseAdmin
        .from("profesionales")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        log("ERROR DB POST:", error);
        return res.status(500).json({ error: "DB_ERROR" });
      }

      log("Insert OK:", data.id);

      const mapped = mapProfesionalRow(data);
      return res.status(201).json(mapped);
    }

    log("ERROR método no permitido:", req.method);
    res.setHeader("Allow", "GET,POST,OPTIONS");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  } catch (err: any) {
    log("ERROR general:", err);
    const status = err.statusCode || 500;
    return res.status(status).json({ error: err.message });
  }
}
