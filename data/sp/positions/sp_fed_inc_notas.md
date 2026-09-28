# Lote sp_fed_inc: notas e critérios

## Votações nominais da Câmara acrescentadas neste lote

Aplicadas de forma sistemática a todos os 52 candidatos do lote, só nas perguntas que estavam em
`perguntasFaltando`. Abstenção, obstrução, Art. 17 e ausência não geram posição.

| Pergunta | Votação | Data | Placar | Sim | Não | Link |
|---|---|---|---|---|---|---|
| G05 | PDL 3/2025, susta a Resolução 258/2024 do Conanda (atendimento a meninas vítimas de violência sexual, incluindo aborto legal) | 05/11/2025 | 317 x 111 | 2 | 4 | https://dadosabertos.camara.leg.br/api/v2/votacoes/2482078-57/votos |
| DF05 | PL 8703/2017, destaque (DTQ 5, PHS) sobre o art. 16-C, que cria o Fundo Especial de Financiamento de Campanha. Sim = manter o fundo no texto | 04/10/2017 | 223 x 209 | 2 | 4 | https://dadosabertos.camara.leg.br/api/v2/votacoes/2153100-59/votos |
| DF06 | Substitutivo ao PL 6579/2013 (apensado ao PL 583/2011), que extinguia a saída temporária de presos | 03/08/2022 | 311 x 98 | 5 | 1 | https://dadosabertos.camara.leg.br/api/v2/votacoes/596844-116/votos |
| G06 | CCJ: parecer pela admissibilidade da PEC 45/2023 (criminaliza porte e posse de qualquer quantidade de droga) | 12/06/2024 | 47 x 17 | 2 | 4 | https://dadosabertos.camara.leg.br/api/v2/votacoes/2428236-50/votos |
| G12 | CCJ: parecer pela admissibilidade da PEC 32/2015 (maioridade penal e civil aos 16 anos) | 10/06/2026 | 44 x 18 | 4 | 2 | https://dadosabertos.camara.leg.br/api/v2/votacoes/1228863-102/votos |
| G09 | CCJ: parecer pela admissibilidade da PEC 8/2021 (limita decisões monocráticas do STF) | 09/10/2024 | 39 x 18 | 4 | 2 | https://dadosabertos.camara.leg.br/api/v2/votacoes/2410488-45/votos |

Critérios:

- G05 (PDL 3/2025): o PDL trata do acesso ao aborto legal por crianças e adolescentes, tema mais estreito que
  descriminalizar o aborto; por isso só direção (2/4). O lote extra de MG usou a mesma votação com o mesmo valor.
- DF05 (PL 8703/2017): em MG foi usada a urgência do mesmo projeto (2153714-7). Aqui preferi o destaque que
  votou especificamente a manutenção do artigo que cria o fundo, por ser a votação mais direta. Valor 2/4 porque
  a pergunta é sobre reduzir o fundo, não sobre sua existência.
