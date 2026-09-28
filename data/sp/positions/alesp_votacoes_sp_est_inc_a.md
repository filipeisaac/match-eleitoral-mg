# Votações nominais da Alesp usadas no lote sp_est_inc_a

Levantamento de 27/09/2026. Fonte: serviço de dados do portal da Alesp
(`https://legis-api-portal-prd.al.sp.gov.br/sessoes-plenarias/{id}/votacoes`), que lista as votações
nominais de cada sessão com o PDF de verificação. Foram varridas as 1.286 sessões de 15/03/2023 em diante
(134 votações nominais). A lista confere com a de `alesp_votacoes_sp_executivo.md`, e o critério é o mesmo:
ausência, obstrução e licença não geram posição; presidente da sessão não vota; votação unânime ou quase
unânime não é usada.

## Aplicada

| Votação | Data | Placar | Sim significa | Pergunta e valor | Link |
|---|---|---|---|---|---|
| PL 1501/2023, privatização da Sabesp: requerimento de encerramento da discussão | 05/12/2023 | 58 Sim x 20 Não | levar a privatização a voto | G03: Sim = 4, Não = 2 (lei mais estreita que "privatizar sempre que possível"); SPDE01: Sim = 2, Não = 4 (a oposição defendia plebiscito). Votação de procedimento, registrado na nota | https://www.al.sp.gov.br/repositorio/ementario/votacoes/9eee1206-2298-495c-a0a0-48733890f968.pdf |

Votos no lote:

- Sim (24): Bruna Furlan, Carla Morando, Rogério Nogueira, Conte Lopes, Delegada Graciela, Fabiana
  Bolsonaro, Lucas Bove, Marcos Damasio, Paulo Mansur, Ricardo Madalena, Rodrigo Moraes, Tenente Coimbra,
  Thiago Auricchio, Clarice Ganem, Ricardo França, Leticia Aguiar, Valdomiro Lopes, Marta Costa, Oseias de
  Madureira, Átila Jacomussi, Solange Freitas, Danilo Balas, Alex Madureira, Bruno Zambelli.
- Não (6): Carlos Giannazi, Ediane Maria, Monica da Bancada Feminista (Mônica das Pretas), Paula da Bancada
  Feminista, Professora Bebel, Marcolino.
- Obstrução, sem posição (4): Analice Fernandes, Maria Lúcia Amary, Dani Alonso, Thainara Faria.
- Licenciada (1): Valeria Bolsonaro. Não constava da lista (1): Camila Godoi.
- Bruna Furlan já tinha G03 por votos na Câmara; para ela só SPDE01 foi gravado.

## Identificadas e não aplicadas

- PL 1501/2023, votação principal de 06/12/2023 (62 x 1) e emendas/subemendas (62 x 1, 1 x 62): quase
  unânimes, porque PT e PSOL/Rede não votaram e PL e PSB estavam em obstrução.
- PLC 9/2024, escolas cívico-militares (21/05/2024, 54 x 21): não há pergunta correspondente para
  deputado estadual nem na seção geral (SPGV04 é só de governador).
- PL 164/2025, PPP das travessias litorâneas (15/04/2025, 62 x 16): concessão de serviço, não venda de
  estatal; não aplicada em G03. SPGV01 é só de governador.
- PEC 9/2023, piso da educação de 30% para 25% (13/11/2024 e 27/11/2024): ligação indireta com SPDE02;
  não pontuada, mesma decisão do lote sp_executivo.
- PEC 3/2023 (art. 167, 70 x 0), PL 482/2025 (Programa de Superação da Pobreza), PL 1246/2023 (ICMS),
  PL 1055/2025 (cota-parte do ICMS dos municípios), LDOs, orçamentos e contas: unânimes ou sem
  correspondência direta com as perguntas.
