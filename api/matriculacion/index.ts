import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../_supabaseAdmin";

type EstadoSolicitud =
  | "pendiente"
  | "en_revision"
  | "observado"
  | "aprobado"
  | "rechazado";

type MatriculacionInsertPayload = {
  dni: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  // opcionalmente, podrías incluir documentos más adelante
};

type MatriculacionRow = {
  id: string;
  dni: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: string;
  estado: EstadoSolicitud;
  observaciones: string | null;
  numero_matricula_asignado: string | null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "POST") {
      const body = req.body as MatriculacionInsertPayload;

      if (
        !body?.dni ||
        !body?.nombre ||
        !body?.email ||
        !body?.telefono ||
        !body?.especialidad
      ) {
        return res.status(400).json({ error: "MISSING_FIELDS" });
      }

      const { data, error } = await supabaseAdmin
        .from("profesional_matriculacion_solicitudes")
        .insert({
          dni: body.dni,
          nombre: body.nombre,
          email: body.email,
          telefono: body.telefono,
          especialidad: body.especialidad,
          // estado = 'pendiente' por default
        })
        .select("*")
        .single();

      if (error) {
        console.error("Error inserting matriculacion:", error);
        return res.status(500).json({ error: "DB_ERROR" });
      }

      return res.status(201).json({
        id: data.id,
      });
    }

    if (req.method === "GET") {
      const dni = String(req.query.dni || "").trim();

      if (!dni) {
        return res.status(400).json({ error: "MISSING_DNI" });
      }

      const { data, error } = await supabaseAdmin
        .from("profesional_matriculacion_solicitudes")
        .select(
          "id, dni, nombre, email, telefono, especialidad, estado, observaciones, numero_matricula_asignado"
        )
        .eq("dni", dni)
        .order("creado_en", { ascending: false })
        .limit(1)
        .maybeSingle<MatriculacionRow>();

      if (error) {
        console.error("Error fetching matriculacion by DNI:", error);
        return res.status(500).json({ error: "DB_ERROR" });
      }

      if (!data) {
        // tu componente espera "not_found" para mostrar el mensaje
        return res.status(200).json({ result: "not_found" });
      }

      return res.status(200).json({
        result: {
          id: data.id,
          dni: data.dni,
          nombre: data.nombre,
          estado: data.estado,
          observaciones: data.observaciones,
          numeroMatriculaAsignado: data.numero_matricula_asignado,
        },
      });
    }

    res.setHeader("Allow", "GET,POST");
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  } catch (err: any) {
    console.error("Unhandled error /api/matriculacion:", err);
    const status = err.statusCode || 500;
    return res.status(status).json({ error: err.message || "UNKNOWN_ERROR" });
  }
}
