export type Conf = "voto" | "declaracao" | "partido";

export interface Posicao {
  v: number;
  conf: Conf;
  fonte?: string;
  nota?: string;
}

export interface Resposta {
  /** 1 a 5 */
  v: number;
  /** marcada como "muito importante" */
  imp: boolean;
}

export interface Detalhe {
  q: string;
  u: number;
  c: number;
  conf: Conf;
  /** 0 (opostos) a 1 (iguais) */
  acordo: number;
  peso: number;
}

export interface Resultado {
  pct: number;
  /** perguntas respondidas pelo usuário em que o candidato tem posição */
  n: number;
  /** dessas, quantas com evidência do próprio candidato (voto ou declaração) */
  nIndividual: number;
  /** perguntas aplicáveis que o usuário respondeu */
  nRespondidas: number;
  dadosLimitados: boolean;
  detalhes: Detalhe[];
}

/** Evidência do próprio candidato vale o dobro da posição inferida do partido. */
export const PESO_CONF: Record<Conf, number> = { voto: 1, declaracao: 1, partido: 0.5 };
export const PESO_IMPORTANTE = 2;
/**
 * Encolhimento para 50%: funciona como K perguntas "neutras" imaginárias.
 * Sem isso, um candidato com uma única posição coincidente apareceria com 100%.
 */
export const K = 3;
/** Abaixo desse peso de evidência individual o resultado é marcado como dados limitados. */
export const LIMIAR_INDIVIDUAL = 5;
/**
 * Teto do peso somado das posições herdadas do partido. Sem ele, um candidato sem nenhuma
 * evidência própria vira uma cópia perfeita do partido e passa à frente de colegas com
 * histórico real, que sempre divergem um pouco da linha partidária.
 */
export const TETO_PARTIDO = 3;

export function acordo(u: number, c: number): number {
  return 1 - Math.abs(u - c) / 4;
}

export function calcularMatch(
  respostas: Record<string, Resposta>,
  posicoes: Record<string, Posicao>,
  perguntas: string[],
): Resultado {
  let pesoIndividual = 0;
  let pesoPartido = 0;
  let nRespondidas = 0;
  const detalhes: Detalhe[] = [];

  for (const q of perguntas) {
    const r = respostas[q];
    if (!r) continue;
    nRespondidas++;
    const p = posicoes[q];
    if (!p) continue;
    const peso = (r.imp ? PESO_IMPORTANTE : 1) * PESO_CONF[p.conf];
    if (p.conf === "partido") pesoPartido += peso;
    else pesoIndividual += r.imp ? PESO_IMPORTANTE : 1;
    detalhes.push({ q, u: r.v, c: p.v, conf: p.conf, acordo: acordo(r.v, p.v), peso });
  }

  const escalaPartido = pesoPartido > TETO_PARTIDO ? TETO_PARTIDO / pesoPartido : 1;
  let soma = 0;
  let pesos = 0;
  for (const d of detalhes) {
    if (d.conf === "partido") d.peso *= escalaPartido;
    soma += d.peso * d.acordo;
    pesos += d.peso;
  }

  const pct = Math.round((100 * (soma + K * 0.5)) / (pesos + K));
  return {
    pct,
    n: detalhes.length,
    nIndividual: detalhes.filter((d) => d.conf !== "partido").length,
    nRespondidas,
    dadosLimitados: pesoIndividual < LIMIAR_INDIVIDUAL,
    detalhes,
  };
}

/**
 * Ordena por match. Empates são desfeitos por uma ordem aleatória estável por sessão,
 * para que nenhum candidato ganhe vantagem pela ordem alfabética ou pelo número.
 */
export function ranquear<T extends { id: number }>(
  itens: { cand: T; res: Resultado }[],
  semente: number,
): { cand: T; res: Resultado }[] {
  const desempate = (id: number) => {
    let x = (id ^ semente) >>> 0;
    x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
    x = Math.imul(x ^ (x >>> 16), 0x45d9f3b) >>> 0;
    return (x ^ (x >>> 16)) >>> 0;
  };
  return [...itens].sort(
    (a, b) =>
      b.res.pct - a.res.pct ||
      Number(a.res.dadosLimitados) - Number(b.res.dadosLimitados) ||
      desempate(a.cand.id) - desempate(b.cand.id),
  );
}

// Codificação compacta das respostas para o link de compartilhamento:
// um caractere por pergunta, na ordem do questionário.
// "0" = pulou, "1".."5" = resposta, "a".."e" = resposta 1..5 marcada como importante.
export function codificar(respostas: Record<string, Resposta>, ordem: string[]): string {
  return ordem
    .map((q) => {
      const r = respostas[q];
      if (!r) return "0";
      return r.imp ? "abcde"[r.v - 1] : String(r.v);
    })
    .join("");
}

export function decodificar(s: string, ordem: string[]): Record<string, Resposta> {
  const out: Record<string, Resposta> = {};
  ordem.forEach((q, i) => {
    const ch = s[i];
    if (!ch || ch === "0") return;
    const n = "12345".indexOf(ch);
    const m = "abcde".indexOf(ch);
    if (n >= 0) out[q] = { v: n + 1, imp: false };
    else if (m >= 0) out[q] = { v: m + 1, imp: true };
  });
  return out;
}
