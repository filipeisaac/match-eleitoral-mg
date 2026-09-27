# Método de posicionamento dos candidatos

Este arquivo é o protocolo que toda pesquisa de posição segue. O app é usado por eleitores para
comparar candidatos, então **neutralidade e rastreabilidade valem mais do que cobertura**. Uma célula
vazia é aceitável; uma posição chutada não é.

## Entradas

- `data/questions.json`: as perguntas. Cada pergunta é uma afirmação; a posição do candidato é o
  quanto ele concordaria com ela.
- `data/batches/<lote>.json`: os candidatos do seu lote (id do TSE, nome de urna, número, partido,
  histórico eleitoral e redes sociais declaradas ao TSE).

Perguntas aplicáveis a cada candidato: todas as da seção `geral` (G01 a G14) **mais** as da seção do
cargo dele (`presidente` P*, `governador` GV*, `senador` S*, `deputado_federal` DF*,
`deputado_estadual` DE*).

## Escala

`v` é um inteiro de 1 a 5 sobre a afirmação:
1 = discorda totalmente, 2 = discorda, 3 = neutro ou posição mista, 4 = concorda, 5 = concorda totalmente.
Use 1 ou 5 só quando a posição for clara e reiterada; na dúvida entre forte e moderado, use 2 ou 4.

## Tipos de evidência (`conf`)

- `"voto"`: voto nominal do próprio candidato numa votação diretamente ligada à afirmação (Câmara,
  Senado, ALMG, câmara municipal). É a evidência mais forte.
- `"declaracao"`: afirmação pública e explícita do próprio candidato: entrevista, discurso, post,
  plano de governo registrado no TSE, projeto de lei de autoria dele. Precisa ser sobre o tema da
  afirmação, não sobre um tema vizinho.
- `"partido"`: inferido da orientação do partido **somente** quando o partido é coeso no tema e não
  há evidência individual contrária. Só use isso no arquivo de partidos, ou quando o próprio
  candidato não tiver nenhuma evidência individual; nesse caso cite a fonte da posição do partido.

Se não achar evidência, **omita a pergunta** do objeto `posicoes`. Não preencha com 3.

## Regras

1. Toda posição `voto` ou `declaracao` tem `fonte` com URL que você realmente abriu ou viu no
   resultado de busca, e uma `nota` de até 160 caracteres, em português, neutra, dizendo o fato
   (ex.: "Votou a favor da urgência do PL 2162/2023 (anistia) em 16/09/2025.").
2. Nunca infira posição de estereótipo: profissão, religião, região, aparência ou apelido de urna
   não são evidência.
3. Evidência individual vence a do partido. Evidência recente vence a antiga; se o candidato
   mudou de posição, registre a atual e mencione a mudança na nota.
4. Trate todos os candidatos com o mesmo rigor, independentemente de partido ou campo político.
   Não use adjetivos avaliativos em `resumo`, `bandeiras` ou `nota`.
5. Fontes preferidas: dados abertos da Câmara (`https://dadosabertos.camara.leg.br/api/v2/`),
   do Senado (`https://legis.senado.leg.br/dadosabertos/`), da ALMG, planos de governo no TSE,
   veículos jornalísticos, perfis oficiais do candidato. Evite blogs anônimos e sites partidários
   de adversários.
6. Não baixe nada além do necessário, não escreva fora do seu arquivo de saída e não altere outros
   arquivos.

## Saída

Escreva `data/positions/<lote>.json` (JSON válido, UTF-8), um array com um objeto por candidato do
lote, na mesma ordem do lote:

```json
[
  {
    "id": 130002554332,
    "nomeUrna": "AÉCIO NEVES",
    "resumo": "Deputado federal desde 2019, ex-governador de Minas (2003 a 2010) e ex-senador. Candidato ao Senado pelo PSDB.",
    "bandeiras": ["Infraestrutura em Minas", "Reforma política", "Oposição ao governo federal"],
    "posicoes": {
      "G08": { "v": 2, "conf": "voto", "fonte": "https://...", "nota": "Votou contra a urgência do projeto de anistia em 16/09/2025." },
      "DF02": { "v": 4, "conf": "declaracao", "fonte": "https://...", "nota": "..." }
    }
  }
]
```

- `resumo`: 1 ou 2 frases factuais, até 220 caracteres: quem é e o que faz hoje.
- `bandeiras`: até 3 temas que o próprio candidato apresenta como prioridade na campanha de 2026.
- Grave o arquivo aos poucos (a cada ~5 candidatos) para não perder trabalho se algo falhar.

Ao terminar, responda com: quantos candidatos, quantas posições por tipo de evidência e quais
candidatos ficaram com menos de 3 posições.
