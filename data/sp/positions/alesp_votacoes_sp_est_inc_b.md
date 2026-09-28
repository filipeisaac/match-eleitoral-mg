# Votações nominais da Alesp usadas no lote sp_est_inc_b

Levantamento de 27/09/2026. A lista de votações nominais de cada sessão vem de
`https://legis-api-portal-prd.al.sp.gov.br/sessoes-plenarias/{id}/votacoes`, e cada votação tem um PDF com
o voto de cada deputado. Foram varridas todas as sessões desde 15/03/2019 (410 votações nominais, contando
eleições da Mesa e requerimentos de procedimento). Obstrução, abstenção, licença, ausência ("---") e
presidência da sessão não geram posição. Com mais de uma votação na mesma pergunta, vale a média
arredondada, como nos lotes sp_fed_inc e sp_executivo.

## Aplicadas

| Votação | Data | Placar | Sim significa | Pergunta e valor | Link |
|---|---|---|---|---|---|
| PL 1501/2023, privatização da Sabesp: requerimento de encerramento da discussão | 05/12/2023 | 58 x 20 | favorável a levar a privatização a voto | G03: Sim = 4, Não = 2. SPDE01: Sim = 2, Não = 4 (a oposição defendia plebiscito). Votação de procedimento, registrado na nota | https://www.al.sp.gov.br/repositorio/ementario/votacoes/9eee1206-2298-495c-a0a0-48733890f968.pdf |
| PL 1/2019, emenda aglutinativa substitutiva nº 18 (Plano Estadual de Desestatização) | 15/05/2019 | 57 x 26 | extinguir CPOS, Emplasa e Codasp e fundir Imesp e Prodesp | G03: Sim = 4, Não = 2 | https://www.al.sp.gov.br/repositorio/ementario/votacoes/20190515-211755-ID_SESSAO=13721-PDF.pdf |
| PL 727/2019 (extinção da Dersa) | 10/09/2019 | 64 x 15 | extinguir a Dersa | G03: Sim = 4, Não = 2 | https://www.al.sp.gov.br/repositorio/ementario/votacoes/20190910-181814-ID_SESSAO=13864-PDF.pdf |
| PL 529/2020 (ajuste fiscal), substitutivo | 13/10/2020 | 48 x 37 | extinguir EMTU, CDHU, Fundação Zoológico, Sucen, Daesp e outras | G03: Sim = 4, Não = 2 (não usado em G01, pois também cortou benefícios de ICMS) | https://www.al.sp.gov.br/repositorio/ementario/votacoes/20201014-001001-ID_SESSAO=14325-PDF.pdf |

Mesmos critérios dos lotes sp_fed_inc (PL 1/2019, PL 727/2019, PL 529/2020) e sp_executivo (Sabesp), para
que o valor seja igual entre lotes. Leis mais estreitas que "privatizar sempre que possível", por isso 4 ou 2.

## Votos dos candidatos do lote

