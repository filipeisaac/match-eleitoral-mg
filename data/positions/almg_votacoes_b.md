# Votações nominais-chave da ALMG (lote est_incumbentes_b)

Fonte primária: atas do Plenário publicadas no Diário do Legislativo da ALMG (PDFs no mediaserver da ALMG), que listam nominalmente quem registrou "sim" e "não". Placar conferido com o resultado da reunião na API de dados abertos (`https://dadosabertos.almg.gov.br/api/v2/plenario/reunioes/detalhes/{ano}/{mes}/{dia}/{hora}`). Quem não aparece numa lista não votou (ausente, licenciado ou presidindo a sessão). A API da ALMG não expõe voto nominal de Plenário; só as atas trazem os nomes.

As listas completas de Sim e Não das sete votações usadas estão em `almg_votacoes_a.md` (mesmas atas, mesmas páginas). Este arquivo acrescenta: (1) a matriz de votos dos 32 deputados do lote B; (2) a regra de conversão em escala usada no lote B; (3) votações examinadas e descartadas, com as listas nominais.

## Votações usadas

| Código | Votação | Data | Placar | Afirmação | Leitura | Ata (lista nominal) |
|---|---|---|---|---|---|---|
| PEC 24 1º t. | PEC 24/2023, retira a exigência de referendo para desestatizar a Copasa (Substitutivo nº 2) | 24/10/2025 | 52 x 18 | DE01 | Sim = retirar o referendo (discorda); Não = manter (concorda) | https://mediaserver.almg.gov.br/acervo/463/822/2463822.pdf (a partir da p. 88) |
| PEC 24 2º t. | PEC 24/2023, 2º turno, promulgada como Emenda à Constituição 117 | 05/11/2025 | 48 x 22 | DE01 | idem | https://mediaserver.almg.gov.br/acervo/475/18/2475018.pdf (a partir da p. 62) |
| PL 4.380 1º t. | PL 4.380/2025, autoriza a desestatização da Copasa (Substitutivo nº 3) | 02/12/2025 | 50 x 17 | G03 | Sim = a favor de privatizar a Copasa (concorda); Não = contra (discorda) | https://mediaserver.almg.gov.br/acervo/496/315/2496315.pdf (a partir da p. 116) |
| PL 4.380 2º t. | PL 4.380/2025, 2º turno, virou a Lei 25.664/2025 | 17/12/2025 | 53 x 19 | G03 | idem | https://mediaserver.almg.gov.br/acervo/510/199/2510199.pdf (a partir da p. 129) |
| PL 438 1º t. | PL 438/2019, reserva de vagas para negros em concursos estaduais (Substitutivo nº 2) | 03/12/2025 | 43 x 3 | G11 | Sim = a favor das cotas raciais (concorda); Não = contra | https://mediaserver.almg.gov.br/acervo/497/805/2497805.pdf (a partir da p. 15) |
| PL 438 2º t. | PL 438/2019, 2º turno | 16/12/2025 | 48 x 7 | G11 | idem | https://mediaserver.almg.gov.br/acervo/509/176/2509176.pdf (a partir da p. 64) |
| Veto 9/2024 | Veto total do governador à Proposição de Lei 25.628/2023, que ampliava a Estação Ecológica de Fechos (Nova Lima) | 24/04/2024 | 40 x 21 | G07 | Sim = manter o veto (não ampliar a área protegida; discorda); Não = derrubar o veto (concorda). As razões do veto citam prejuízo ao desenvolvimento econômico da região, perda de empregos e de arrecadação; a ampliação foi defendida em Plenário como proteção de área de recarga hídrica ameaçada pela mineração. | https://mediaserver.almg.gov.br/acervo/86/875/2086875.pdf (a partir da p. 42); razões do veto em https://www.almg.gov.br/projetos-de-lei/VET/9/2024 |

## Conversão em escala usada no lote B

