import type { VercelRequest } from "@vercel/node";

export function assertAdmin(req: VercelRequest) {
  const token = req.headers["x-admin-token"];

  if (!process.env.ADMIN_INTERNAL_TOKEN) {
    throw Object.assign(new Error("ADMIN_INTERNAL_TOKEN not configured"), {
      statusCode: 500,
    });
  }

  if (!token || token !== process.env.ADMIN_INTERNAL_TOKEN) {
    throw Object.assign(new Error("Unauthorized"), {
      statusCode: 401,
    });
  }
}
