# Votações nominais da Alesp identificadas no lote sp_fed_novos

Levantamento de 27/09/2026. Fontes: lista de votações por sessão em
`https://legis-api-portal-prd.al.sp.gov.br/sessoes-plenarias/{id}/votacoes`, com o PDF de verificação nominal
de cada votação. Foram conferidas as votações de 2011 a 2018 (mandatos estaduais anteriores de Orlando Morando,
Luiz Fernando Machado, Milton Leite Filho, Márcia Lia e Coronel Telhada) e as de 2019 a 2026 (Milton Leite Filho,
Márcia Lia, Coronel Telhada até 2023, Gil Diniz, Major Mecca, Marina Helou, Altair Moraes, Alexandre Pereira,
Guilherme Cortez, Andréa Werner e Tomé Abduch). Os critérios são os de `alesp_votacoes_sp_fed_inc.md` e
`alesp_votacoes_sp_executivo.md`, para que valham igual para todos os deputados.

Regras aplicadas: abstenção, obstrução, licença e ausência não geram posição. Com mais de uma votação na mesma
pergunta, vale a média arredondada. Votação unânime ou quase unânime não é usada.

Atenção a homônimos: o "CAPITÃO TELHADA" que aparece nos PDFs a partir de 2023 é outro deputado (filho de Coronel
Telhada); Coronel Telhada deixou a Alesp em março de 2023. Nos PDFs de 2019 e 2020, Márcia Lia aparece como
"MÁRCIA LULA LIA".

## Aplicadas (pergunta G03)

Sim = 4 e Não = 2 em todas: são leis mais estreitas que "privatizar sempre que possível". A votação de 2023 é de
procedimento (encerramento da discussão), o que está dito na nota; a votação de mérito da Sabesp teve 62 x 1 porque
a oposição não votou, por isso não serve para diferenciar.

| Votação | Data | Placar | Sim significa | Link |
|---|---|---|---|---|
| PL 1/2019, emenda aglutinativa substitutiva nº 18 (Plano Estadual de Desestatização) | 15/05/2019 | 57 x 26 | extinguir CPOS, Emplasa e Codasp e fundir Imesp e Prodesp | https://www.al.sp.gov.br/repositorio/ementario/votacoes/20190515-211755-ID_SESSAO=13721-PDF.pdf |
| PL 727/2019 (dissolução e extinção da Dersa) | 10/09/2019 | 64 x 15 | extinguir a Dersa | https://www.al.sp.gov.br/repositorio/ementario/votacoes/20190910-181814-ID_SESSAO=13864-PDF.pdf |
| PL 529/2020 (ajuste fiscal), substitutivo | 13/10/2020 | 48 x 37 | extinguir EMTU, CDHU e outras estatais e fundações | https://www.al.sp.gov.br/repositorio/ementario/votacoes/20201014-001001-ID_SESSAO=14325-PDF.pdf |
| PL 1.501/2023 (privatização da Sabesp), requerimento de encerramento da discussão | 05/12/2023 | 58 x 20 | levar a privatização a voto | https://www.al.sp.gov.br/repositorio/ementario/votacoes/9eee1206-2298-495c-a0a0-48733890f968.pdf |

Votos dos candidatos do lote e valor resultante em G03:

| Candidato | PL 1/2019 | PL 727/2019 | PL 529/2020 | Sabesp 05/12/2023 | G03 |
|---|---|---|---|---|---|
| Milton Leite Filho | Sim | Sim | Sim | Sim | 4 |
| Altair Moraes | Sim | Sim | Sim | Sim | 4 |
| Alexandre Pereira | Obstrução | Sim | Sim | (fora da Alesp) | 4 |
| Tomé Abduch | (fora) | (fora) | (fora) | Sim | 4 |
| Coronel Telhada | Sim | Sim | Não | (fora) | 3 (média 3,3) |
| Gil Diniz | Não | Sim | Não | Sim | 3 |
| Major Mecca | Não | Sim | Não | Sim | 3 |
| Marina Helou | Não | Sim | Não | Licenciada | 3 (média 2,7) |
| Márcia Lia | Não | Não | Não | Não | 2 |
| Guilherme Cortez | (fora) | (fora) | (fora) | Não | 2 |
| Andréa Werner | (fora) | (fora) | (fora) | Não | 2 |

Para Guilherme Cortez, a pesquisa de declarações achou também o programa de 2026, que propõe reverter
privatizações (seria G03 = 1). Pela regra do projeto, o voto nominal prevalece; o programa foi citado na nota.

## Identificadas e não aplicadas (para decisão do projeto)

- PL 39/2015, extinção da Fundap (fundação estadual de pesquisa em administração), 03/11/2015. Votos: Orlando
  Morando Sim, Luiz Fernando Machado Sim, Coronel Telhada Sim, Márcia Lia Não (Milton Leite Filho licenciado).
  Não aplicada: extinguir uma fundação pública não é privatizar uma estatal. PDF:
  https://www.al.sp.gov.br/repositorio/ementario/votacoes/20151103-204211-ID_SESSAO=11979-PDF.pdf
- PL 249/2013, concessão de áreas de parques estaduais à iniciativa privada, 07/06/2016 (emenda aglutinativa).
  Votos: Milton Leite Filho, Coronel Telhada, Luiz Fernando Machado e Orlando Morando Sim; Márcia Lia Não. Não
  aplicada, como no lote sp_fed_inc: concessão de parque não é privatização de estatal. Se o projeto aceitar
  concessões em G03, Sim = 4 e Não = 2. PDF:
  https://www.al.sp.gov.br/repositorio/ementario/votacoes/20160607-194357-ID_SESSAO=12272-PDF.pdf
- PL 680/2013 (dissolução da CPETUR, 07/05/2015) e PL 681/2013 (extinção da SUTACO, 29/04/2015): sem quórum ou
  com os candidatos do lote em obstrução; não geram posição.
- PL 164/2025 (PPP das travessias litorâneas, 15/04/2025, 62 x 16): concessão, e a pergunta SPGV01 não se aplica a
  deputado federal; não usada em G03.
- PL 482/2025 (Programa de Superação da Pobreza, 24/06/2025, 51 x 14): não aplicada em G02, como no lote
  sp_executivo: é um programa estadual específico, e a votação não mostra por si só posição sobre ampliar a
  transferência de renda.
- As demais votações nominais de 2011 a 2026 (orçamento, carreiras, operações de crédito, Tribunal de Contas,
  PEC 9/2023 do piso da educação, escolas cívico-militares) não correspondem a perguntas de deputado federal.