- DE01 (PEC 24/2023): voto nos dois turnos no mesmo sentido = 1 (Sim) ou 5 (Não); voto em um só turno = 2 ou 4; quem mudou de voto entre os turnos recebe a posição do voto mais recente, com a mudança citada na nota.
- G03 (PL 4.380/2025): Sim = 4; Não = 2. A afirmação fala em privatizar "sempre que possível", mais ampla do que um caso, por isso o voto sozinho não leva a 5. Só vai a 1 quando o deputado, além do voto Não, discursou de forma reiterada contra privatizações.
- G11 (PL 438/2019): Sim nos dois turnos = 5; Sim em um turno = 4; Não = 2 (nos dois turnos, 1).
- G07 (Veto 9/2024): peso moderado, 2 (manter o veto) ou 4 (derrubar), por ser um voto único sobre um caso específico.
- Coautoria de PEC não foi usada como evidência de posição (a PEC exige 26 assinaturas e as listas misturam campos opostos), em linha com o lote A. Coautoria de projeto de lei ordinário foi usada como declaração.

## Matriz de votos do lote B

"-" = não registrou voto (ausente, licenciado ou presidindo). Alê Portela esteve licenciada como secretária de Estado de Desenvolvimento Social durante as votações de 2025.

| Deputado (partido em 2026) | PEC 24 1º t. | PEC 24 2º t. | PL 4.380 1º t. | PL 4.380 2º t. | PL 438 1º t. | PL 438 2º t. | Veto 9/2024 |
|---|---|---|---|---|---|---|---|
| Tito Torres (PSD) | Sim | Sim | Sim | Sim | - | Sim | Sim |
| Luizinho (PT) | Não | Não | - | Não | - | - | Não |
| Alê Portela (PL) | - | - | - | - | - | - | Sim |
| Mário Henrique Caixa (PV) | - | - | - | - | - | Sim | - |
| Arnaldo (UNIÃO) | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| Carlos Henrique (REPUBLICANOS) | Sim | Sim | Sim | Sim | - | - | Sim |
| Betinho Pinto Coelho (UNIÃO) | Sim | Sim | Sim | Sim | Sim | - | - |
| Ulysses Gomes (PT) | Não | Não | Não | Não | Sim | Sim | Não |
| Noraldino Junior (PSB) | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| Doorgal Andrada (PP) | Sim | Sim | Sim | Sim | Sim | - | Não |
| Marquinho Lemos (PT) | Não | Não | Não | Não | Sim | - | Não |
| Raul Belem (PSD) | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| Betão (PT) | Não | Não | Não | Não | - | - | - |
| Dr. Jean Freire (PT) | Não | Não | Não | Não | Sim | Sim | Não |
| Leleco Pimentel (PT) | Não | Não | Não | Não | - | Sim | Não |
| Oscar Teixeira (PP) | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| Bosco (PSD) | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| Gil Pereira (PSD) | Sim | Sim | Sim | Sim | - | Sim | Sim |
| Leandro Genaro Juntos Somos + (PSD) | Sim | Sim | Sim | Sim | - | - | Sim |
| Professor Cleiton (PV) | Não | Não | Não | Não | Sim | Sim | Não |
| Celinho Sintrocel (PCDOB) | Não | Não | Não | Não | - | Sim | Não |
| Leonídio Bouças (PSDB) | Sim | Sim | Sim | Sim | Sim | - | Sim |
| Bim Da Ambulância (AVANTE) | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| Mauro Tramonte (REPUBLICANOS) | Sim | Não | Sim | Sim | - | Sim | - |
| Ricardo Campos (PT) | Não | Não | Não | Não | Sim | - | Não |
| Delegado Christiano Xavier (PSD) | Sim | Sim | Sim | Sim | Sim | Sim | Sim |
| Professor Wendel Mesquita (UNIÃO) | Sim | Sim | Sim | Sim | - | Sim | Sim |
| Doutor Wilson Batista (PSD) | Sim | Sim | - | Sim | Sim | Sim | Sim |
| Dr. Maurício (NOVO) | Sim | - | Sim | Sim | Sim | Sim | Sim |
| Zé Laviola (NOVO) | Sim | Sim | Sim | Sim | Sim | - | Sim |
| Rafael Martins (PSD) | Sim | Sim | Sim | Sim | - | - | Sim |
| Charles Santos (REPUBLICANOS) | Sim | Sim | Sim | Sim | Sim | Sim | Sim |

