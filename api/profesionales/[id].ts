import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../_supabaseAdmin";
import type { Profesional } from "../../src/lib/types/profesionales";

function assertAdmin(req: VercelRequest) {
  const token = req.headers["x-admin-token"];
  if (!token || token !== process.env.ADMIN_INTERNAL_TOKEN) {
    const error: any = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json({ error: "MISSING_ID" });
  }

  try {
    if (req.method === "GET") {
      const { data, error } = await supabaseAdmin
        .from("profesionales")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        return res.status(500).json({ error: "DB_ERROR" });
      }

      if (!data) return res.status(404).json({ error: "NOT_FOUND" });

      return res.status(200).json(data);
    }

    if (req.method === "PUT") {
      assertAdmin(req);
      const body = req.body as Partial<Profesional>;

      const payload = {
        // Solo campos editables
        apellido: body.apellido,
        nombre: body.nombre,
        tipo: body.tipo,
        especialidad_principal: body.especialidadPrincipal,
        otras_especialidades: body.otrasEspecialidades ?? null,
        lugar_trabajo: body.lugarTrabajo ?? null,
        institucion: body.institucion ?? null,
        localidad: body.localidad ?? null,
        provincia: body.provincia ?? null,
        email: body.email ?? null,
        telefono: body.telefono ?? null,
        estado_matricula: body.estadoMatricula,
        habilitado_ejercer: body.habilitadoEjercer,
        tiene_deuda: body.tieneDeuda,
        ultimo_periodo_pago: body.ultimoPeriodoPago ?? null,
        cv_pdf_url: body.cvPdfUrl ?? null,
        notas_internas: body.notasInternas ?? null,
      };

      const { data, error } = await supabaseAdmin
        .from("profesionales")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error(error);
        return res.status(500).json({ error: "DB_ERROR" });
      }

      return res.status(200).json(data);
    }

    if (req.method === "DELETE") {
      assertAdmin(req);
      const { error } = await supabaseAdmin
        .from("profesionales")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
        return res.status(500).json({ error: "DB_ERROR" });
      }

      return res.status(204).end();
    }

    res.setHeader("Allow", "GET,PUT,DELETE");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  } catch (err: any) {
    console.error(err);
    const status = err.statusCode || 500;
    return res.status(status).json({ error: err.message || "UNKNOWN_ERROR" });
  }
}
