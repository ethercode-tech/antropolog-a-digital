import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../_supabaseAdmin";
import type { Profesional } from "../../src/lib/types/profesionales";


function assertAdmin(req: VercelRequest) {
  // Ejemplo burdo: header interno, SOLO para desarrollo
  const token = req.headers["x-admin-token"];
  if (!token || token !== process.env.ADMIN_INTERNAL_TOKEN) {
    const error: any = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      // filtros simples opcionales
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
        console.error(error);
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

      return res.status(200).json(filtered);
    }

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
        console.error(error);
        return res.status(500).json({ error: "DB_ERROR" });
      }

      return res.status(201).json(data);
    }

    res.setHeader("Allow", "GET,POST");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  } catch (err: any) {
    console.error(err);
    const status = err.statusCode || 500;
    return res.status(status).json({ error: err.message || "UNKNOWN_ERROR" });
  }
}