## Votações examinadas e não usadas

### PL 1.295/2023 (torna permanente o adicional de 2 pontos de ICMS sobre supérfluos, que financia o Fundo de Erradicação da Miséria), 1º turno, Substitutivo nº 41

- Data: 26/09/2023. Resultado: 33 sim x 23 não.
- Fonte: https://mediaserver.almg.gov.br/acervo/899/618/1899618.pdf (p. 78)
- Motivo de não uso: o "não" juntou a oposição de esquerda (PT, PSOL, Rede) e parte da direita (PL, um deputado do Novo) por razões opostas; o voto não separa quem quer menos imposto e menos serviço (G01) de quem se opôs ao governo por outros motivos. Declarações individuais sobre esse projeto foram usadas quando explícitas.
- Sim (33): Adriano Alvarenga (PP), Alencar da Silveira Jr. (PDT), Antonio Carlos Arantes (PL), Arlen Santiago (AVANTE), Bim da Ambulância (AVANTE), Bosco (CIDADANIA), Carlos Henrique (REPUBLICANOS), Cassio Soares (PSD), Charles Santos (REPUBLICANOS), Chiara Biondini (PP), Coronel Henrique (PL), Delegado Christiano Xavier (PSD), Doorgal Andrada (PATRIOTA), Doutor Paulo (PATRIOTA), Doutor Wilson Batista (PSD), Dr. Maurício (NOVO), Duarte Bechir (PSD), Enes Cândido (REPUBLICANOS), Gil Pereira (PSD), Grego da Fundação (PMN), Gustavo Santana (PL), João Magalhães (MDB), Leandro Genaro (PSD), Mauro Tramonte (REPUBLICANOS), Nayara Rocha (PP), Neilando Pimenta (PSB), Noraldino Júnior (PSB), Oscar Teixeira (PP), Rafael Martins (PSD), Raul Belém (CIDADANIA), Roberto Andrade (PATRIOTA), Thiago Cota (PDT), Vitório Júnior (PP)
- Não (23): Ana Paula Siqueira (REDE), Arnaldo Silva (UNIÃO), Beatriz Cerqueira (PT), Bella Gonçalves (PSOL), Betão (PT), Betinho Pinto Coelho (PV), Bruno Engler (PL), Caporezzo (PL), Doutor Jean Freire (PT), Eduardo Azevedo (PSC), Elismar Prado (PROS), Leleco Pimentel (PT), Leninha (PT), Lohanna (PV), Mário Henrique Caixa (PV), Marli Ribeiro (PSC), Marquinho Lemos (PT), Professor Cleiton (PV), Ricardo Campos (PT), Rodrigo Lopes (UNIÃO), Sargento Rodrigues (PL), Ulysses Gomes (PT), Zé Laviola (NOVO)

### PL 3.503/2025 (reajuste de 5,26% da educação básica), 2º turno: Emendas nº 1 e nº 3