- DF06 (PL 6579/2013): conferido na Agência Câmara (https://www.camara.leg.br/noticias/901359-camara-aprova-proposta-que-acaba-com-saidas-temporarias-de-presos/)
  que o texto aprovado em 03/08/2022 acabava com a saída temporária; correspondência direta, por isso 5/1, como
  DF02 e DF03 no script. A votação final de 20/03/2024 (emendas do Senado, PL 2253/2022) não tem votos nominais
  registrados na API, e a derrubada do veto (28/05/2024) foi em sessão do Congresso; nenhuma das duas foi usada.
- G06, G09 e G12 (CCJ): só valem para quem era membro da CCJ e votou. São votos de admissibilidade, por isso só
  direção (2/4). Para G09, limitar decisões monocráticas é tratado como indicação de que o STF excede seus
  limites; correspondência parcial.
- Consideradas e descartadas por serem quase unânimes: PLP 175/2024 (emendas parlamentares, urgência 360 x 60 e
  emendas rejeitadas por 348 x 25).

## Votações da Alesp

Ver `alesp_votacoes_sp_fed_inc.md`. Aplicadas só em G03 (Rodrigo Gambale 4, Bruno Ganem 4, Delegado Bruno
Lima 3 por votos em direções opostas).

## Declarações: critérios da revisão

- Declarações pesquisadas por candidato (discursos na API da Câmara, PLs de autoria principal, imprensa e sites
  próprios) e revisadas uma a uma. Voto nominal vence declaração na mesma pergunta; não houve conflito de direção
  entre os dois, exceto no caso de Tabata Amaral abaixo.
- 5 ou 1 só com posição reiterada (mais de uma fonte ou fala). Rebaixados para 4 por fonte única: Capitão Augusto
  G04, Delegado Paulo Bilynskyj DF06, Kim Kataguiri G12.
- Tabata Amaral G05: o voto Não ao PDL 3/2025 daria 4, mas ela declarou em jun/2024 ser "pessoalmente contra a
  legalização do aborto" e a favor de manter a lei (https://x.com/tabataamaralsp/status/1801769343878930569).
  A declaração é sobre a própria afirmação e o voto é sobre tema mais estreito (aborto legal para meninas
  vítimas), compatível com manter a lei; registrado 2 como declaração.
- Marcos Pereira G09 = 3: reconheceu excessos no Judiciário mas os atribuiu em parte aos partidos e criticou
  atacar o STF em campanha (Poder360, 01/05/2026).
- Removidas na revisão: Jonas Donizette G09 (única fonte de 2012, sobre outra composição do STF); Maria Rosas G13
  (site fala de fé pessoal, sem ligar valores religiosos às leis); Motta DF01 e DF05 (atos como relator-geral do
  Orçamento 2024 refletem o acordo da comissão, não posição pessoal).
- G01 com fonte só sobre reduzir impostos ou só sobre conter gastos recebeu 4 (direção), nunca 5.
- G09 = 2 para quem defendeu explicitamente decisões ou a atuação do STF (Sâmia Bomfim, Alencar Santana, Erika
  Hilton, Jilmar Tatto, Arlindo Chinaglia, Antonio Carlos Rodrigues, Paulo Teixeira): correspondência indireta.
- Omitidos por não haver evidência: vários temas de Miguel Lombardi, Fabio Teruel, Fausto Pinato, Celso
  Russomanno, Renata Abreu, Rodrigo Gambale, Felipe Becari, Bruno Ganem, Milton Vieira, Vitor Lippi e Marcio
  Alvino (atuação pública concentrada em temas regionais, saúde e causa animal).
- Resumos: operações policiais e processos em curso (Cezinha de Madureira, Mario Frias, demissão de Delegado da
  Cunha suspensa judicialmente) ficaram fora do resumo por não serem o que o candidato faz hoje; decisão editorial
  do projeto se quiser incluir.

## Observações sobre posições existentes (não alteradas)

- Antonio Carlos Rodrigues G08 (voto Sim no PL 2162/2023 em 10/12/2025): esse texto foi o da dosimetria, sem
  anistia. Em 15 e 16/04/2025 ele explicou em plenário por que não assinou a urgência da anistia
  (https://dadosabertos.camara.leg.br/api/v2/deputados/220638/discursos?dataInicio=2025-04-15&dataFim=2025-04-16&itens=100)
  e em 07/2025 defendeu Moraes. O valor 4 merece revisão.
- Marcos Pereira G14 (voto Sim na PEC 221/2019): em 26/02/2026 criticou o fim da 6x1 e disse que a bancada
  "às vezes até tem que votar" a favor por ser ano eleitoral
  (https://www.gazetadopovo.com.br/republica/presidente-do-republicanos-ve-pressao-a-parlamentares-por-fim-da-escala-6-1/).
- Rodrigo Gambale G10 (voto Não na urgência do PL 2630 em 2023): em 2026 é 2º autor do PL 2373/2026, que
  responsabiliza plataformas por omissão diante de crueldade animal transmitida ao vivo
  (https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2624460). Evidência mais recente,
  mais estreita, em direção oposta.
- Fausto Pinato G08: votos em direções opostas (Não em 17/09/2025, Sim em 10/12/2025); em 29/04/2025 defendeu
  "anistia proporcional" (PL 1815/2025).
- Jilmar Tatto DF02: o Sim na PEC 3/2021 está correto; ele o justificou como forma de evitar a PEC da Anistia.


- G14 (PEC 221/2019, 472 x 22 e 461 x 19) é votação quase unânime; pelo critério fixado em METODO_SP.md ela não
  diferencia candidatos. As posições G14 que vieram do script continuam em `posicoesExistentes` e não foram
  mexidas por este lote; fica o registro para revisão.