| Candidato | Sabesp 2023 | PL 1/2019 | Dersa 2019 | PL 529/2020 | G03 | SPDE01 |
|---|---|---|---|---|---|---|
| Paulo Fiorilo | Não | Não | Não | Não | 2 | (declaração, 5) |
| Felipe Franco | Obstrução | - | - | - | - | - |
| Rafa Zimbaldi | Sim | Sim | Sim | Sim | 4 | 2 |
| Edna Macedo | Sim | Sim | Licenciada | Obstrução | 4 | 2 |
| Daniel Soares | Obstrução | --- | Sim | Sim | 4 | - |
| Dr. Eduardo Nóbrega | Sim | - | - | - | 4 | 2 |
| Delegado Olim | Sim | Sim | Sim | Sim | 4 | 2 |
| Jorge Wilson | Sim | Sim | Sim | Sim | 4 | 2 |
| Léo Oliveira | Sim | Sim | Sim | Sim | 4 | 2 |
| Leci Brandão | Obstrução | Não | Não | Não | 2 | (declaração, 4) |
| Ana Perugini | Não | - | - | - | 2 | 4 |
| Itamar Borges | Sim | Sim | Sim | Sim | 4 | 2 |
| Beth Sahão | Não | Não | Não | - | 2 | 4 |
| Caruso | Sim | Sim | Sim | Sim | 4 | 2 |
| Ana Carolina Serra | Sim | - | - | - | 4 | 2 |
| Donato | Não | - | - | - | 2 | 4 |
| Barros Munhoz | Sim | Sim | Sim | Sim | 4 | 2 |
| Mauro Bragato | Sim | --- | Obstrução | Sim | 4 | 2 |
| Dirceu Dalben | Sim | Sim | Sim | Sim | 4 | 2 |
| Rafael Saraiva | Sim | - | - | - | 4 | 2 |
| Emídio | Não | Não | Obstrução | Não | 2 | 4 |
| Márcio Nakashima | --- | Não | Abstenção | Não | 2 | - |
| Luiz Fernando | Obstrução | Obstrução | Não | Não | 2 | - |
| Caio França | Obstrução | Obstrução | Sim | Não | (declaração, 2) | - |
| Vitão do Cachorrão | Sim | - | - | - | 4 | 2 |
| Capitão Telhada | Sim | - | - | - | 4 | 2 |
| Paulo Correa Jr | Sim | Sim | Sim | Sim | 4 | 2 |
| Rômulo | Não | - | - | - | 2 | 4 |
| Jorge do Carmo | Obstrução | Não | Não | Não | 2 | - |
| Sebastião Santos | Sim | Sim | Sim | Sim | 4 | 2 |
| Rui Alves | Sim | - | - | - | 4 | 2 |
| Maurici | Não | - | - | Não | 2 | 4 |
| Gilmaci Santos | Sim | Sim | Sim | Sim | 4 | 2 |
| Eduardo Suplicy | Não | - | - | - | 2 | 4 |
| Enio Tatto | Não | Não | Não | Não | 2 | 4 |
| Barba | Não | Não | Não | Não | (declaração, 1) | 4 |

"-" = não era deputado na data. Os votos de 2019 e 2020 com nome "Coronel Telhada" são do pai de Capitão
Telhada e não foram atribuídos a ele.

## Identificadas e não aplicadas (para decisão do projeto)

- PL 482/2025, Programa de Superação da Pobreza (24/06/2025, 51 x 14). Poderia servir a G02, mas o Não da
  oposição foi ao desenho do programa estadual, não à transferência de renda em si. Não aplicada, como no lote
  sp_executivo. PDF: https://www.al.sp.gov.br/repositorio/ementario/votacoes/4040f5aa-19f3-43e9-a1fc-b65072cf8161.pdf
- PL 1113/2015, isenção tarifária no transporte metropolitano para portadores de doenças crônicas
  (06/06/2019, 38 x 6). Gratuidade para um grupo específico, mais estreita que SPDE04 e com poucos votantes.
  PDF: https://www.al.sp.gov.br/repositorio/ementario/votacoes/20190606-202015-ID_SESSAO=13754-PDF.pdf
- PL 657/2007, requerimento de urgência para programa de orientação a gestantes sobre o aborto legal
  (08/12/2020, 29 x 5). Só urgência, poucos votantes e ligação indireta com G05.
- PL 1055/2025, cota-parte municipal do ICMS (09/12/2025, 52 x 12). Não está claro que mude a divisão entre
  interior e capital (SPDE03); não aplicada.
- Reajustes das polícias, PLC 75/2023 (83 x 0) e PL 226/2026 (63 x 0): unânimes, não servem para SPDE05.
- PLC 3/2022, nova carreira do magistério (vários votos em 29/03/2022): reestruturação de carreira, não
  aumento acima da inflação; não aplicada em SPDE02.
- As demais (escola cívico-militar, PEC 9/2023, FURP, IPVA, regularização fundiária etc.) seguem o que já está
  em alesp_votacoes_sp_executivo.md.
