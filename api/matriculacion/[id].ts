import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../_supabaseAdmin";
import { assertAdmin } from "../_adminAuth";

type EstadoSolicitud =
  | "pendiente"
  | "en_revision"
  | "observado"
  | "aprobado"
  | "rechazado";

type MatriculacionUpdatePayload = {
  estado?: EstadoSolicitud;
  observaciones?: string | null;
  numeroMatriculaAsignado?: string | null;
  profesionalId?: string | null; // opcional, si lo querés linkear
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;

  if (!id) {
    return res.status(400).json({ error: "MISSING_ID" });
  }

  try {
    if (req.method === "GET") {
      // solo admin
      assertAdmin(req);

      const { data, error } = await supabaseAdmin
        .from("profesional_matriculacion_solicitudes")
        .select(
          "id, dni, nombre, email, telefono, especialidad, estado, observaciones, numero_matricula_asignado, profesional_id, creado_en, actualizado_en"
        )
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching solicitud matriculacion by id:", error);
        return res.status(500).json({ error: "DB_ERROR" });
      }

      if (!data) {
        return res.status(404).json({ error: "NOT_FOUND" });
      }

      return res.status(200).json(data);
    }

    if (req.method === "PUT") {
      assertAdmin(req);
      const body = req.body as MatriculacionUpdatePayload;

      const updatePayload: Record<string, any> = {};

      if (body.estado) updatePayload.estado = body.estado;
      if (body.observaciones !== undefined)
        updatePayload.observaciones = body.observaciones;
      if (body.numeroMatriculaAsignado !== undefined)
        updatePayload.numero_matricula_asignado = body.numeroMatriculaAsignado;
      if (body.profesionalId !== undefined)
        updatePayload.profesional_id = body.profesionalId;

      if (Object.keys(updatePayload).length === 0) {
        return res.status(400).json({ error: "EMPTY_UPDATE" });
      }

      const { data, error } = await supabaseAdmin
        .from("profesional_matriculacion_solicitudes")
        .update(updatePayload)
        .eq("id", id)
        .select(
          "id, dni, nombre, email, telefono, especialidad, estado, observaciones, numero_matricula_asignado, profesional_id, creado_en, actualizado_en"
        )
        .maybeSingle();

      if (error) {
        console.error("Error updating solicitud matriculacion:", error);
        return res.status(500).json({ error: "DB_ERROR" });
      }

      if (!data) {
        return res.status(404).json({ error: "NOT_FOUND" });
      }

      return res.status(200).json(data);
    }

    res.setHeader("Allow", "GET,PUT");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  } catch (err: any) {
    console.error("Unhandled error /api/matriculacion/[id]:", err);
    const status = err.statusCode || 500;
    return res.status(status).json({ error: err.message || "UNKNOWN_ERROR" });
  }
}
