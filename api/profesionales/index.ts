import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../_supabaseAdmin";
import type { Profesional } from "../../src/lib/types/profesionales";

// ─────────────────────────────────────
// CORS
// ─────────────────────────────────────

function setCors(res: VercelResponse) {
  // Mientras estés probando desde localhost, esto te sirve.
  // Si después querés algo más estricto, cambiás el "*".
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-admin-token"
  );
}

// ─────────────────────────────────────
// Auth burda para POST (solo dev)
// ─────────────────────────────────────

function assertAdmin(req: VercelRequest) {
  const token = req.headers["x-admin-token"];
  if (!token || token !== process.env.ADMIN_INTERNAL_TOKEN) {
    const error: any = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
}

// Helper para mapear registro de DB (snake_case) a tipo del front (camelCase)
function mapProfesionalRow(row: any): Profesional {
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
    fechaActualizacion: row.fecha_actualizacion
  };
}

// ─────────────────────────────────────
// Handler principal
// ─────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Siempre setear CORS
  setCors(res);

  // Preflight CORS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // ─────────────── GET /api/admin/profesionales ───────────────
    if (req.method === "GET") {
      const search = String(req.query.search || "").toLowerCase();
      const estado = req.query.estado as string | undefined;

      let query = supabaseAdmin
        .from("profesionales")
        .select("*")
        .order("apellido", { ascending: true });

      if (estado && estado !== "todos") {
        query = query.eq("estado_matricula", estado);
      }

      const { data, error } = await query;

      if (error) {
        console.error("[GET /api/admin/profesionales] DB_ERROR", error);
        return res.status(500).json({ error: "DB_ERROR" });
      }

      const filtered =
        search.trim().length === 0
          ? data
          : data?.filter((p) => {
              const fullName = `${p.apellido ?? ""} ${p.nombre ?? ""}`.toLowerCase();
              return (
                fullName.includes(search) ||
                String(p.matricula ?? "").toLowerCase().includes(search)
              );
            });

      const mapped = (filtered ?? []).map(mapProfesionalRow);

      return res.status(200).json(mapped);
    }

    // ─────────────── POST /api/admin/profesionales ───────────────
    if (req.method === "POST") {
      assertAdmin(req);

      const body = req.body as Partial<Profesional>;

      if (!body.matricula || !body.apellido || !body.nombre) {
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

      const { data, error } = await supabaseAdmin
        .from("profesionales")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        console.error("[POST /api/admin/profesionales] DB_ERROR", error);
        return res.status(500).json({ error: "DB_ERROR" });
      }

      const mapped = mapProfesionalRow(data);
      return res.status(201).json(mapped);
    }

    // Métodos no permitidos
    res.setHeader("Allow", "GET,POST,OPTIONS");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  } catch (err: any) {
    console.error("[/api/admin/profesionales] UNHANDLED", err);
    const status = err.statusCode || 500;
    return res.status(status).json({ error: err.message || "UNKNOWN_ERROR" });
  }
}
