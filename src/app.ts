import { calcularMatch, codificar, decodificar, ranquear, type Posicao, type Resposta, type Resultado } from "./match";
import { icone } from "./icones";

// ---------- Tipos dos dados ----------
interface Detalhes { situacao?: string; aFavor?: string[]; contra?: string[]; fontes?: string[] }
interface Pergunta { id: string; texto: string; contexto?: string; detalhes?: Detalhes }
interface Secao {
  id: string; titulo: string; cargoCod: number | null; descricao: string; votoProporcional?: string;
  vagas?: number; mostrar?: number; perguntas: Pergunta[];
}
interface Candidato {
  id: number; cargoCod: number; nomeUrna: string; nomeCompleto: string; numero: number; partido: string;
  partidoNome: string | null; coligacao: string | null; composicao: string | null; situacao: string;
  ocupacao: string | null; idade: number | null; incumbente: boolean;
  vices: { nome: string; partido: string; cargo: string }[];
  anteriores: { ano: number; cargo: string; local: string; partido: string; resultado: string }[];
  redes: { tipo: string; url: string }[]; foto: string | null; resumo: string | null; bandeiras: string[];
  posicoes: Record<string, Posicao>;
}
interface Dados { geradoEm: string; eleicao: string; uf: string; estado: string; escala: Record<string, string>; secoes: Secao[]; candidatos: Candidato[] }

type Passo = { tipo: "secao"; secao: Secao } | { tipo: "pergunta"; secao: Secao; p: Pergunta };

const REPO = "https://github.com/filipeisaac/match-eleitoral-mg";
/** Quantos temas cada pessoa pode marcar como muito importantes no cálculo final. */
const MAX_IMPORTANTES = 3;
/** Até que posição o botão "próximos colocados" mostra, por cargo (o topo mostra 2). */
const PROXIMOS_ATE: Record<number, number> = { 1: 5, 3: 5, 5: 5, 6: 10, 7: 10 };
/** Estados disponíveis e o critério de viabilidade de deputados em cada um. */
const ESTADOS: Record<string, { nome: string; inscritos: string; topFed: number; topEst: number }> = {
  MG: { nome: "Minas Gerais", inscritos: "mais de 1.700", topFed: 80, topEst: 100 },
  SP: { nome: "São Paulo", inscritos: "mais de 2.500", topFed: 105, topEst: 125 },
};

// ---------- Estado ----------
let D = undefined as unknown as Dados;
let UF: string | null = null;
let passos: Passo[] = [];
let ordemPerguntas: string[] = [];
/** Só o valor da resposta; a importância fica em `importantes`. */
let respostas: Record<string, { v: number }> = {};
let importantes: string[] = [];
let idx = 0;
let cola: Record<string, number[]> = {};
let compartilhado = false;
const expandidos = new Set<string>();
const semente = (() => {
  try {
    const s = sessionStorage.getItem("me-semente");
    if (s) return Number(s);
    const n = Math.floor(Math.random() * 2 ** 31);
    sessionStorage.setItem("me-semente", String(n));
    return n;
  } catch { return Math.floor(Math.random() * 2 ** 31); }
})();

const guardar = () => {
  if (compartilhado) return;
  try {
    localStorage.setItem("me-respostas", JSON.stringify(respostas));
    localStorage.setItem("me-importantes", JSON.stringify(importantes));
    localStorage.setItem("me-idx", String(idx));
    localStorage.setItem("me-cola", JSON.stringify(cola));
    if (UF) localStorage.setItem("me-uf", UF);
  } catch {}
};
const carregar = () => {
  try {
    const salvas = JSON.parse(localStorage.getItem("me-respostas") || "{}") || {};
    respostas = Object.fromEntries(Object.entries(salvas).map(([q, r]: [string, any]) => [q, { v: r.v }]));
    importantes = JSON.parse(localStorage.getItem("me-importantes") || "[]") || [];
    idx = Number(localStorage.getItem("me-idx") || 0) || 0;
    cola = JSON.parse(localStorage.getItem("me-cola") || "{}") || {};
  } catch { respostas = {}; importantes = []; idx = 0; cola = {}; }
};
/** Respostas no formato do cálculo: a importância só vale para perguntas respondidas. */
const respostasEfetivas = (): Record<string, Resposta> =>
  Object.fromEntries(Object.entries(respostas).map(([q, r]) => [q, { v: r.v, imp: importantes.includes(q) }]));

// ---------- Utilidades de DOM ----------
type Filho = Node | string | null | undefined | false;
function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, any> = {}, ...filhos: (Filho | Filho[])[]) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") el.className = v;
    // Via CSSOM: a CSP do servidor bloqueia o atributo style em si.
    else if (k === "style") el.style.cssText = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "text") el.textContent = v;
    else el.setAttribute(k, v === true ? "" : String(v));
  }
  for (const f of filhos.flat()) if (f !== null && f !== undefined && f !== false) el.append(f as any);
  return el;
}
const main = () => document.getElementById("main")!;
function render(...nodes: Node[]) {
  main().replaceChildren(...nodes);
}
function toast(msg: string) {
  const t = document.getElementById("toast")!;
  t.textContent = msg;
  t.classList.add("on");
  clearTimeout((t as any)._t);
  (t as any)._t = setTimeout(() => t.classList.remove("on"), 2800);
}
const urlSegura = (u?: string) => (u && /^https?:\/\//i.test(u) ? u : null);
const dominio = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } };
const MINUSC = new Set(["de", "da", "do", "das", "dos", "e", "di", "du"]);
const nomeBonito = (s: string) =>
  s.toLocaleLowerCase("pt-BR").split(/(\s+)/).map((w, i) =>
    /\s/.test(w) || (i > 0 && MINUSC.has(w)) ? w : w.charAt(0).toLocaleUpperCase("pt-BR") + w.slice(1)).join("");
const numeroBox = (n: number) => h("span", { class: "numero-box", "aria-label": `número ${n}` }, ...String(n).split("").map((d) => h("span", { text: d })));

const cargoNome: Record<number, string> = { 1: "Presidente", 3: "Governador", 5: "Senador", 6: "Deputado federal", 7: "Deputado estadual" };
const ordemUrna = [6, 7, 5, 3, 1];
const secaoDoCargo = (c: number) => D.secoes.find((s) => s.cargoCod === c)!;
const perguntasDoCargo = (c: number) => [...D.secoes[0].perguntas, ...secaoDoCargo(c).perguntas].map((p) => p.id);
const textoPergunta = (id: string) => D.secoes.flatMap((s) => s.perguntas).find((p) => p.id === id)?.texto ?? id;
const rotuloEscala = (v: number) => D.escala[String(v)] ?? String(v);
const ROTULO_CURTO: Record<number, string> = { 1: "Discordo total.", 2: "Discordo", 3: "Neutro", 4: "Concordo", 5: "Concordo total." };
const rotuloConf: Record<string, string> = { voto: "voto registrado", declaracao: "declaração", partido: "posição do partido" };