- Data: 07/05/2025. Fonte: https://mediaserver.almg.gov.br/acervo/313/782/2313782.pdf (Emenda 1 na p. 57; Emenda 3 na p. 61).
- Emenda nº 1 (Ulysses Gomes e outros): revisão de 4,83% (IPCA de 2024) para os demais servidores civis e militares do Executivo. Rejeitada por 25 sim x 34 não.
- Emenda nº 3 (Sargento Rodrigues e outros): revisão de 4,83% só para as carreiras da segurança pública. Rejeitada por 25 sim x 35 não.
- Motivo de não uso: tratam de reajuste de servidores (tema da GV04, que não se aplica a deputado estadual). A Emenda nº 3 tem relação com a DE05, mas a oposição votou Sim em todas as emendas de reajuste, e a base do governo votou Não por orientação fiscal; o voto não mede prioridade da segurança sobre outras áreas.
- Emenda 1, Sim (25): Ana Paula Siqueira (REDE), Andréia de Jesus (PT), Beatriz Cerqueira (PT), Bella Gonçalves (PSOL), Betão (PT), Bruno Engler (PL), Celinho Sintrocel (PCdoB), Cristiano Silveira (PT), Delegada Sheila (PL), Doutor Jean Freire (PT), Dr. Maurício (NOVO), Elismar Prado (PSD), Hely Tarqüínio (PV), João Vítor Xavier (CIDADANIA), Leleco Pimentel (PT), Leninha (PT), Lohanna (PV), Lucas Lasmar (REDE), Marquinho Lemos (PT), Mauro Tramonte (REPUBLICANOS), Professor Cleiton (PV), Ricardo Campos (PT), Sargento Rodrigues (PL), Thiago Cota (PDT), Ulysses Gomes (PT)
- Emenda 1, Não (34): Adalclever Lopes (PSD), Adriano Alvarenga (PP), Alencar da Silveira Jr. (PDT), Antonio Carlos Arantes (PL), Arlen Santiago (AVANTE), Arnaldo Silva (UNIÃO), Betinho Pinto Coelho (PV), Bim da Ambulância (AVANTE), Bosco (CIDADANIA), Carlos Henrique (REPUBLICANOS), Carol Caram (AVANTE), Cassio Soares (PSD), Charles Santos (REPUBLICANOS), Coronel Henrique (PL), Delegado Christiano Xavier (PSD), Doutor Wilson Batista (PSD), Enes Cândido (REPUBLICANOS), Gil Pereira (PSD), Gustavo Valadares (PMN), Ione Pinheiro (UNIÃO), João Magalhães (MDB), Lincoln Drumond (PL), Lud Falcão (PODE), Maria Clara Marra (PSDB), Neilando Pimenta (PSB), Noraldino Júnior (PSB), Oscar Teixeira (PP), Rafael Martins (PSD), Raul Belém (CIDADANIA), Roberto Andrade (PRD), Rodrigo Lopes (UNIÃO), Vitório Júnior (PP), Zé Guilherme (PP), Zé Laviola (NOVO)
- Emenda 3, Sim (25): Ana Paula Siqueira (REDE), Andréia de Jesus (PT), Beatriz Cerqueira (PT), Bella Gonçalves (PSOL), Betão (PT), Bruno Engler (PL), Celinho Sintrocel (PCdoB), Cristiano Silveira (PT), Delegada Sheila (PL), Delegado Christiano Xavier (PSD), Doutor Jean Freire (PT), Eduardo Azevedo (PL), Elismar Prado (PSD), Hely Tarqüínio (PV), João Vítor Xavier (CIDADANIA), Leleco Pimentel (PT), Leninha (PT), Lohanna (PV), Lucas Lasmar (REDE), Marquinho Lemos (PT), Mauro Tramonte (REPUBLICANOS), Professor Cleiton (PV), Ricardo Campos (PT), Sargento Rodrigues (PL), Ulysses Gomes (PT)
- Emenda 3, Não (35): Adalclever Lopes (PSD), Adriano Alvarenga (PP), Alencar da Silveira Jr. (PDT), Antonio Carlos Arantes (PL), Arlen Santiago (AVANTE), Bim da Ambulância (AVANTE), Bosco (CIDADANIA), Carlos Henrique (REPUBLICANOS), Carol Caram (AVANTE), Cassio Soares (PSD), Coronel Henrique (PL), Doutor Wilson Batista (PSD), Dr. Maurício (NOVO), Duarte Bechir (PSD), Enes Cândido (REPUBLICANOS), Gil Pereira (PSD), Grego da Fundação (PMN), Gustavo Valadares (PMN), Ione Pinheiro (UNIÃO), João Magalhães (MDB), Lincoln Drumond (PL), Lud Falcão (PODE), Maria Clara Marra (PSDB), Marli Ribeiro (PL), Neilando Pimenta (PSB), Noraldino Júnior (PSB), Oscar Teixeira (PP), Rafael Martins (PSD), Raul Belém (CIDADANIA), Roberto Andrade (PRD), Rodrigo Lopes (UNIÃO), Thiago Cota (PDT), Vitório Júnior (PP), Zé Guilherme (PP), Zé Laviola (NOVO)

### Propag (PL 3.731/2025)

- Aprovado por 59 x 0 (1º turno, 28/05/2025) e 56 x 0 (2º turno, 29/05/2025). Unânime, não discrimina posições; não usado.
