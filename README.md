# Match Eleitoral MG

Ferramenta independente de orientação de voto para as eleições de 2026 em Minas Gerais. O eleitor responde o que é importante para ele e vê quais candidatos pensam parecido, com a fonte de cada posição.

**No ar:** https://match-eleitoral-production.up.railway.app

Cobre presidente, governador, Senado, deputado federal e deputado estadual. O 1º turno é em 4 de outubro de 2026.

## Como funciona

1. **Perguntas.** São 14 perguntas gerais de valores e prioridades e mais um bloco por cargo, cada um com uma explicação curta do que o cargo faz. Cada pergunta traz contexto e um "Mais detalhes" com a situação atual e os argumentos de quem concorda e de quem discorda.
2. **Revisão.** O eleitor confere as respostas e marca até 3 temas como muito importantes. Esses temas valem o dobro no cálculo.
3. **Resultados.** O app mostra os candidatos mais próximos de cada cargo, com número, partido, redes sociais e a comparação pergunta por pergunta. Tem também uma "cola" com os números na ordem da urna e uma biblioteca com todos os dados de cada candidato.

## Neutralidade e fontes

O protocolo completo está em [`data/METODO.md`](data/METODO.md) e [`data/METODO_EXTRA.md`](data/METODO_EXTRA.md). Os pontos principais:

- **As posições foram levantadas com IA, a partir de fontes públicas, seguindo o mesmo protocolo para todos os candidatos.** Cada posição indica o tipo de evidência e traz o link da fonte:
  - **voto registrado:** votação nominal na Câmara, no Senado, na ALMG ou em câmara municipal;
  - **declaração:** entrevista, debate, plano de governo ou projeto de lei do próprio candidato;
  - **posição do partido:** usada só quando o candidato não tem nada próprio e o partido é coeso no tema.
- Nenhuma posição é deduzida de profissão, religião ou aparência. Sem evidência, a pergunta não conta para aquele candidato.
- As correções feitas depois da pesquisa estão registradas, com o motivo, em [`scripts/aplicar_correcoes.py`](scripts/aplicar_correcoes.py).

### Quem aparece

- **Presidente, governador e Senado:** todos os candidatos na disputa.
- **Deputados:** há mais de 1.600 candidatos em Minas. Entram os eleitos em 2022 para o mesmo cargo e os que mais receberam recursos de campanha até 24/09/2026, segundo o TSE: os 80 maiores para deputado federal e os 100 maiores para deputado estadual.

### Cálculo do match

- Em cada pergunta, a concordância vai de 100% (mesma resposta) a 0% (extremos opostos).
- **Pesos:**
  - os temas marcados como muito importantes valem o dobro;
  - a posição herdada do partido vale metade e, somada, nunca pesa mais do que três posições do próprio candidato.
- Candidatos com poucas posições conhecidas são puxados para 50% e marcados como "poucos dados".
- O cálculo está em [`src/match.ts`](src/match.ts), com testes em [`src/match.test.ts`](src/match.test.ts).

## Privacidade e lei eleitoral

O cálculo roda inteiramente no navegador. O servidor só entrega arquivos estáticos e não tem nenhuma rota que receba respostas: não há cadastro, e nenhuma resposta é guardada ou somada. Por isso não é pesquisa eleitoral nem enquete. A Lei 9.504/97, art. 33, § 5º, proíbe enquetes durante a campanha.

## Encontrou um erro?

Abra uma [issue](https://github.com/filipeisaac/match-eleitoral-mg/issues) com o nome do candidato, a pergunta e a fonte que mostra a posição correta. Correções valem para todos os candidatos com o mesmo critério.

## Estrutura

| Caminho | O que é |
|---|---|
| `src/app.ts` | Interface (TypeScript sem framework) |
| `src/match.ts` | Cálculo do match |
| `server.ts` | Servidor estático (Bun) com cabeçalhos de segurança |
| `data/questions.json` | Perguntas, contexto e descrição dos cargos |
| `data/detalhes.json` | Conteúdo do "Mais detalhes" de cada pergunta |
| `data/positions/` | Posições pesquisadas, por lote, e posições dos partidos |
| `data/raw/` | Dados do TSE (candidaturas, redes sociais, arrecadação) e atas da ALMG |
| `scripts/build-data.ts` | Junta tudo em `public/data/app.json` |
| `public/` | Página, estilos, fotos oficiais do TSE e dados gerados |

## Rodar localmente

Requer [Bun](https://bun.sh).

```sh
bun install
bun scripts/build-data.ts   # gera public/data/app.json
bun run dev                 # compila e sobe em http://localhost:3000
bun test                    # testes do cálculo
```

## Publicar

O app roda no Railway a partir do `Dockerfile`:

```sh
bun scripts/build-data.ts && railway up --service match-eleitoral --detach
```

## Fontes de dados

- **TSE, DivulgaCandContas:** candidaturas, situação do registro, redes sociais declaradas, fotos oficiais e prestação de contas.
- **Dados abertos da Câmara dos Deputados, do Senado Federal e da ALMG:** votações nominais, proposições e discursos.
- **Planos de governo registrados no TSE, debates, entrevistas e imprensa:** cada posição traz o link da sua fonte.

Ferramenta independente, sem ligação com partidos ou candidatos.
