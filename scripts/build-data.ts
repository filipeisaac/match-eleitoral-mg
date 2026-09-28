// Junta os dados do TSE, as posições pesquisadas e a posição dos partidos em public/data/<uf>.json.
// Roda com dados parciais: candidatos sem pesquisa entram só com a posição do partido (ou sem nenhuma).
//
// Estrutura de dados por estado:
//   MG: data/selected.json, data/raw/tse_mg_2026.json, data/positions/
//   SP: data/sp/selected.json, data/sp/raw/tse_sp_2026.json, data/sp/positions/
// Presidente é o mesmo nos dois estados: as posições de qualquer pasta valem para todos.
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Posicao } from "../src/match";

const ROOT = join(import.meta.dir, "..");
const D = (...p: string[]) => join(ROOT, "data", ...p);
const readJson = <T>(p: string): T => JSON.parse(readFileSync(p, "utf8"));

type Sel = {
  id: number; cargoCod: number; cargo: string; nomeUrna: string; nomeCompleto: string; numero: number;
  partido: string; coligacao: string; situacao: string; ocupacao: string; incumbente: boolean;
  anteriores: { ano: number; cargo: string; local: string; partido: string; resultado: string }[];
  sites: string[];
};
type Pesquisa = { id: number; resumo?: string; bandeiras?: string[]; posicoes?: Record<string, Posicao> };

const ESTADOS: Record<string, { selected: string; raw: string; positions: string }> = {
  MG: { selected: D("selected.json"), raw: D("raw", "tse_mg_2026.json"), positions: D("positions") },
  SP: { selected: D("sp", "selected.json"), raw: D("sp", "raw", "tse_sp_2026.json"), positions: D("sp", "positions") },
};

const questions = readJson<any>(D("questions.json"));
// "Mais detalhes" de cada pergunta, quando existir (um arquivo por pasta, todos juntos).
const detalhes: Record<string, any> = {};
for (const f of [D("detalhes.json"), D("sp", "detalhes.json")]) if (existsSync(f)) Object.assign(detalhes, readJson(f));

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

// ---------- Leitura de todas as pastas de posições ----------
const pesquisa = new Map<number, Pesquisa>();
const votos: Record<string, { posicoes: Record<string, Posicao> }> = {};
const partidos: Record<string, Record<string, Posicao>> = {};
const lidos: string[] = [];
for (const [uf, cfg] of Object.entries(ESTADOS)) {
  if (!existsSync(cfg.positions)) continue;
  for (const f of readdirSync(cfg.positions)) {
    if (!f.endsWith(".json")) continue;
    const caminho = join(cfg.positions, f);
    try {
      if (f.startsWith("partidos")) {
        for (const [sigla, pos] of Object.entries(readJson<Record<string, Record<string, Posicao>>>(caminho)))
          partidos[sigla] = { ...partidos[sigla], ...pos };
        lidos.push(`${uf}/${f}`);
        continue;
      }
      if (f.startsWith("camara_votos")) {
        for (const [id, c] of Object.entries(readJson<any>(caminho).candidatos ?? {}) as [string, any][])
          votos[id] = { posicoes: mesclar(votos[id]?.posicoes, c.posicoes) };
        lidos.push(`${uf}/${f}`);
        continue;
      }
      const arr = readJson<Pesquisa[]>(caminho);
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
      lidos.push(`${uf}/${f} (${arr.length})`);
    } catch (e) {
      console.warn(`ignorado ${uf}/${f}: ${(e as Error).message}`);
    }
  }
}

// ---------- Redes sociais ----------
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

// ---------- Saída por estado ----------
const comDetalhes = (s: any) => ({ ...s, perguntas: s.perguntas.map((p: any) => (detalhes[p.id] ? { ...p, detalhes: detalhes[p.id] } : p)) });
mkdirSync(join(ROOT, "public/data"), { recursive: true });

