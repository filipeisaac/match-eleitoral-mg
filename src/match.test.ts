import { describe, expect, test } from "bun:test";
import { calcularMatch, codificar, decodificar, K, ranquear, TETO_PARTIDO, type Posicao } from "./match";

const Q = ["G01", "G02", "G03", "G04"];
const Q12 = Array.from({ length: 12 }, (_, i) => `G${String(i + 1).padStart(2, "0")}`);

describe("calcularMatch", () => {
  test("concordância total com evidência individual fica perto de 100%", () => {
    const pos: Record<string, Posicao> = Object.fromEntries(Q12.map((q) => [q, { v: 5, conf: "voto" }]));
    const res = calcularMatch(Object.fromEntries(Q12.map((q) => [q, { v: 5, imp: false }])), pos, Q12);
    expect(res.pct).toBe(Math.round((100 * (12 + K / 2)) / (12 + K)));
    expect(res.pct).toBeGreaterThan(80);
    expect(res.dadosLimitados).toBe(false);
  });

  test("discordância total fica perto de 0%", () => {
    const pos: Record<string, Posicao> = Object.fromEntries(Q12.map((q) => [q, { v: 1, conf: "declaracao" }]));
    const res = calcularMatch(Object.fromEntries(Q12.map((q) => [q, { v: 5, imp: false }])), pos, Q12);
    expect(res.pct).toBeLessThan(20);
  });

  test("candidato sem nenhuma posição fica em 50% e com dados limitados", () => {
    const res = calcularMatch({ G01: { v: 5, imp: false } }, {}, Q);
    expect(res.pct).toBe(50);
    expect(res.n).toBe(0);
    expect(res.nRespondidas).toBe(1);
    expect(res.dadosLimitados).toBe(true);
  });

  test("uma única posição coincidente não gera 100%", () => {
    const res = calcularMatch({ G01: { v: 5, imp: false } }, { G01: { v: 5, conf: "voto" } }, Q);
    // (1 acordo + K × 0,5) / (1 + K)
    expect(res.pct).toBe(Math.round((100 * (1 + K / 2)) / (1 + K)));
    expect(res.pct).toBeLessThan(75);
  });

  test("posição do partido pesa metade da evidência individual", () => {
    const u = { G01: { v: 5, imp: false }, G02: { v: 5, imp: false } };
    const individual = calcularMatch(u, { G01: { v: 5, conf: "voto" }, G02: { v: 1, conf: "partido" } }, Q);
    const partido = calcularMatch(u, { G01: { v: 5, conf: "partido" }, G02: { v: 1, conf: "voto" } }, Q);
    expect(individual.pct).toBeGreaterThan(partido.pct);
  });

  test("só a posição do partido não supera evidência individual equivalente", () => {
    const qs = Array.from({ length: 20 }, (_, i) => `Q${i}`);
    const u = Object.fromEntries(qs.map((q) => [q, { v: 5, imp: false }]));
    const soPartido = calcularMatch(u, Object.fromEntries(qs.map((q) => [q, { v: 5, conf: "partido" as const }])), qs);
    // candidato documentado: 8 votos, 7 iguais ao eleitor e 1 a um ponto de distância
    const documentado = calcularMatch(
      u,
      Object.fromEntries(qs.slice(0, 8).map((q, i) => [q, { v: i === 0 ? 4 : 5, conf: "voto" as const }])),
      qs,
    );
    expect(soPartido.pct).toBe(Math.round((100 * (TETO_PARTIDO + K / 2)) / (TETO_PARTIDO + K)));
    expect(documentado.pct).toBeGreaterThan(soPartido.pct);
  });

  test("poucas posições coincidentes não superam muitas posições quase iguais", () => {
    const qs = Array.from({ length: 20 }, (_, i) => `Q${i}`);
    const u = Object.fromEntries(qs.map((q) => [q, { v: 5, imp: false }]));
    const tres = calcularMatch(u, Object.fromEntries(qs.slice(0, 3).map((q) => [q, { v: 5, conf: "declaracao" as const }])), qs);
    // 15 posições: 12 iguais e 3 a um ponto de distância (acordo médio de 95%)
    const quinze = calcularMatch(u, Object.fromEntries(qs.slice(0, 15).map((q, i) => [q, { v: i < 12 ? 5 : 4, conf: "declaracao" as const }])), qs);
    expect(tres.dadosLimitados).toBe(true);
    expect(quinze.pct).toBeGreaterThan(tres.pct);
  });

  test("pergunta marcada como importante pesa o dobro", () => {
    const pos: Record<string, Posicao> = { G01: { v: 5, conf: "voto" }, G02: { v: 1, conf: "voto" } };
    const importaG01 = calcularMatch({ G01: { v: 5, imp: true }, G02: { v: 5, imp: false } }, pos, Q);
    const importaG02 = calcularMatch({ G01: { v: 5, imp: false }, G02: { v: 5, imp: true } }, pos, Q);
    expect(importaG01.pct).toBeGreaterThan(importaG02.pct);
  });

  test("perguntas puladas e fora do cargo são ignoradas", () => {
    const res = calcularMatch({ G01: { v: 3, imp: false }, X99: { v: 1, imp: false } }, { X99: { v: 5, conf: "voto" } }, Q);
    expect(res.n).toBe(0);
    expect(res.nRespondidas).toBe(1);
  });
});

describe("ranquear", () => {
  const r = (pct: number, dadosLimitados = false) => ({ pct, n: 1, nIndividual: 1, nRespondidas: 1, dadosLimitados, detalhes: [] });

  test("ordena por porcentagem e, no empate, prefere quem tem mais dados", () => {
    const out = ranquear(
      [
        { cand: { id: 1 }, res: r(60, true) },
        { cand: { id: 2 }, res: r(80) },
        { cand: { id: 3 }, res: r(60) },
      ],
      42,
    );
    expect(out.map((x) => x.cand.id)).toEqual([2, 3, 1]);
  });

  test("desempate depende da semente, não do id", () => {
    const itens = Array.from({ length: 20 }, (_, i) => ({ cand: { id: i + 1 }, res: r(50) }));
    const a = ranquear(itens, 1).map((x) => x.cand.id);
    const b = ranquear(itens, 2).map((x) => x.cand.id);
    expect(a).not.toEqual(b);
    expect(a).not.toEqual(itens.map((x) => x.cand.id));
  });
});

describe("codificação do link", () => {
  test("ida e volta preserva respostas, importância e pulos", () => {
    const ordem = ["A", "B", "C", "D"];
    const resp = { A: { v: 1, imp: false }, C: { v: 4, imp: true }, D: { v: 5, imp: false } };
    const s = codificar(resp, ordem);
    expect(s).toBe("10d5");
    expect(decodificar(s, ordem)).toEqual(resp);
  });
});
