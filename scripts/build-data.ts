// Junta os dados do TSE, as posições pesquisadas e a posição dos partidos em public/data/app.json.
// Roda com dados parciais: candidatos sem pesquisa entram só com a posição do partido (ou sem nenhuma).
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Posicao } from "../src/match";

const ROOT = join(import.meta.dir, "..");
const D = (p: string) => join(ROOT, "data", p);
const readJson = <T>(p: string): T => JSON.parse(readFileSync(p, "utf8"));

type Sel = {
  id: number; cargoCod: number; cargo: string; nomeUrna: string; nomeCompleto: string; numero: number;
  partido: string; coligacao: string; situacao: string; ocupacao: string; incumbente: boolean;
  anteriores: { ano: number; cargo: string; local: string; partido: string; resultado: string }[];
  sites: string[];
};
type Pesquisa = { id: number; resumo?: string; bandeiras?: string[]; posicoes?: Record<string, Posicao> };

const questions = readJson<any>(D("questions.json"));
// "Mais detalhes" de cada pergunta, quando existir.
const detalhes: Record<string, any> = existsSync(D("detalhes.json")) ? readJson(D("detalhes.json")) : {};
for (const s of questions.secoes) for (const p of s.perguntas) if (detalhes[p.id]) p.detalhes = detalhes[p.id];
const selected = readJson<Sel[]>(D("selected.json"));
const raw = readJson<Record<string, { candidatos: any[] }>>(D("raw/tse_mg_2026.json"));
const rawById = new Map<number, any>();
for (const c of Object.values(raw)) for (const x of c.candidatos) rawById.set(x.id, x);

const posDir = D("positions");
const votos: Record<string, { posicoes: Record<string, Posicao> }> = existsSync(join(posDir, "camara_votos.json"))
  ? readJson<any>(join(posDir, "camara_votos.json")).candidatos ?? {}
  : {};
const partidos: Record<string, Record<string, Posicao>> = existsSync(join(posDir, "partidos.json"))
  ? readJson(join(posDir, "partidos.json"))
  : {};

const RANK: Record<string, number> = { voto: 3, declaracao: 2, partido: 1 };
const valida = (p: any): p is Posicao =>
  p && Number.isInteger(p.v) && p.v >= 1 && p.v <= 5 && p.conf in RANK;

// Afirmações mais amplas do que qualquer votação disponível: um voto numa lei específica
// (teto de gastos, privatizar a Copasa, cotas só em concursos, uma estação ecológica) mostra a direção,
// não a intensidade. Nesses casos o voto vale no máximo 2 ou 4, para todos os candidatos.
const VOTO_PARCIAL = new Set(["G01", "G03", "G07", "G11"]);

function mesclar(...fontes: (Record<string, Posicao> | undefined)[]): Record<string, Posicao> {
  const out: Record<string, Posicao> = {};
  for (const f of fontes) {
    for (const [q, p] of Object.entries(f ?? {})) {
      if (!valida(p)) continue;
      const v = p.conf === "voto" && VOTO_PARCIAL.has(q) ? Math.min(4, Math.max(2, p.v)) : p.v;
      const atual = out[q];
      if (!atual || RANK[p.conf] > RANK[atual.conf]) out[q] = { v, conf: p.conf, fonte: p.fonte, nota: p.nota };
    }
  }
  return out;
}

// Pesquisa individual: todos os arquivos de lote em data/positions (exceto os especiais).
const ESPECIAIS = new Set(["partidos.json", "camara_votos.json"]);
const pesquisa = new Map<number, Pesquisa>();
const lidos: string[] = [];
for (const f of existsSync(posDir) ? readdirSync(posDir) : []) {
  if (!f.endsWith(".json") || ESPECIAIS.has(f)) continue;
  try {
    const arr = readJson<Pesquisa[]>(join(posDir, f));
    for (const p of arr) {
      const prev = pesquisa.get(p.id);
      if (!prev) { pesquisa.set(p.id, p); continue; }
      // Vários arquivos podem falar do mesmo candidato (primeira e segunda passada):
      // texto vazio nunca apaga texto preenchido, e na mesma pergunta vale a evidência mais forte.
      pesquisa.set(p.id, {
        id: p.id,
        resumo: prev.resumo || p.resumo,
        bandeiras: prev.bandeiras?.length ? prev.bandeiras : p.bandeiras,
        posicoes: mesclar(prev.posicoes, p.posicoes),
      });
    }
    lidos.push(`${f} (${arr.length})`);
  } catch (e) {
    console.warn(`ignorado ${f}: ${(e as Error).message}`);
  }
}

