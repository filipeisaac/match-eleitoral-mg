// Servidor estático mínimo. Não há rotas de API: nenhuma resposta de usuário chega ao servidor.
import { join, normalize } from "node:path";

const PUBLIC = join(import.meta.dir, "public");
const port = Number(process.env.PORT || 3000);

const SEGURANCA = {
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
};

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/healthz") return new Response("ok");
    let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
    if (path === "/" || path === "") path = "/index.html";
    const file = Bun.file(join(PUBLIC, path));
    if (!(await file.exists())) return new Response("Não encontrado", { status: 404, headers: SEGURANCA });

    // Só as fotos ficam em cache longo; o resto revalida para que uma atualização chegue na hora.
    const cache = path.startsWith("/fotos/") ? "public, max-age=86400" : "no-cache";
    const aceitaGzip = (req.headers.get("accept-encoding") || "").includes("gzip");
    const texto = /\.(html|css|js|json|svg)$/.test(path);
    if (aceitaGzip && texto) {
      const corpo = Bun.gzipSync(new Uint8Array(await file.arrayBuffer()));
      return new Response(corpo, { headers: { ...SEGURANCA, "Content-Type": file.type, "Content-Encoding": "gzip", "Cache-Control": cache, Vary: "Accept-Encoding" } });
    }
    return new Response(file, { headers: { ...SEGURANCA, "Cache-Control": cache } });
  },
});
console.log(`Match Eleitoral em http://localhost:${port}`);
