# Segunda passada de pesquisa

Esta é uma passada complementar. O protocolo continua sendo `data/METODO.md`: leia-o inteiro antes
de começar. Tudo o que está lá vale aqui (escala, tipos de evidência, neutralidade, fontes).

## O que muda

- Seu lote em `data/batches/extra_<nome>.json` traz, para cada candidato, as posições que já temos
  (`posicoesExistentes`) e a lista `perguntasFaltando`. Pesquise **só as perguntas faltando**.
- Agora a busca na web está liberada. Use-a para achar entrevistas, debates de agosto e setembro
  de 2026, sabatinas, planos de governo registrados no TSE, matérias de imprensa (O Tempo, Estado de
  Minas, Itatiaia, g1 Minas, Folha, Estadão, CNN Brasil, UOL, veículos regionais) e perfis oficiais.
- Priorize profundidade: para cada candidato, procure primeiro os temas em que ele mais se manifestou
  (as bandeiras dele), depois os demais. Não force: pergunta sem evidência continua omitida.
- Trate todos com o mesmo rigor. Candidatos de partidos pequenos e candidatos sem mandato merecem a
  mesma busca que os favoritos nas pesquisas.

## Saída

1. `data/positions/<nome do lote>.json` (por exemplo `extra_presidente.json`): um array, um objeto
   por candidato do lote, na mesma ordem, com:
   - `id`, `nomeUrna`
   - `posicoes`: **somente as novas**, para perguntas que estavam em `perguntasFaltando`, no formato
     de METODO.md.
   - `resumo` e `bandeiras`: preencha só se `resumoAtual` estiver vazio ou `bandeirasAtuais` for uma
     lista vazia. Caso contrário, omita esses campos.
2. `data/positions/<nome do lote>_correcoes.md`: se encontrar algo que contradiz uma posição
   existente (posição mudou, nota errada, fonte que não sustenta o valor), descreva aqui com a fonte.
   **Não altere nenhum arquivo existente.**

Grave o JSON aos poucos, a cada 3 a 5 candidatos. Não escreva fora desses dois arquivos. Você pode usar
subagentes para paralelizar, mas o arquivo de saída é um só e quem escreve nele é você.

Ao terminar, responda com: quantas posições novas por tipo de evidência, quais candidatos continuam
com menos de 3 posições próprias no total, e um resumo das correções sugeridas.
