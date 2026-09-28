// Ícones das redes sociais (simple-icons, CC0) e alguns genéricos desenhados aqui.
// Todos usam currentColor: nenhuma cor de marca, para o visual ficar neutro.
import { siFacebook, siInstagram, siLinktree, siTelegram, siThreads, siTiktok, siX, siYoutube } from "simple-icons";

const NS = "http://www.w3.org/2000/svg";
const MARCAS: Record<string, string> = {
  Instagram: siInstagram.path, Facebook: siFacebook.path, X: siX.path, TikTok: siTiktok.path,
  YouTube: siYoutube.path, Threads: siThreads.path, Telegram: siTelegram.path, Linktree: siLinktree.path,
};

// Genéricos em traço (24x24): globo para sites, vídeo para o Kwai, documento para a página do TSE.
const TRACOS: Record<string, string[]> = {
  Site: ["M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z", "M3 12h18", "M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"],
  Kwai: ["M4 6h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z", "M17 10l5-3v10l-5-3"],
  TSE: ["M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z", "M14 3v5h5", "M9 13h7", "M9 17h7"],
};

export function icone(tipo: string): SVGSVGElement {
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("class", "icone");
  const marca = MARCAS[tipo];
  const tracos = marca ? null : TRACOS[tipo] ?? TRACOS.Site;
  for (const d of marca ? [marca] : tracos!) {
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", d);
    if (marca) p.setAttribute("fill", "currentColor");
    else {
      p.setAttribute("fill", "none");
      p.setAttribute("stroke", "currentColor");
      p.setAttribute("stroke-width", "1.8");
      p.setAttribute("stroke-linecap", "round");
      p.setAttribute("stroke-linejoin", "round");
    }
    svg.append(p);
  }
  return svg;
}