// ---------- Importância ----------
function alternarImportante(q: string) {
  importantes = importantes.includes(q) ? importantes.filter((x) => x !== q) : [...importantes, q];
  guardar();
}
function textoContagem() {
  const n = importantes.length;
  if (n > MAX_IMPORTANTES) return `${n} marcadas: na revisão final, fique com até ${MAX_IMPORTANTES}`;
  return `${n} de ${MAX_IMPORTANTES} marcadas`;
}
function botaoImportante(q: string, aoMudar: () => void) {
  const on = importantes.includes(q);
  return h("button", {
    class: "toggle-imp", "aria-pressed": on ? "true" : "false",
    onclick: (e: Event) => { e.stopPropagation(); alternarImportante(q); aoMudar(); },
  }, on ? "★ Muito importante" : "☆ Muito importante pra mim");
}

// ---------- Telas ----------
function telaInicio() {
  const total = ordemPerguntas.length;
  const respondidas = Object.keys(respostas).length;
  const data = new Date(D.geradoEm).toLocaleDateString("pt-BR");
  render(
    h("div", { class: "screen" },
      h("span", { class: "kicker", text: `Eleições 2026 · ${D.estado} · 4 de outubro` }),
      h("h1", { text: "Match Eleitoral" }),
    ),
    h("div", { class: "estado-atual" },
      h("span", {}, "Você vota em ", h("strong", { text: D.estado })),
      h("button", { class: "link-btn", onclick: () => telaEscolhaEstado() }, "Trocar estado")),
    h("p", { text: `Responda o que é importante para você e veja quais candidatos de ${D.estado} pensam parecido. Cada posição mostrada tem a fonte: um voto registrado ou uma declaração pública.` }),
    h("ol", { class: "passos" },
      h("li", {}, h("span", { class: "n", text: "1" }), h("div", {}, h("strong", { text: "Visão geral" }), h("p", { class: "muted small", text: `${D.secoes[0].perguntas.length} perguntas sobre valores e prioridades.` }))),
      h("li", {}, h("span", { class: "n", text: "2" }), h("div", {}, h("strong", { text: "Um bloco por cargo" }), h("p", { class: "muted small", text: "Antes das perguntas, uma explicação curta do que cada cargo faz. Dá para pular um cargo inteiro." }))),
      h("li", {}, h("span", { class: "n", text: "3" }), h("div", {}, h("strong", { text: "Revisão" }), h("p", { class: "muted small", text: `Você confere as respostas e escolhe até ${MAX_IMPORTANTES} temas que mais pesam para você.` }))),
      h("li", {}, h("span", { class: "n", text: "4" }), h("div", {}, h("strong", { text: "Seus matches" }), h("p", { class: "muted small", text: "Os candidatos mais próximos de você em cada cargo, com número, partido, redes sociais e a comparação pergunta por pergunta." }))),
    ),
    h("div", { class: "callout destaque-imp" },
      h("strong", { text: `★ Até ${MAX_IMPORTANTES} temas muito importantes` }),
      h("p", { class: "small", text: `Os temas que você marcar como muito importantes valem o dobro no cálculo. Marque a estrela antes de escolher a resposta. Pode marcar quantos quiser durante as perguntas; na revisão final você fica com até ${MAX_IMPORTANTES}.` }),
    ),
    h("div", { class: "stack" },
      respondidas > 0 && idx < passos.length
        ? h("div", { class: "row" },
            h("button", { class: "key key-confirma", onclick: () => ir("#/perguntas") }, `Continuar (${respondidas} de ${total})`),
            h("button", { class: "key key-corrige", onclick: recomecar }, "Recomeçar"))
        : respondidas > 0
          ? h("div", { class: "row" },
              h("button", { class: "key key-confirma", onclick: () => ir("#/revisao") }, "Revisar e ver matches"),
              h("button", { class: "key key-corrige", onclick: recomecar }, "Recomeçar"))
          : h("button", { class: "key key-confirma", onclick: () => { idx = 0; ir("#/perguntas"); } }, "Começar"),
      h("p", { class: "muted small", text: `São ${total} perguntas, uns 8 minutos. Qualquer uma pode ser pulada.` }),
    ),
    h("p", { class: "nota-privacidade small" },
      "Nada do que você responde sai do seu aparelho: o cálculo é feito no seu navegador. Isto não é pesquisa eleitoral nem enquete, e nenhuma resposta é guardada ou somada."),
    rodape(data),
  );
}

function rodape(data?: string) {
  return h("footer", { class: "rodape" },
    h("p", {}, "Ferramenta independente, sem ligação com partidos ou candidatos. ",
      h("a", { href: "#/metodologia", text: "Como funciona e de onde vêm os dados" }), " · ",
      h("a", { href: "#/candidatos", text: "Biblioteca de candidatos" }), "."),
    h("p", { text: `Candidaturas e redes sociais: TSE, dados de ${data ?? new Date(D.geradoEm).toLocaleDateString("pt-BR")}.` }),
    h("p", {}, "Código aberto e método no ",
      h("a", { href: REPO, target: "_blank", rel: "noopener noreferrer", text: "GitHub" }),
      ". Achou uma posição errada? ",
      h("a", { href: `${REPO}/issues`, target: "_blank", rel: "noopener noreferrer", text: "Reporte aqui" }),
      ", com a fonte."),
  );
}

function recomecar() {
  respostas = {}; importantes = []; idx = 0; cola = {}; compartilhado = false;
  guardar();
  ir("#/perguntas");
}

function blocoDetalhes(d?: Detalhes) {
  if (!d || (!d.situacao && !d.aFavor?.length && !d.contra?.length)) return null;
  const fontes = (d.fontes ?? []).map(urlSegura).filter(Boolean) as string[];
  return h("details", { class: "mais-detalhes" },
    h("summary", { text: "Mais detalhes" }),
    h("div", { class: "stack" },
      d.situacao && h("div", {}, h("h3", { class: "det-h", text: "Situação atual" }), h("p", { text: d.situacao })),
      h("div", { class: "argumentos" },
        (d.aFavor?.length ?? 0) > 0 && h("div", {}, h("h3", { class: "det-h", text: "Quem concorda argumenta" }), h("ul", {}, d.aFavor!.map((a) => h("li", { text: a })))),
        (d.contra?.length ?? 0) > 0 && h("div", {}, h("h3", { class: "det-h", text: "Quem discorda argumenta" }), h("ul", {}, d.contra!.map((a) => h("li", { text: a })))),
      ),
      fontes.length > 0 && h("p", { class: "fontes small" }, "Fontes: ",
        fontes.flatMap((u, i) => [i > 0 ? " · " : "", h("a", { href: u, target: "_blank", rel: "noopener noreferrer", text: dominio(u) })])),
    ),
  );
}

