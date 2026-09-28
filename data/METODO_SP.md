# Pesquisa de São Paulo

O protocolo é o de `data/METODO.md`: leia-o inteiro antes de começar. Tudo o que está lá vale aqui
(escala, tipos de evidência, neutralidade, fontes, formato de saída). Este arquivo só diz o que muda.

## Perguntas aplicáveis

Em `data/questions.json`, as perguntas comuns a todos os estados estão em `secoes` e as estaduais em
`estados.SP`:

- Todos os candidatos: `geral` (G01 a G14).
- Governador de SP: `estados.SP.governador` (SPGV01 a SPGV06).
- Senador: `senador` (S01 a S05).
- Deputado federal: `deputado_federal` (DF01 a DF06).
- Deputado estadual de SP: `estados.SP.deputado_estadual` (SPDE01 a SPDE05).

## O que já existe

Cada candidato do lote traz `posicoesExistentes` (votos nominais na Câmara já extraídos por script) e
`perguntasFaltando`. Pesquise só as perguntas faltando; não refaça votos da Câmara.

## Fontes úteis em SP

- Alesp: votações nominais e projetos de lei (https://www.al.sp.gov.br/, dados abertos em
  https://www.al.sp.gov.br/dados-abertos/). Votações nominais relevantes incluem a privatização da Sabesp
  (PL 1.501/2023, dezembro de 2023) e o programa de escolas cívico-militares (2024), entre outras que
  você identificar. Se identificar votações-chave da Alesp, registre-as em
  `data/sp/positions/alesp_votacoes_<lote>.md` (votação, data, o que Sim e Não significam para qual
  pergunta, link), para que sejam aplicadas a todos os deputados por igual.
- Câmara Municipal de São Paulo e de outras cidades, para vereadores.
- Imprensa: Folha, Estadão, g1 SP, UOL, CNN Brasil, Band, Metrópoles, veículos regionais do interior.

## Critérios já fixados no projeto (aplique igual)

- Voto numa lei mais estreita que a afirmação (uma privatização específica para "privatizar sempre que
  possível", cotas só em concursos) mostra a direção: use 4 ou 2, não 5 ou 1.
- Votação unânime ou quase unânime não diferencia candidatos: não use.
- Coassinatura de PEC não conta como posição (exige muitas assinaturas).
- Criticar prisões do 8 de janeiro não é o mesmo que defender anistia (G08).
- G13 conta quando a fonte liga valores religiosos às propostas, ao mandato ou às leis do candidato; não
  conta se fala só da fé pessoal dele.
- Voto sobre transporte municipal não vale para a pergunta de transporte metropolitano estadual.

## Saída

`data/sp/positions/<nome do lote>.json`, no formato de METODO.md (com `resumo`, `bandeiras` e
`posicoes`, estas só com as perguntas novas). Correções ou dúvidas: `data/sp/positions/<lote>_notas.md`.