const REDES: [RegExp, string][] = [
  [/instagram\.com/i, "Instagram"], [/facebook\.com|fb\.com/i, "Facebook"], [/(^|\/\/|\.)x\.com|twitter\.com/i, "X"],
  [/tiktok\.com/i, "TikTok"], [/youtube\.com|youtu\.be/i, "YouTube"], [/threads\.(net|com)/i, "Threads"],
  [/kwai\.com/i, "Kwai"], [/linktr\.ee/i, "Linktree"], [/t\.me\//i, "Telegram"],
];
function redes(sites: string[]) {
  const vistos = new Set<string>();
  const out: { tipo: string; url: string }[] = [];
  for (let url of sites ?? []) {
    url = url.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    // Convites de grupos de WhatsApp e links de rastreio ficam de fora.
    if (/whatsapp\.com|wa\.me|spotify\.com|flickr\.com/i.test(url)) continue;
    const tipo = REDES.find(([re]) => re.test(url))?.[1] ?? "Site";
    if (tipo !== "Site" && vistos.has(tipo)) continue;
    vistos.add(tipo);
    out.push({ tipo, url });
  }
  const ordem = ["Instagram", "X", "Facebook", "TikTok", "YouTube", "Threads", "Kwai", "Telegram", "Linktree", "Site"];
  return out.sort((a, b) => ordem.indexOf(a.tipo) - ordem.indexOf(b.tipo)).slice(0, 8);
}

const cargoSecao: Record<number, string> = { 1: "presidente", 3: "governador", 5: "senador", 6: "deputado_federal", 7: "deputado_estadual" };
const perguntasDe = (cargoCod: number) => {
  const ids = (s: any) => s.perguntas.map((p: any) => p.id);
  const geral = questions.secoes.find((s: any) => s.id === "geral");
  const sec = questions.secoes.find((s: any) => s.id === cargoSecao[cargoCod]);
  return new Set<string>([...ids(geral), ...ids(sec)]);
};

const semPesquisa: string[] = [];
const candidatos = selected.map((s) => {
  const r = rawById.get(s.id) ?? {};
  const p = pesquisa.get(s.id);
  if (!p) semPesquisa.push(`${s.cargo}: ${s.nomeUrna}`);
  const aplicaveis = perguntasDe(s.cargoCod);
  const partidoPos = Object.fromEntries(
    Object.entries(partidos[s.partido] ?? {}).map(([q, v]) => [q, { ...v, conf: "partido" as const }]),
  );
  const todas = mesclar(partidoPos, p?.posicoes, votos[String(s.id)]?.posicoes);
  const posicoes = Object.fromEntries(Object.entries(todas).filter(([q]) => aplicaveis.has(q)));
  const idade = r.nascimento ? Math.floor((Date.parse("2026-10-04") - Date.parse(r.nascimento)) / 3.15576e10) : null;
  return {
    id: s.id,
    cargoCod: s.cargoCod,
    nomeUrna: s.nomeUrna,
    nomeCompleto: s.nomeCompleto,
    numero: s.numero,
    partido: s.partido,
    partidoNome: r.partido?.nome ?? null,
    coligacao: s.coligacao && s.coligacao !== s.partido ? s.coligacao.trim() : null,
    composicao: r.composicao && r.composicao !== "**" ? r.composicao : null,
    situacao: s.situacao,
    ocupacao: s.ocupacao,
    idade,
    incumbente: s.incumbente,
    vices: r.vices ?? [],
    anteriores: (s.anteriores ?? []).slice(0, 4),
    redes: redes(s.sites),
    foto: existsSync(join(ROOT, "public/fotos", `${s.id}.jpg`)) ? `/fotos/${s.id}.jpg` : null,
    resumo: p?.resumo ?? null,
    bandeiras: p?.bandeiras ?? [],
    posicoes,
  };
});

const out = {
  geradoEm: new Date().toISOString(),
  eleicao: "2026-10-04",
  uf: "MG",
  escala: questions.escala,
  secoes: questions.secoes,
  candidatos,
};
mkdirSync(join(ROOT, "public/data"), { recursive: true });
writeFileSync(join(ROOT, "public/data/app.json"), JSON.stringify(out));

const conta = (conf: string) => candidatos.reduce((n, c) => n + Object.values(c.posicoes).filter((p) => p.conf === conf).length, 0);
console.log(`arquivos de pesquisa: ${lidos.join(", ") || "nenhum"}`);
console.log(`candidatos: ${candidatos.length}; sem pesquisa individual: ${semPesquisa.length}`);
console.log(`posições: voto ${conta("voto")}, declaração ${conta("declaracao")}, partido ${conta("partido")}`);
console.log(`partidos com baseline: ${Object.keys(partidos).length}; candidatos com votos da Câmara: ${Object.keys(votos).length}`);