function telaPerguntas() {
  if (idx >= passos.length) { ir("#/revisao"); return; }
  const passo = passos[idx];
  const nPergunta = passos.slice(0, idx + 1).filter((p) => p.tipo === "pergunta").length;
  const secoes = D.secoes.length;
  const iSecao = D.secoes.indexOf(passo.secao) + 1;
  const topo = h("div", { class: "topo" },
    h("div", { class: "row" },
      h("button", { class: "link-btn", onclick: voltar, "aria-label": "Voltar" }, "← Voltar"),
      h("span", { class: "chip", text: `${passo.secao.titulo} · ${iSecao}/${secoes}` }),
      h("span", { class: "kicker", text: `${nPergunta}/${ordemPerguntas.length}` }),
    ),
    h("div", { class: "trilha", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": ordemPerguntas.length, "aria-valuenow": nPergunta },
      h("div", { style: `width:${(100 * nPergunta) / ordemPerguntas.length}%` })),
  );

  if (passo.tipo === "secao") {
    const s = passo.secao;
    const ehGeral = s.cargoCod === null;
    render(topo, h("section", { class: "cargo-box" },
      h("span", { class: "kicker", text: ehGeral ? "Primeiro bloco" : `Cargo · você escolhe ${s.vagas === 2 ? "2" : "1"}` }),
      h("h2", { text: ehGeral ? "Visão geral" : `O que faz um ${s.titulo.split(" de ")[0].toLowerCase()}?` }),
      h("p", { text: s.descricao }),
      s.votoProporcional && h("p", { class: "callout", text: s.votoProporcional }),
      h("p", { class: "muted small", text: `${s.perguntas.length} perguntas neste bloco.` }),
      h("div", { class: "row" },
        h("button", { class: "key key-confirma", onclick: avancar }, "Continuar"),
        !ehGeral && h("button", { class: "link-btn", onclick: pularSecao }, "Pular este cargo")),
    ));
    return;
  }

  const p = passo.p;
  const r = respostas[p.id];
  const contagem = h("span", { class: "contagem-imp small", "aria-live": "polite", text: textoContagem() });
  const estrela = () => botaoImportante(p.id, () => {
    estrelaSlot.replaceChildren(estrela());
    contagem.textContent = textoContagem();
    contagem.classList.toggle("excedido", importantes.length > MAX_IMPORTANTES);
  });
  const estrelaSlot = h("span", {}, estrela());
  contagem.classList.toggle("excedido", importantes.length > MAX_IMPORTANTES);

  const cartao = h("article", { class: "cartao", "aria-labelledby": "enunciado" },
    h("span", { class: "kicker", text: passo.secao.cargoCod ? `Pergunta sobre ${passo.secao.titulo.toLowerCase()}` : "Visão geral" }),
    h("h2", { id: "enunciado", text: p.texto }),
    p.contexto && h("p", { class: "contexto", text: p.contexto }),
    blocoDetalhes(p.detalhes),
    h("div", { class: "linha-imp" }, estrelaSlot, contagem),
    h("div", { class: "opcoes", role: "group", "aria-label": "Sua opinião" },
      [5, 4, 3, 2, 1].map((v) => h("button", {
        class: "opcao", "aria-pressed": r?.v === v ? "true" : "false",
        onclick: () => responder(p.id, v),
      }, h("span", { class: "d", text: String(v), "aria-hidden": "true" }), rotuloEscala(v)))),
    h("div", { class: "acoes-pergunta" },
      h("span", {}),
      h("button", { class: "link-btn", onclick: () => { delete respostas[p.id]; avancar(); } }, "Pular pergunta"),
    ),
  );
  ativarArrasto(cartao, p.id);
  render(topo, cartao, h("p", { class: "dica", text: "Dica: deslize o cartão para a direita para concordar ou para a esquerda para discordar." }));
}

function ativarArrasto(el: HTMLElement, q: string) {
  let x0 = 0, dx = 0, ativo = false;
  el.addEventListener("pointerdown", (e) => {
    if ((e.target as HTMLElement).closest("button,summary,a,details")) return;
    ativo = true; x0 = e.clientX; dx = 0; el.classList.add("arrastando"); el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove", (e) => {
    if (!ativo) return;
    dx = e.clientX - x0;
    el.style.transform = `translateX(${dx}px) rotate(${dx / 30}deg)`;
  });
  const soltar = () => {
    if (!ativo) return;
    ativo = false; el.classList.remove("arrastando");
    if (Math.abs(dx) > 90) {
      el.style.transform = `translateX(${Math.sign(dx) * 600}px) rotate(${Math.sign(dx) * 20}deg)`;
      el.style.opacity = "0";
      setTimeout(() => responder(q, dx > 0 ? 4 : 2, true), 180);
    } else el.style.transform = "";
  };
  el.addEventListener("pointerup", soltar);
  el.addEventListener("pointercancel", soltar);
}

function responder(q: string, v: number, imediato = false) {
  respostas[q] = { v };
  guardar();
  if (imediato) { avancar(); return; }
  document.querySelectorAll<HTMLButtonElement>(".opcao").forEach((b, i) => b.setAttribute("aria-pressed", String(5 - i === v)));
  setTimeout(avancar, 160);
}
function avancar() { idx = Math.min(idx + 1, passos.length); guardar(); telaPerguntas(); window.scrollTo(0, 0); }
function voltar() { if (idx === 0) { ir("#/"); return; } idx--; guardar(); telaPerguntas(); }
function pularSecao() {
  const atual = passos[idx].secao;
  let j = idx + 1;
  while (j < passos.length && passos[j].secao === atual) { const p = passos[j]; if (p.tipo === "pergunta") delete respostas[p.p.id]; j++; }
  idx = j; guardar(); telaPerguntas(); window.scrollTo(0, 0);
}

// ---------- Revisão ----------
function telaRevisao(rolarTopo = true) {
  const y = window.scrollY;
  const n = importantes.length;
  const excedido = n > MAX_IMPORTANTES;
  const respondidas = Object.keys(respostas).length;
  const redesenhar = () => telaRevisao(false);

  const secoes = D.secoes.map((s) => h("section", { class: "rev-secao" },
    h("h2", { class: "rev-h", text: s.titulo }),
    s.perguntas.map((p) => {
      const r = respostas[p.id];
      const on = importantes.includes(p.id);
      return h("div", { class: "rev-item" + (on ? " marcado" : "") },
        h("p", { class: "rev-q", text: p.texto }),
        h("div", { class: "rev-controles" },
          h("div", { class: "rev-escala", role: "group", "aria-label": `Resposta para: ${p.texto}` },
            [1, 2, 3, 4, 5].map((v) => h("button", {
              class: "rev-op", "aria-pressed": r?.v === v ? "true" : "false", title: rotuloEscala(v),
              onclick: () => { if (r?.v === v) delete respostas[p.id]; else respostas[p.id] = { v }; guardar(); redesenhar(); },
            }, ROTULO_CURTO[v]))),
          h("button", {
            class: "rev-estrela", "aria-pressed": on ? "true" : "false", "aria-label": on ? "Desmarcar como muito importante" : "Marcar como muito importante",
            onclick: () => { alternarImportante(p.id); redesenhar(); },
          }, on ? "★" : "☆"),
        ),
        !r && h("p", { class: "muted small", text: on ? "Sem resposta: marque uma opção para esta estrela contar." : "Pulada. Toque numa opção para responder." }),
      );
    }),
  ));

  render(
    h("div", { class: "stack" },
      h("span", { class: "kicker", text: "Última etapa" }),
      h("h1", { text: "Revise suas respostas" }),
      h("p", { class: "muted", text: `Confira o que você respondeu (${respondidas} de ${ordemPerguntas.length}). Toque numa opção para mudar a resposta, ou na mesma opção para deixar em branco. Depois escolha até ${MAX_IMPORTANTES} temas que mais pesam para você: eles valem o dobro no cálculo.` }),
    ),
    h("div", { class: "contador-imp" + (excedido ? " excedido" : ""), role: "status", "aria-live": "polite" },
      h("strong", { text: `★ ${n} de ${MAX_IMPORTANTES}` }),
      h("span", { text: excedido ? ` Desmarque ${n - MAX_IMPORTANTES} para continuar.` : n === 0 ? " Nenhum tema marcado como muito importante. Tudo bem, é opcional." : " temas muito importantes." }),
    ),
    ...secoes,
    h("div", { class: "barra-inf" }, h("div", { class: "in" },
      h("button", { class: "key key-branco", onclick: () => { idx = Math.max(0, passos.length - 1); ir("#/perguntas"); } }, "Voltar às perguntas"),
      h("button", {
        class: "key key-confirma", disabled: excedido || respondidas === 0,
        onclick: () => { expandidos.clear(); ir("#/resultado"); },
      }, excedido ? `Máximo de ${MAX_IMPORTANTES} ★` : "Ver meus matches"),
    )),
  );
  if (rolarTopo) window.scrollTo(0, 0); else window.scrollTo(0, y);
}

// ---------- Resultados ----------
function resultadosDoCargo(c: number) {
  const qs = perguntasDoCargo(c);
  const resp = respostasEfetivas();
  const itens = D.candidatos.filter((x) => x.cargoCod === c).map((cand) => ({ cand, res: calcularMatch(resp, cand.posicoes, qs) }));
  return ranquear(itens, semente);
}

function cartaoCandidato(cand: Candidato, res: Resultado, chave: string, posicao?: number) {
  const c = cand.cargoCod;
  const limite = c === 5 ? 2 : 1;
  const escolhidos = cola[c] ?? [];
  const escolhido = escolhidos.includes(cand.id);
  const abertoComp = expandidos.has("comp:" + chave);
  const vice = cand.vices.filter((v) => v.nome);
  const situacaoAlerta = !cand.situacao.startsWith("Deferido")
    ? h("p", { class: "evid limitado", text: `Situação da candidatura no TSE: ${cand.situacao}.` }) : null;

  const comp = abertoComp ? h("div", { class: "comparacao" },
    res.detalhes.length === 0
      ? h("p", { class: "muted small", text: "Não encontramos posições públicas deste candidato nas perguntas que você respondeu." })
      : [...res.detalhes].sort((a, b) => b.peso - a.peso || a.acordo - b.acordo).map((d) => {
          const pos = cand.posicoes[d.q];
          const fonte = urlSegura(pos.fonte);
          return h("div", { class: "comp-item" },
            h("span", { class: "q", text: (importantes.includes(d.q) ? "★ " : "") + textoPergunta(d.q) }),
            h("div", { class: "lado" },
              h("span", { text: `Você: ${rotuloEscala(d.u)}` }),
              h("span", { class: d.acordo >= 0.75 ? "ac-alto" : d.acordo <= 0.25 ? "ac-baixo" : "", text: `${nomeBonito(cand.nomeUrna)}: ${rotuloEscala(d.c)}` }),
              h("span", { class: "tag-conf", text: rotuloConf[d.conf] })),
            pos.nota && h("span", { class: "fonte" }, pos.nota, fonte ? " " : "", fonte && h("a", { href: fonte, target: "_blank", rel: "noopener noreferrer", text: "Ver fonte" })),
          );
        }),
  ) : null;

  return h("article", { class: "cand" + (escolhido ? " escolhido" : "") },
    cand.foto ? h("img", { class: "foto", src: cand.foto, alt: `Foto de ${nomeBonito(cand.nomeUrna)}`, loading: "lazy", width: 110, height: 146 }) : h("div", { class: "foto" }),
    h("div", { class: "corpo" },
      h("div", {},
        posicao !== undefined && h("span", { class: "kicker", text: `${posicao}º no seu match` }),
        h("div", { class: "nome", text: nomeBonito(cand.nomeUrna) }),
        h("div", { class: "muted small", text: [cand.partido, cand.coligacao && cand.coligacao !== cand.partido ? cand.coligacao : null].filter(Boolean).join(" · ") }),
      ),
      numeroBox(cand.numero),
      h("div", { class: "match" },
        h("span", { class: "pct", text: `${res.pct}%` }),
        h("div", { class: "barra", "aria-hidden": "true" }, h("div", { style: `width:${res.pct}%` }))),
      h("p", { class: "evid" + (res.dadosLimitados ? " limitado" : "") },
        res.n === 0
          ? "Sem posições públicas encontradas nas perguntas que você respondeu."
          : `Baseado em ${res.n} das suas ${res.nRespondidas} respostas, ${res.nIndividual} com posição do próprio candidato.`
            + (res.dadosLimitados ? " Poucas posições individuais: resultado menos confiável." : "")),
      situacaoAlerta,
      cand.resumo && h("p", { class: "small", text: cand.resumo }),
      vice.length > 0 && h("p", { class: "muted small", text: vice.map((v) => `${v.cargo}: ${nomeBonito(v.nome)} (${v.partido})`).join(" · ") }),
      cand.bandeiras.length > 0 && h("div", { class: "bandeiras" }, cand.bandeiras.map((b) => h("span", { text: b }))),
      cand.redes.length > 0 && h("div", { class: "redes" }, cand.redes.map((r) => urlSegura(r.url) && h("a", { href: r.url, target: "_blank", rel: "noopener noreferrer", "aria-label": r.tipo }, icone(r.tipo), r.tipo))),
    ),
    h("div", { class: "acoes" },
      h("button", { class: "btn-sec", "aria-expanded": abertoComp ? "true" : "false", onclick: () => { alternar("comp:" + chave); } }, abertoComp ? "Fechar comparação" : "Comparar posições"),
      !compartilhado && h("button", {
        class: "btn-sec", "aria-pressed": escolhido ? "true" : "false",
        onclick: () => {
          const atual = cola[c] ?? [];
          if (escolhido) cola[c] = atual.filter((x) => x !== cand.id);
          else if (atual.length >= limite) cola[c] = limite === 1 ? [cand.id] : [...atual.slice(1), cand.id];
          else cola[c] = [...atual, cand.id];
          guardar(); telaResultado(false);
          toast(escolhido ? "Removido da cola" : `Na sua cola: ${nomeBonito(cand.nomeUrna)} (${cand.numero})`);
        },
      }, escolhido ? "✓ Na minha cola" : "Pôr na minha cola"),
    ),
    comp,
  );
}

function alternar(chave: string) {
  if (expandidos.has(chave)) expandidos.delete(chave); else expandidos.add(chave);
  telaResultado(false);
}

function linhaCandidato(cand: Candidato, res: Resultado, posicao: number) {
  const k = "linha:" + cand.id;
  return [
    h("button", { class: "linha", "aria-expanded": expandidos.has(k) ? "true" : "false", onclick: () => alternar(k) },
      cand.foto ? h("img", { src: cand.foto, alt: "", loading: "lazy" }) : h("span", {}),
      h("span", {}, h("strong", { text: `${posicao}. ${nomeBonito(cand.nomeUrna)}` }), h("br"), h("span", { class: "muted small", text: `${cand.numero} · ${cand.partido}${res.dadosLimitados ? " · poucos dados" : ""}` })),
      h("span", { class: "pct", text: `${res.pct}%` })),
    expandidos.has(k) && cartaoCandidato(cand, res, `lista:${cand.id}`, posicao),
  ];
}

function telaResultado(rolarTopo = true) {
  if (importantes.length > MAX_IMPORTANTES && !compartilhado) { ir("#/revisao"); return; }
  const y = window.scrollY;
  const respondidas = Object.keys(respostas).length;
  const blocos = [1, 3, 5, 6, 7].map((c) => {
    const s = secaoDoCargo(c);
    const ranking = resultadosDoCargo(c);
    const nTop = s.mostrar ?? 2;
    const top = ranking.slice(0, nTop);
    const ate = PROXIMOS_ATE[c] ?? nTop;
    const abertoProx = expandidos.has("prox:" + c);
    const abertoLista = expandidos.has("todos:" + c);
    const proximos = ranking.slice(nTop, ate);

    return h("section", { class: "bloco-cargo", id: `cargo-${c}` },
      h("header", {},
        h("h2", { text: c === 5 ? "Senado (2 vagas)" : s.titulo }),
        h("p", { class: "muted small", text: `${ranking.length} candidatos${c >= 6 ? " considerados (os viáveis: veja a metodologia)" : ""}.` + (c === 5 ? " Você vota em dois, de partidos iguais ou diferentes." : "") }),
      ),
      top.map(({ cand, res }, i) => cartaoCandidato(cand, res, `top:${cand.id}`, i + 1)),

      // Botão para os próximos colocados e, se quiser, a lista inteira.
      proximos.length > 0 && (abertoProx
        ? h("div", { class: "stack" },
            h("h3", { class: "sub-h", text: "Próximos colocados" }),
            proximos.map(({ cand, res }, i) => cartaoCandidato(cand, res, `prox:${cand.id}`, nTop + i + 1)),
            h("button", { class: "btn-sec", onclick: () => alternar("prox:" + c) }, "Esconder os próximos colocados"))
        : h("button", { class: "btn-sec btn-prox", onclick: () => alternar("prox:" + c) }, `Ver os próximos colocados (até o ${ate}º)`)),
      ranking.length > ate && h("button", { class: "link-btn", "aria-expanded": abertoLista ? "true" : "false", onclick: () => alternar("todos:" + c) },
        abertoLista ? "Esconder a lista completa" : `Ver a lista completa (${ranking.length})`),
      abertoLista && h("div", { class: "lista-todos" }, ranking.flatMap(({ cand, res }, i) => linhaCandidato(cand, res, i + 1))),
    );
  });

  const nCola = Object.values(cola).reduce((n, a) => n + a.length, 0);
  const marcadas = importantes.filter((q) => respostas[q]);
  render(
    h("div", { class: "stack" },
      h("span", { class: "kicker", text: compartilhado ? `Resultado compartilhado · ${D.estado}` : `Eleições 2026 · ${D.estado}` }),
      h("h1", { text: compartilhado ? "Matches compartilhados" : "Seus matches" }),
      h("p", { class: "muted", text: `Com base em ${respondidas} de ${ordemPerguntas.length} respostas. A porcentagem mostra o quanto as posições públicas de cada candidato se aproximam das suas. Use como ponto de partida para conhecer os candidatos, não como indicação de voto.` }),
      marcadas.length > 0 && h("div", { class: "callout small" },
        h("strong", { text: "★ Valendo o dobro:" }), h("ul", { class: "lista-imp" }, marcadas.map((q) => h("li", { text: textoPergunta(q) })))),
      compartilhado && h("button", { class: "key key-confirma", onclick: () => { compartilhado = false; carregar(); ir("#/"); } }, "Fazer o meu"),
    ),
    h("nav", { class: "nav-cargos", "aria-label": "Cargos" },
      [1, 3, 5, 6, 7].map((c) => h("a", { href: `#cargo-${c}`, onclick: (e: Event) => { e.preventDefault(); document.getElementById(`cargo-${c}`)?.scrollIntoView({ behavior: "smooth" }); }, text: c === 5 ? "Senado" : secaoDoCargo(c).titulo.split(" de ")[0] }))),
    ...blocos,
    h("section", { class: "cargo-box" },
      h("h2", { text: "Quer ver todos os candidatos?" }),
      h("p", { class: "muted", text: "Na biblioteca estão todos os dados que levantamos de cada candidato, separados por cargo, com busca por nome e filtro por partido." }),
      h("button", { class: "key key-ink", onclick: () => ir("#/candidatos") }, "Abrir a biblioteca de candidatos"),
    ),
    rodape(),
    h("div", { class: "barra-inf" }, h("div", { class: "in" },
      !compartilhado && h("button", { class: "key key-confirma", onclick: () => ir("#/cola") }, `Minha cola (${nCola})`),
      h("button", { class: "key key-branco", onclick: compartilhar }, "Compartilhar"),
      !compartilhado && h("button", { class: "key key-corrige", onclick: () => ir("#/revisao") }, "Rever respostas"),
    )),
  );
  if (rolarTopo) window.scrollTo(0, 0); else window.scrollTo(0, y);
}

async function compartilhar() {
  const url = `${location.origin}/#/r/${D.uf.toLowerCase()}/${codificar(respostasEfetivas(), ordemPerguntas)}`;
  const texto = `Fiz o Match Eleitoral (${D.estado}) e vi quais candidatos pensam parecido comigo. Veja os meus matches ou faça o seu:`;
  if (navigator.share) {
    try { await navigator.share({ title: "Match Eleitoral", text: texto, url }); return; } catch { /* cancelado */ }
  }
  try { await navigator.clipboard.writeText(`${texto} ${url}`); toast("Link copiado. Suas respostas vão no link: compartilhe só com quem quiser."); }
  catch { prompt("Copie o link:", url); }
}

// ---------- Biblioteca de candidatos ----------
const filtroBib = { cargo: 0, q: "", partido: "" };
const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const urlTSE = (c: Candidato) =>
  `https://divulgacandcontas.tse.jus.br/divulga/#/candidato/2026/20322002026/${c.cargoCod === 1 ? "BR" : D.uf}/${c.id}`;

function fichaCandidato(cand: Candidato) {
  const qs = perguntasDoCargo(cand.cargoCod);
  const comPos = qs.filter((q) => cand.posicoes[q]);
  const semPos = qs.filter((q) => !cand.posicoes[q]);
  const nInd = comPos.filter((q) => cand.posicoes[q].conf !== "partido").length;
  const vice = cand.vices.filter((v) => v.nome);
  const secoes = [D.secoes[0], secaoDoCargo(cand.cargoCod)];
  return h("article", { class: "ficha" },
    h("div", { class: "ficha-topo" },
      cand.foto ? h("img", { class: "foto", src: cand.foto, alt: `Foto de ${nomeBonito(cand.nomeUrna)}`, loading: "lazy", width: 110, height: 146 }) : h("div", { class: "foto" }),
      h("div", { class: "corpo" },
        h("span", { class: "kicker", text: cargoNome[cand.cargoCod] }),
        h("div", { class: "nome", text: nomeBonito(cand.nomeUrna) }),
        h("div", { class: "muted small", text: nomeBonito(cand.nomeCompleto || cand.nomeUrna) }),
        numeroBox(cand.numero),
        h("div", { class: "small", text: [cand.partidoNome ? `${cand.partido} (${nomeBonito(cand.partidoNome)})` : cand.partido].join("") }),
        cand.coligacao && h("div", { class: "muted small", text: `Coligação ${cand.coligacao}${cand.composicao ? `: ${cand.composicao}` : ""}` }),
      ),
    ),
    !cand.situacao.startsWith("Deferido") && h("p", { class: "evid limitado", text: `Situação da candidatura no TSE: ${cand.situacao}.` }),
    cand.resumo && h("p", { text: cand.resumo }),
    h("dl", { class: "dados" },
      cand.ocupacao && [h("dt", { text: "Ocupação declarada" }), h("dd", { text: nomeBonito(cand.ocupacao) })],
      cand.idade ? [h("dt", { text: "Idade na eleição" }), h("dd", { text: `${cand.idade} anos` })] : null,
      vice.length > 0 && [h("dt", { text: cand.cargoCod === 5 ? "Suplentes" : "Vice" }), h("dd", { text: vice.map((v) => `${nomeBonito(v.nome)} (${v.partido})`).join(", ") })],
      cand.anteriores.length > 0 && [h("dt", { text: "Eleições anteriores" }), h("dd", {}, h("ul", { class: "hist" }, cand.anteriores.map((a) => h("li", { text: `${a.ano} · ${a.cargo} · ${a.partido} · ${a.resultado}` }))))],
    ),
    cand.bandeiras.length > 0 && h("div", { class: "bandeiras" }, cand.bandeiras.map((b) => h("span", { text: b }))),
    h("div", { class: "redes" },
      cand.redes.map((r) => urlSegura(r.url) && h("a", { href: r.url, target: "_blank", rel: "noopener noreferrer", "aria-label": r.tipo }, icone(r.tipo), r.tipo)),
      h("a", { href: urlTSE(cand), target: "_blank", rel: "noopener noreferrer" }, icone("TSE"), "Página no TSE")),
    h("h3", { class: "sub-h", text: `Posições: ${comPos.length} de ${qs.length} perguntas (${nInd} do próprio candidato)` }),
    secoes.map((s) => {
      const itens = s.perguntas.filter((p) => cand.posicoes[p.id]);
      if (!itens.length) return null;
      return h("div", { class: "stack" },
        h("span", { class: "kicker", text: s.titulo }),
        itens.map((p) => {
          const pos = cand.posicoes[p.id];
          const fonte = urlSegura(pos.fonte);
          return h("div", { class: "comp-item" },
            h("span", { class: "q", text: p.texto }),
            h("div", { class: "lado" }, h("span", { text: rotuloEscala(pos.v) }), h("span", { class: "tag-conf", text: rotuloConf[pos.conf] })),
            pos.nota && h("span", { class: "fonte" }, pos.nota, fonte ? " " : "", fonte && h("a", { href: fonte, target: "_blank", rel: "noopener noreferrer", text: "Ver fonte" })),
          );
        }),
      );
    }),
    semPos.length > 0 && h("details", { class: "sem-pos" },
      h("summary", { text: `Sem posição encontrada em ${semPos.length} perguntas` }),
      h("ul", {}, semPos.map((q) => h("li", { text: textoPergunta(q) })))),
  );
}

function telaBiblioteca() {
  const lista = h("div", { class: "lista-todos", "aria-live": "polite" });
  const contagem = h("p", { class: "muted small" });
  const selPartido = h("select", { id: "bib-partido", "aria-label": "Filtrar por partido" }) as HTMLSelectElement;
  const busca = h("input", { id: "bib-busca", type: "search", placeholder: "Buscar por nome ou número", autocomplete: "off", "aria-label": "Buscar candidato por nome ou número" }) as HTMLInputElement;
  busca.value = filtroBib.q;

  const doCargo = () => D.candidatos.filter((c) => !filtroBib.cargo || c.cargoCod === filtroBib.cargo);
  const opcoesPartido = () => {
    const ps = [...new Set(doCargo().map((c) => c.partido))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    if (filtroBib.partido && !ps.includes(filtroBib.partido)) filtroBib.partido = "";
    selPartido.replaceChildren(h("option", { value: "", text: "Todos os partidos" }), ...ps.map((p) => h("option", { value: p, text: p })));
    selPartido.value = filtroBib.partido;
  };
  const desenharLista = () => {
    const termo = semAcento(filtroBib.q.trim());
    const itens = doCargo()
      .filter((c) => !filtroBib.partido || c.partido === filtroBib.partido)
      .filter((c) => !termo || semAcento(`${c.nomeUrna} ${c.nomeCompleto ?? ""}`).includes(termo) || String(c.numero).startsWith(termo))
      .sort((a, b) => a.cargoCod - b.cargoCod || a.nomeUrna.localeCompare(b.nomeUrna, "pt-BR"));
    contagem.textContent = `${itens.length} candidato${itens.length === 1 ? "" : "s"}`;
    lista.replaceChildren(...(itens.length ? itens.flatMap((c) => {
      const k = "bib:" + c.id;
      const aberto = expandidos.has(k);
      const nInd = Object.values(c.posicoes).filter((p) => p.conf !== "partido").length;
      return [
        h("button", { class: "linha", "aria-expanded": aberto ? "true" : "false", onclick: () => { if (aberto) expandidos.delete(k); else expandidos.add(k); desenharLista(); } },
          c.foto ? h("img", { src: c.foto, alt: "", loading: "lazy" }) : h("span", {}),
          h("span", {}, h("strong", { text: nomeBonito(c.nomeUrna) }), h("br"),
            h("span", { class: "muted small", text: `${cargoNome[c.cargoCod]} · ${c.numero} · ${c.partido}` })),
          h("span", { class: "muted small", text: `${nInd} posições` })),
        aberto ? fichaCandidato(c) : null,
      ].filter((x): x is HTMLElement => x !== null);
    }) : [h("p", { class: "vazio-bib", text: "Nenhum candidato encontrado com esses filtros." })]));
  };

  busca.addEventListener("input", () => { filtroBib.q = busca.value; desenharLista(); });
  selPartido.addEventListener("change", () => { filtroBib.partido = selPartido.value; desenharLista(); });
  const abas = h("div", { class: "nav-cargos abas", role: "tablist", "aria-label": "Cargo" },
    [[0, "Todos"], [1, "Presidente"], [3, "Governador"], [5, "Senado"], [6, "Dep. federal"], [7, "Dep. estadual"]].map(([c, t]) =>
      h("button", {
        role: "tab", "aria-selected": filtroBib.cargo === c ? "true" : "false", class: "aba",
        onclick: () => { filtroBib.cargo = c as number; telaBiblioteca(); },
      }, `${t} (${c ? D.candidatos.filter((x) => x.cargoCod === c).length : D.candidatos.length})`)));

  opcoesPartido();
  render(
    h("div", { class: "stack" },
      h("button", { class: "link-btn", onclick: () => history.length > 1 ? history.back() : ir("#/") }, "← Voltar"),
      h("span", { class: "kicker", text: `Eleições 2026 · ${D.estado}` }),
      h("h1", { text: "Biblioteca de candidatos" }),
      h("p", { class: "muted", text: "Todos os dados que levantamos de cada candidato: número, partido, histórico, redes sociais e as posições encontradas, com a fonte de cada uma. Para deputados, só os candidatos considerados viáveis (veja a metodologia)." }),
    ),
    abas,
    h("div", { class: "filtros" }, busca, selPartido),
    contagem,
    lista,
    rodape(),
  );
  desenharLista();
  window.scrollTo(0, 0);
}

// ---------- Cola ----------
function telaCola() {
  const linhas: { cargo: string; cand?: Candidato }[] = [];
  for (const c of ordemUrna) {
    const ids = cola[c] ?? [];
    if (c === 5) {
      linhas.push({ cargo: "Senador (1º voto)", cand: D.candidatos.find((x) => x.id === ids[0]) });
      linhas.push({ cargo: "Senador (2º voto)", cand: D.candidatos.find((x) => x.id === ids[1]) });
    } else linhas.push({ cargo: cargoNome[c], cand: D.candidatos.find((x) => x.id === ids[0]) });
  }
  const texto = [`Minha cola - Eleições 2026 (${D.uf}), 1º turno em 4/10`, ...linhas.map((l) => `${l.cargo}: ${l.cand ? `${l.cand.numero} - ${nomeBonito(l.cand.nomeUrna)} (${l.cand.partido})` : "(a decidir)"}`)].join("\n");
  render(
    h("div", { class: "stack" },
      h("span", { class: "kicker", text: "Na ordem em que aparecem na urna" }),
      h("h1", { text: "Minha cola" }),
      h("p", { class: "muted", text: "Os números que você separou nos resultados. Você pode mudar quando quiser." }),
    ),
    h("div", { class: "cola" }, linhas.map((l) => h("div", { class: "item" },
      h("span", { class: "cargo", text: l.cargo }),
      l.cand ? h("span", {}, h("strong", { text: nomeBonito(l.cand.nomeUrna) }), " ", h("span", { class: "small", text: l.cand.partido })) : h("span", { class: "vazio", text: "a decidir" }),
      l.cand ? numeroBox(l.cand.numero) : h("span", {}),
    ))),
    h("p", { class: "callout", text: "O celular não pode entrar na cabine de votação. Anote os números num papel e leve com você." }),
    h("div", { class: "barra-inf" }, h("div", { class: "in" },
      h("button", { class: "key key-branco", onclick: () => ir("#/resultado") }, "Voltar aos matches"),
      h("button", { class: "key key-confirma", onclick: async () => {
        try { await navigator.clipboard.writeText(texto); toast("Cola copiada"); } catch { prompt("Copie o texto:", texto); }
      } }, "Copiar texto"),
    )),
  );
  window.scrollTo(0, 0);
}

// ---------- Metodologia ----------
function telaMetodologia() {
  const data = new Date(D.geradoEm).toLocaleDateString("pt-BR");
  const conta = (conf: string) => D.candidatos.reduce((n, c) => n + Object.values(c.posicoes).filter((p) => p.conf === conf).length, 0);
  render(
    h("div", { class: "texto" },
      h("button", { class: "link-btn", onclick: () => history.length > 1 ? history.back() : ir("#/") }, "← Voltar"),
      h("h1", { text: "Como funciona" }),
      h("p", { text: `O Match Eleitoral compara as suas respostas com as posições públicas dos candidatos de ${D.estado} em 2026. É um ponto de partida para conhecer quem está concorrendo, não uma recomendação de voto.` }),
      h("h2", { text: "Quem aparece" }),
      h("ul", {},
        h("li", { text: "Presidente e governador: todos os candidatos com registro no TSE que ainda estão na disputa, inclusive os que aguardam julgamento de recurso (isso aparece no cartão)." }),
        h("li", { text: "Senado: todos os candidatos na disputa." }),
        h("li", { text: `Deputados: há ${ESTADOS[D.uf].inscritos} candidatos em ${D.estado}, e não é possível levantar a posição de todos com cuidado. Entram os que foram eleitos em 2022 para o mesmo cargo e os que mais receberam recursos de campanha até a véspera da coleta, segundo a prestação de contas no TSE: os ${ESTADOS[D.uf].topFed} maiores para deputado federal e os ${ESTADOS[D.uf].topEst} maiores para deputado estadual. Esse critério é objetivo e igual para todos os partidos, mas deixa de fora candidatos com campanhas menores.` }),
      ),
      h("h2", { text: "De onde vêm as posições" }),
      h("p", { text: "Para cada candidato e cada pergunta, a posição foi levantada com ajuda de inteligência artificial a partir de fontes públicas, seguindo um protocolo único para todos. Toda posição mostra o tipo de evidência e, quando existe, o link para a fonte:" }),
      h("ul", {},
        h("li", {}, h("strong", { text: "Voto registrado: " }), "como o candidato votou numa votação nominal diretamente ligada ao tema, na Câmara, no Senado ou na Assembleia. Quando a votação trata de algo mais estreito do que a afirmação (por exemplo, a venda da Copasa para a afirmação sobre privatizações em geral), o voto indica a direção, mas não a intensidade máxima."),
        h("li", {}, h("strong", { text: "Declaração: " }), "afirmação pública do próprio candidato, como entrevista, debate, plano de governo ou projeto de lei de sua autoria."),
        h("li", {}, h("strong", { text: "Posição do partido: " }), "quando não encontramos nada do próprio candidato, usamos a posição do partido, se ele for coeso no tema."),
      ),
      h("p", { text: "Quando não há evidência, a pergunta simplesmente não conta para aquele candidato. Nenhuma posição é deduzida de profissão, religião ou aparência." }),
      h("h2", { text: "Como o match é calculado" }),
      h("p", { text: `Em cada pergunta, a concordância vai de 100% (mesma resposta) a 0% (extremos opostos da escala). O match é a média dessas concordâncias. Os até ${MAX_IMPORTANTES} temas que você marca como muito importantes valem o dobro. Posições inferidas do partido valem metade, e somadas nunca pesam mais do que três posições do próprio candidato, para que quem não tem histórico não vire uma cópia perfeita do partido. Para que um candidato com poucas posições conhecidas não apareça com um número alto por acaso, o cálculo puxa o resultado para 50% quando há pouca informação, e candidatos com menos de cinco posições próprias são marcados. Empates são ordenados de forma aleatória.` }),
      h("h2", { text: "Privacidade e lei eleitoral" }),
      h("p", { text: "O cálculo roda inteiramente no seu navegador. Não há cadastro, e nenhuma resposta é enviada, guardada ou somada. Por isso isto não é pesquisa eleitoral nem enquete: a lei (Lei 9.504/97, art. 33, § 5º) proíbe enquetes durante a campanha, e aqui não existe nenhum resultado coletivo. Se você usar o botão Compartilhar, suas respostas vão codificadas no link, e só quem receber o link as vê." }),
      h("h2", { text: "Limitações" }),
      h("ul", {},
        h("li", { text: "As posições foram levantadas com IA e podem conter erros. Por isso cada uma traz a fonte: confira as que pesarem na sua decisão." }),
        h("li", { text: "Candidatos sem mandato costumam ter menos posições documentadas do que quem já votou em plenário." }),
        h("li", { text: "O questionário cobre só alguns temas. Candidatos também devem ser avaliados por histórico, competência e propostas que não cabem numa escala de concordância." }),
      ),
      h("p", { class: "muted small", text: `Dados atualizados em ${data}. Posições: ${conta("voto")} votos registrados, ${conta("declaracao")} declarações e ${conta("partido")} posições de partido, em ${D.candidatos.length} candidatos.` }),
    ),
  );
  window.scrollTo(0, 0);
}

// ---------- Estado ----------
function telaEscolhaEstado() {
  render(
    h("div", { class: "screen" },
      h("span", { class: "kicker", text: "Eleições 2026 · 1º turno em 4 de outubro" }),
      h("h1", { text: "Match Eleitoral" }),
    ),
    h("p", { text: "Responda o que é importante para você e veja quais candidatos pensam parecido, com a fonte de cada posição." }),
    h("h2", { text: "Onde você vota?" }),
    h("p", { class: "muted small", text: "Os candidatos a presidente são os mesmos em todo o país. Governador, Senado e deputados dependem do estado do seu título." }),
    h("div", { class: "estados" }, Object.entries(ESTADOS).map(([uf, e]) =>
      h("button", { class: "estado-btn" + (UF === uf ? " atual" : ""), onclick: () => escolherEstado(uf) },
        h("span", { class: "uf", text: uf }), h("span", { class: "nome", text: e.nome })))),
    h("p", { class: "nota-privacidade small" },
      "Nada do que você responde sai do seu aparelho: o cálculo é feito no seu navegador. Isto não é pesquisa eleitoral nem enquete, e nenhuma resposta é guardada ou somada."),
  );
  window.scrollTo(0, 0);
}

async function carregarEstado(uf: string) {
  const r = await fetch(`/data/${uf.toLowerCase()}.json`, { cache: "no-cache" });
  if (!r.ok) throw new Error(`dados de ${uf} indisponíveis`);
  D = await r.json();
  passos = [];
  for (const s of D.secoes) {
    passos.push({ tipo: "secao", secao: s });
    for (const p of s.perguntas) passos.push({ tipo: "pergunta", secao: s, p });
  }
  ordemPerguntas = D.secoes.flatMap((s) => s.perguntas.map((p) => p.id));
  // A cola só guarda candidatos do estado carregado (presidente vale para todos).
  const ids = new Set(D.candidatos.map((c) => c.id));
  for (const k of Object.keys(cola)) cola[k] = (cola[k] ?? []).filter((id) => ids.has(id));
  idx = Math.min(idx, passos.length);
}

async function escolherEstado(uf: string) {
  try { await carregarEstado(uf); } catch { toast("Não foi possível carregar os dados. Tente de novo."); return; }
  const trocou = UF !== null && UF !== uf;
  UF = uf;
  // Ao trocar de estado, as respostas gerais continuam; as perguntas do novo estado aparecem na revisão.
  if (trocou) idx = Object.keys(respostas).length ? passos.length : 0;
  guardar();
  expandidos.clear();
  ir("#/");
}

// ---------- Roteamento ----------
function ir(hash: string) {
  if (location.hash === hash) rotear(); else location.hash = hash;
}
async function rotear() {
  const hash = location.hash || "#/";
  if (hash.startsWith("#/r/")) {
    // #/r/<uf>/<código>; links antigos, sem estado, são de MG.
    const m = hash.match(/^#\/r\/(?:([a-z]{2})\/)?(.+)$/i);
    const uf = (m?.[1] ?? "mg").toUpperCase();
    if (!ESTADOS[uf]) { ir("#/"); return; }
    if (!D || D.uf !== uf) {
      try { await carregarEstado(uf); } catch { render(h("p", { text: "Não foi possível carregar os dados." })); return; }
    }
    compartilhado = true;
    const dec = decodificar(m?.[2] ?? "", ordemPerguntas);
    respostas = Object.fromEntries(Object.entries(dec).map(([q, r]) => [q, { v: r.v }]));
    importantes = Object.entries(dec).filter(([, r]) => r.imp).map(([q]) => q).slice(0, MAX_IMPORTANTES);
    telaResultado();
    return;
  }
  if (compartilhado) {
    compartilhado = false; carregar();
    if (UF && (!D || D.uf !== UF)) { try { await carregarEstado(UF); } catch { UF = null; } }
  }
  if (!D) { telaEscolhaEstado(); return; }
  if (hash === "#/perguntas") telaPerguntas();
  else if (hash === "#/revisao") telaRevisao();
  else if (hash === "#/resultado") telaResultado();
  else if (hash === "#/cola") telaCola();
  else if (hash === "#/metodologia") telaMetodologia();
  else if (hash === "#/candidatos") telaBiblioteca();
  else if (hash.startsWith("#cargo-")) return;
  else telaInicio();
  main().focus({ preventScroll: true });
}

document.addEventListener("keydown", (e) => {
  if (location.hash !== "#/perguntas" || e.metaKey || e.ctrlKey || e.altKey) return;
  const passo = passos[idx];
  if (!passo) return;
  if (passo.tipo === "pergunta" && /^[1-5]$/.test(e.key)) { responder(passo.p.id, Number(e.key)); e.preventDefault(); }
  else if (passo.tipo === "pergunta" && (e.key === "i" || e.key === "I")) { alternarImportante(passo.p.id); telaPerguntas(); e.preventDefault(); }
  else if (passo.tipo === "secao" && e.key === "Enter" && (e.target as HTMLElement).tagName !== "BUTTON") { avancar(); e.preventDefault(); }
});

async function iniciar() {
  carregar();
  try { UF = localStorage.getItem("me-uf"); } catch { UF = null; }
  // Quem já usava o app antes da escolha de estado respondeu sobre MG.
  if (!UF && Object.keys(respostas).length) UF = "MG";
  if (UF && ESTADOS[UF] && !location.hash.startsWith("#/r/")) {
    try { await carregarEstado(UF); } catch {
      render(h("p", { text: "Não foi possível carregar os dados. Verifique sua conexão e recarregue a página." }));
      return;
    }
  } else if (UF && !ESTADOS[UF]) UF = null;
  window.addEventListener("hashchange", () => { rotear(); });
  rotear();
}
iniciar();