for (const [uf, cfg] of Object.entries(ESTADOS)) {
  if (!existsSync(cfg.selected)) { console.log(`${uf}: sem selected.json, pulando`); continue; }
  const est = questions.estados[uf];
  const base = Object.fromEntries(questions.secoes.map((s: any) => [s.id, s]));
  const secoes = [
    base.geral, base.presidente, est.governador, base.senador,
    { ...base.deputado_federal, descricao: est.descricoes.deputado_federal, vagas: est.vagas.deputado_federal },
    est.deputado_estadual,
  ].map(comDetalhes);
  const cargoSecao: Record<number, any> = Object.fromEntries(secoes.filter((s) => s.cargoCod).map((s) => [s.cargoCod, s]));
  const perguntasDe = (c: number) => new Set<string>([...secoes[0].perguntas, ...cargoSecao[c].perguntas].map((p: any) => p.id));

  let selected = readJson<Sel[]>(cfg.selected);
  // Presidente: mesma lista em todos os estados (a de MG é a referência).
  if (uf !== "MG") selected = [...readJson<Sel[]>(ESTADOS.MG.selected).filter((c) => c.cargoCod === 1), ...selected.filter((c) => c.cargoCod !== 1)];
  const rawById = new Map<number, any>();
  for (const f of new Set([ESTADOS.MG.raw, cfg.raw])) {
    if (!existsSync(f)) continue;
    for (const c of Object.values(readJson<Record<string, { candidatos: any[] }>>(f))) for (const x of c.candidatos) rawById.set(x.id, x);
  }

  let semPesquisa = 0;
  const candidatos = selected.map((s) => {
    const r = rawById.get(s.id) ?? {};
    const p = pesquisa.get(s.id);
    if (!p) semPesquisa++;
    const aplicaveis = perguntasDe(s.cargoCod);
    const partidoPos = Object.fromEntries(
      Object.entries(partidos[s.partido] ?? {}).map(([q, v]) => [q, { ...v, conf: "partido" as const }]),
    );
    const todas = mesclar(partidoPos, p?.posicoes, votos[String(s.id)]?.posicoes);
    const posicoes = Object.fromEntries(Object.entries(todas).filter(([q]) => aplicaveis.has(q)));
    const idade = r.nascimento ? Math.floor((Date.parse("2026-10-04") - Date.parse(r.nascimento)) / 3.15576e10) : null;
    return {
      id: s.id, cargoCod: s.cargoCod, nomeUrna: s.nomeUrna, nomeCompleto: s.nomeCompleto, numero: s.numero,
      partido: s.partido, partidoNome: r.partido?.nome ?? null,
      coligacao: s.coligacao && s.coligacao !== s.partido ? s.coligacao.trim() : null,
      composicao: r.composicao && r.composicao !== "**" ? r.composicao : null,
      situacao: s.situacao, ocupacao: s.ocupacao, idade, incumbente: s.incumbente,
      vices: r.vices ?? [], anteriores: (s.anteriores ?? []).slice(0, 4), redes: redes(s.sites),
      foto: existsSync(join(ROOT, "public/fotos", `${s.id}.jpg`)) ? `/fotos/${s.id}.jpg` : null,
      resumo: p?.resumo ?? null, bandeiras: p?.bandeiras ?? [], posicoes,
    };
  });

  const out = { geradoEm: new Date().toISOString(), eleicao: "2026-10-04", uf, estado: est.nome, escala: questions.escala, secoes, candidatos };
  writeFileSync(join(ROOT, "public/data", `${uf.toLowerCase()}.json`), JSON.stringify(out));
  const conta = (conf: string) => candidatos.reduce((n, c) => n + Object.values(c.posicoes).filter((p) => p.conf === conf).length, 0);
  console.log(`${uf}: ${candidatos.length} candidatos (${semPesquisa} sem pesquisa); voto ${conta("voto")}, declaração ${conta("declaracao")}, partido ${conta("partido")}`);
}
console.log(`arquivos lidos: ${lidos.length}; partidos com baseline: ${Object.keys(partidos).length}`);
