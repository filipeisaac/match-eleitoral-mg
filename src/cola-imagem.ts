// Gera a imagem da cola (PNG) no navegador, com canvas. Tema claro fixo, para imprimir bem.

export interface LinhaCola {
  cargo: string;
  digitos: number;
  cand?: { nome: string; partido: string; numero: number; foto: string | null };
}

const COR = {
  fundo: "#E9E6DE", cartao: "#F7F5F0", tinta: "#1C1F24", suave: "#5A5E5B", linha: "#CAC4B6",
  tela: "#EEF1E6", telaTinta: "#20261C", confirma: "#1F8A4C", corrige: "#D9731C",
};
const FONTE = {
  display: '"Archivo", system-ui, sans-serif',
  corpo: '"Atkinson Hyperlegible", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

const L = 1080;          // largura
const M = 64;            // margem lateral
const TOPO = 330;        // altura do cabeçalho
const ALT_LINHA = 214;   // altura de cada linha
const RODAPE = 170;

function retangulo(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function caber(ctx: CanvasRenderingContext2D, texto: string, largura: number) {
  if (ctx.measureText(texto).width <= largura) return texto;
  let t = texto;
  while (t.length > 1 && ctx.measureText(t + "…").width > largura) t = t.slice(0, -1);
  return t.trimEnd() + "…";
}

function carregarImagem(src: string): Promise<HTMLImageElement | null> {
  return new Promise((ok) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => ok(null);
    img.src = src;
  });
}

async function carregarFontes() {
  try {
    await Promise.all([
      document.fonts.load(`800 72px ${FONTE.display}`),
      document.fonts.load(`700 40px ${FONTE.display}`),
      document.fonts.load(`400 28px ${FONTE.corpo}`),
      document.fonts.load(`700 28px ${FONTE.corpo}`),
      document.fonts.load(`700 56px ${FONTE.mono}`),
      document.fonts.load(`500 22px ${FONTE.mono}`),
    ]);
  } catch { /* segue com as fontes de reserva */ }
}

export async function gerarImagemCola(linhas: LinhaCola[], estado: string, endereco: string): Promise<Blob> {
  await carregarFontes();
  const fotos = await Promise.all(linhas.map((l) => (l.cand?.foto ? carregarImagem(l.cand.foto) : Promise.resolve(null))));

  const altura = TOPO + linhas.length * ALT_LINHA + RODAPE;
  const canvas = document.createElement("canvas");
  canvas.width = L;
  canvas.height = altura;
  const ctx = canvas.getContext("2d")!;

  // Fundo
  ctx.fillStyle = COR.fundo;
  ctx.fillRect(0, 0, L, altura);

  // Cabeçalho no estilo da tela da urna
  retangulo(ctx, M, 56, L - 2 * M, 210, 16);
  ctx.fillStyle = COR.tela;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = COR.linha;
  ctx.stroke();
  ctx.fillStyle = COR.telaTinta;
  ctx.font = `500 22px ${FONTE.mono}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(`ELEIÇÕES 2026 · ${estado.toUpperCase()} · 1º TURNO EM 4 DE OUTUBRO`, M + 36, 112);
  ctx.font = `800 84px ${FONTE.display}`;
  ctx.fillText("Minha cola", M + 36, 204);
  ctx.font = `400 26px ${FONTE.corpo}`;
  ctx.fillStyle = COR.suave;
  ctx.fillText("Na ordem em que os cargos aparecem na urna", M + 36, 244);

  // Linhas
  const numeroLargura = (n: number) => n * 70 - 10;
  linhas.forEach((l, i) => {
    const y = TOPO + i * ALT_LINHA;
    retangulo(ctx, M, y, L - 2 * M, ALT_LINHA - 22, 16);
    ctx.fillStyle = COR.cartao;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = l.cand ? COR.confirma : COR.linha;
    ctx.stroke();

    const xFoto = M + 24;
    const yFoto = y + 20;
    const wFoto = 114;
    const hFoto = 152;
    const foto = fotos[i];
    ctx.save();
    retangulo(ctx, xFoto, yFoto, wFoto, hFoto, 10);
    ctx.clip();
    ctx.fillStyle = COR.fundo;
    ctx.fillRect(xFoto, yFoto, wFoto, hFoto);
    if (foto) {
      // Recorte tipo "cover"
      const escala = Math.max(wFoto / foto.width, hFoto / foto.height);
      const w = foto.width * escala;
      const h = foto.height * escala;
      ctx.drawImage(foto, xFoto + (wFoto - w) / 2, yFoto + (hFoto - h) / 2, w, h);
    }
    ctx.restore();

    // Número em caixinhas, alinhado à direita
    const nDig = l.digitos;
    const xNum = L - M - 28 - numeroLargura(nDig);
    const digitos = l.cand ? String(l.cand.numero).padStart(nDig, " ").split("") : Array(nDig).fill("");
    digitos.forEach((d, k) => {
      const x = xNum + k * 70;
      retangulo(ctx, x, y + 56, 60, 84, 8);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = COR.tinta;
      ctx.stroke();
      if (d.trim()) {
        ctx.fillStyle = COR.tinta;
        ctx.font = `700 54px ${FONTE.mono}`;
        ctx.textAlign = "center";
        ctx.fillText(d, x + 30, y + 118);
        ctx.textAlign = "left";
      }
    });

    // Texto entre a foto e o número
    const xTexto = xFoto + wFoto + 28;
    const larguraTexto = xNum - xTexto - 24;
    ctx.fillStyle = COR.suave;
    ctx.font = `500 22px ${FONTE.mono}`;
    ctx.fillText(caber(ctx, l.cargo.toUpperCase(), larguraTexto), xTexto, y + 58);
    if (l.cand) {
      ctx.fillStyle = COR.tinta;
      ctx.font = `700 40px ${FONTE.display}`;
      ctx.fillText(caber(ctx, l.cand.nome, larguraTexto), xTexto, y + 112);
      ctx.fillStyle = COR.suave;
      ctx.font = `700 26px ${FONTE.corpo}`;
      ctx.fillText(caber(ctx, l.cand.partido, larguraTexto), xTexto, y + 152);
    } else {
      ctx.fillStyle = COR.suave;
      ctx.font = `400 32px ${FONTE.corpo}`;
      ctx.fillText("A decidir", xTexto, y + 112);
      ctx.font = `400 22px ${FONTE.corpo}`;
      ctx.fillText("Anote o número à mão", xTexto, y + 148);
    }
  });

  // Rodapé
  const yRod = TOPO + linhas.length * ALT_LINHA + 20;
  ctx.fillStyle = COR.corrige;
  retangulo(ctx, M, yRod, 8, 64, 4);
  ctx.fill();
  ctx.fillStyle = COR.tinta;
  ctx.font = `700 26px ${FONTE.corpo}`;
  ctx.fillText("O celular não pode entrar na cabine de votação.", M + 28, yRod + 26);
  ctx.font = `400 24px ${FONTE.corpo}`;
  ctx.fillStyle = COR.suave;
  ctx.fillText("Imprima esta cola ou anote os números num papel.", M + 28, yRod + 60);
  ctx.font = `500 20px ${FONTE.mono}`;
  ctx.fillText(`Feita no Match Eleitoral · ${endereco}`, M, altura - 36);

  return await new Promise<Blob>((ok, erro) => canvas.toBlob((b) => (b ? ok(b) : erro(new Error("falha ao gerar a imagem"))), "image/png"));
}
