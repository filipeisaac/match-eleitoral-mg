# Lote sp_fed_novos: notas e critérios

Pesquisa de 27/09/2026. 62 candidatos. Só as perguntas de `perguntasFaltando`; posições que já estão em
`camara_votos_sp.json` (script da Câmara, que já inclui as votações extras do lote sp_fed_inc: G05, DF05, DF06,
G06, G09 e G12) não foram refeitas nem sobrescritas.

## Votos nominais acrescentados

- **Alesp (G03):** ver `alesp_votacoes_sp_fed_novos.md`. Aplicado a 11 candidatos que foram deputados estaduais.
- **Câmara dos Deputados (DF06):** Eleuses Paiva aparece em `naoPareados` do script (sem pareamento com o id do
  TSE). Na votação 596844-116 (substitutivo do PL 583/2011, fim da saída temporária, 03/08/2022) ele votou Sim, e
  isso foi registrado como DF06 = 5, com o mesmo valor usado no lote sp_fed_inc. Foi a única votação do conjunto do
  projeto em que ele aparece. Sugestão: parear Eleuses Paiva (id Câmara 154919) no script.
- **Câmara Municipal de SP (G03):** adesão da capital à privatização da Sabesp (PL 163/2024), 02/05/2024,
  37 x 17. Lista nominal: https://www.cnnbrasil.com.br/politica/privatizacao-da-sabesp-saiba-como-votaram-os-vereadores-de-sao-paulo/
  Sim = 4, Não = 2 (lei mais estreita que a afirmação). Sim: Cris Monteiro, Sidney Cruz (relator), Dra. Sandra
  Tadeu, Rubinho Nunes, Major Palumbo. Não: Luna Zarattini (suplente em exercício). Sargento Nantes ainda não era
  vereador. O mesmo voto vale para vereadores do mandato 2021 a 2024 em outros lotes.

## Voto e declaração na mesma pergunta

Pela regra do projeto, o voto nominal prevaleceu, e a declaração foi citada na nota quando cabia:
- Guilherme Cortez G03: voto Não na Sabesp (2) prevaleceu sobre o programa de 2026 que propõe reverter
  privatizações (seria 1).
- Luna Zarattini G03: voto Não na Câmara Municipal (2) prevaleceu sobre o site que apresenta a luta contra as
  privatizações (seria 1).
- Marina Helou G03: votos mistos na Alesp em 2019 e 2020 (3) prevaleceram sobre a crítica à privatização da Sabesp
  num seminário na Alesp em março de 2026 (seria 2). Ela estava licenciada na votação da Sabesp em 2023. Se o
  projeto preferir a evidência mais recente, o valor passa a 2.

## Coautoria de projeto de lei

Coautoria de PL (nunca de PEC) foi contada como declaração, só na direção (4 ou 2):
- Adilson Barroso: PL 1904/2024 (aborto após 22 semanas equiparado a homicídio, 54 autores), PL 3798/2025
  (limites à atuação de magistrados, 39 autores), PL 1551/2024 (50% do fundo eleitoral para o RS, 20 autores).
- Eduardo Cury e Enrico Misasi: PL 6072/2019 (reformulação do Bolsa Família, 58 autores).
- Enrico Misasi: PL 4933/2020 (3 autores).
Se o projeto preferir não contar projetos com muitos coautores, esses registros podem ser retirados.

## Casos para revisar

- Pastora Sandra Alves G05: a moção de repúdio à ADPF 442 que ela assinou como vereadora de Boituva vem do resultado
  de busca; o site da Câmara de Boituva estava fora do ar (erro 503).
- Major Mecca G12: foi retirada. A fonte achada era um post no X em que ele divulga a proposta de acabar com a
  maioridade penal para estupradores a partir de 14 anos, mas o link encontrado era o do perfil, não o do post.
- Gil Diniz G13 = 4: o site oficial põe "Deus / valores cristãos" como pilar do mandato. Isso foi lido como uma
  ligação entre religião e mandato, e não só como fé pessoal. Altair Moraes G13 = 4 segue o mesmo critério (perfil
  no site do partido). Alessandra Gonzaga ficou sem G13: o site fala em "valores cristãos", mas não os liga a
  propostas.
- Lucas Pavanato G09 = 4: a evidência é a convocação de atos pelo impeachment de Alexandre de Moraes.
- Marina Helena G09 = 4: baseado na crítica à "canetada" de Moraes sobre aborto (2024); é um caso limítrofe.
  Em G03 = 4, ela defendeu privatizar a Petrobras em 2022, mas em 2024 disse que privatizar não garante qualidade.
- Juliano Medeiros G08 = 1 e Professora Luciene Cavalcante G03 = 1: a segunda fonte de cada uma foi vista em
  resultado de busca, sem ser aberta.
- Tomé Abduch G08 = 4: o título do vídeo da Jovem Pan News cita a frase dele ("Motta e Alcolumbre precisam
  pautar a anistia"), vista em resultado de busca.
- Sargento Nantes G12 = 4: a fala está entre aspas num post do Progressistas SP (09/04/2026); a fonte é única, por
  isso o valor é 4.
- Zé Dirceu: G09 ficou de fora (ele defende mandato fixo e código de ética para o STF, mas não disse que a Corte
  extrapola seus poderes). G08 e DF02 = 2 vêm de discurso em ato contra a anistia e a PEC da Blindagem (21/09/2025).
- Orlando Silva G05 ficou de fora: ele se opôs à PEC que restringe o aborto legal, o que não é o mesmo que
  defender descriminalizar.
- Homônimos: Major Palumbo (vereador de SP, bombeiro) não é Delegado Palumbo (deputado federal). Coronel
  Telhada não é o Capitão Telhada, deputado estadual desde 2023.

## Cobertura

Muitos candidatos do lote são ex-prefeitos, primeiras-damas, influenciadores, atletas e apresentadores sem falas
públicas sobre os temas do questionário. Eles ficaram com poucas posições ou nenhuma, em vez de posições inferidas.
Não foram pesquisados a fundo os votos em câmaras municipais de fora da capital (Guida Calixto em Campinas, Renata
Paiva em São José dos Campos e Loreny em Taubaté).
