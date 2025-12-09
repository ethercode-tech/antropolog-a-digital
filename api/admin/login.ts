// api/admin/login.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  const adminEmail = process.env.ADMIN_PANEL_EMAIL;
  const adminPassword = process.env.ADMIN_PANEL_PASSWORD;
  const adminToken = process.env.ADMIN_INTERNAL_TOKEN;

  if (!adminEmail || !adminPassword || !adminToken) {
    return res.status(500).json({
      error: "Config de admin incompleta (revisar variables de entorno)",
    });
  }

  // Acá podrías meter bcrypt.compare si guardás hash en vez de texto plano
  const ok = email === adminEmail && password === adminPassword;

  if (!ok) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  // Devolvemos un token que el front usará en x-admin-token
  return res.status(200).json({
    token: adminToken,
  });
}
