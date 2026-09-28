# Notas do lote sp_est_novos

Votações da Alesp: ver alesp_votacoes_sp_est_novos.md (G03 aplicado a Márcio da Farmácia, Douglas Garcia e Reinaldo Alguz).

## Ajustes feitos na revisão final

- Pr André Bueno: G09 retirado. A única fonte (X, 27/03/2025) chama de político o julgamento de Bolsonaro no STF; criticar um julgamento não é o mesmo que afirmar que o STF extrapola seus poderes (mesma lógica da regra do G08).
- Douglas Garcia: G05 e G11 retirados, porque vêm de descrição jornalística e não de fala dele. G04 ficou 4 (e não 5): uma única fala direta, de 2019.
- Votação da Câmara Municipal de SP sobre a adesão da capital ao contrato da Sabesp privatizada (PL 163/2024, 02/05/2024, 37 x 17): aplicada como G03 = 4 (lei mais estreita) a todos os vereadores do lote que votaram (Sandra Santana, Sonaira Fernandes, George Hato, Thammy Miranda). Se o projeto não quiser usar votos municipais em G03, remover os quatro.
- Delegada Raquel, SPDE05: a entrevista da Revista Oeste dá erro 403; a frase foi vista no resultado de busca. Vale conferir.


## Decisões e casos-limite

- **Mara Gabrilli**: usei votos nominais do Senado (API dadosabertos do Senado, senador 5376), conf "voto": PEC 32/2022 (G02, Sim), MP 1031/2021 Eletrobras (G03, Não na votação principal 42x37), PDL 233/2019 que sustava decreto de armas (G04, Sim 47x28), PL 2159/2021 licenciamento (G07, Não). O voto dela no PL 1946/2019 (armas) foi sobre substitutivo declarado prejudicado; não usei. PEC 45/2023 (drogas): ausente (MIS). PL 2630/2020: licença (LS). Fonte aponta para o JSON anual da API.
- **CMSP, adesão da capital à privatização da Sabesp (PL 163/2024, 02/05/2024, 37x17)**: usei como G03 v4 (voto, lei mais estreita) para Sandra Santana, Sonaira Fernandes e George Hato, com base na lista da CNN. Keit Lima não era vereadora na época. Se o projeto preferir tratar essa votação só no lote Alesp/municipal à parte, remover.
- **Delegada Raquel, SPDE05**: a entrevista da Revista Oeste (edição 200) retorna 403; a frase ("não há justificativa para o governo escolher não investir em segurança pública") foi atribuída a essa URL pelo resultado de busca, não pude abrir o texto. Vale conferir. G04 dela foi conferido no texto integral (Oeste, dez/2025).
- **Ely Santos, G05**: coautora do PL 1904/2024 (um PL, não PEC). Dei v2 (lei mais estreita que a afirmação, evidência única); PEC 29/2024 (vida desde a concepção) é coassinatura de PEC e não contou.
- **Sonaira Fernandes**: G05 v1 e G11 v1 por posições reiteradas em fontes distintas (Gazeta do Povo, perfil da CMSP, voto contra o PL 497/2021 por causa das cotas). G13 v4 com base no perfil oficial da CMSP ("pauta o mandato pela agenda conservadora, baseada na fé cristã e na família").
- **Luiza Erundina**: G05 v3 (2014: não faria aborto, mas não pode determinar às mulheres; defendeu manter a lei atual). G13 v2 pela mesma entrevista. Não achei fonte direta ligando-a à ADPF 442 (a ação foi do PSOL), por isso não usei.
- **Keit Lima**: SPDE04 ficou v4 (tarifa zero "gradual" e priorizando vulneráveis, uma única menção no programa). G14 v5 (PL 10/2025 na CMSP + proposta estadual).
- **Coronel Helena Reis, G04**: declaração de 2020 (campanha a prefeita), com critérios; v4. A fala "não descarta privatizações" é vaga demais, não usei.
- **Flávia Lancha**: SPDE03 v4 pela fala "o governo do Estado é muito focado na capital e no entorno". Apoio a subir o mínimo constitucional da educação de 25% para 30% não é sobre salário de professor; não usei para SPDE02.
- **Gerson Pires, G03**: programa com concessões, venda de imóveis ociosos, PPP de presídios e OSs; v4 (não fala em vender estatais).
- **Clau Camargo**: a frase sobre repasses ao interior foi do marido (prefeito de Arujá), não dela; não usei.
- **Ramalho da Construção, G14**: a página do Sintracon "vamos acabar com a escala 6x1" dá 404; usei a matéria da Rádio Peão Brasil (campanha salarial 2026 com fim da 6x1 e jornada de 40h).
- Municipal: tarifa zero aos domingos em Diadema (Márcio da Farmácia) não vale para SPDE04.


- Marcelo Aguiar: site diz "A fé que transforma vidas e guia cada decisão". Fala de fé pessoal, sem ligar a leis ou propostas; G13 não aplicado.
- Delegado Sandro Montanari: site pede "mais recursos, viaturas, efetivo policial" para a Região Bragantina. Usado em SPDE03 (4); não aplicado em SPDE05 porque o pedido é de redistribuição regional, não de mais orçamento total para segurança.
- Maria Paula (Araraquara) e outros vereadores: tarifa zero ou redução de tarifa municipal não usada em SPDE04 (regra do projeto).
- Reinaldo Alguz: um resumo de busca atribuiu a ele discurso contra o aborto na Alesp (sessão de 16/02/2012). Conferi a transcrição: o discurso é do deputado Carlos Cezar; Alguz só era secretário da sessão. Nada aplicado.
- Pr André Bueno: G09 = 4 a partir de post no X (27/03/2025) chamando de "político e não jurídico" o julgamento de Bolsonaro no STF. Caso-limite (crítica a um julgamento, não à extensão de poderes em geral); revisar se o projeto preferir um critério mais estrito.
- Mariana Conti, Gustavo Petta, Débora Camilo: defesa de reestatizar a Sabesp ou crítica à venda não usada em SPDE01 (a pergunta é sobre referendo).
- Código Florestal (Câmara, 24/05/2011, votação 17338-321 = Emenda 164; 17338-302 = texto-base): aplicado a G07 como no lote MG (extra_fed). Alexandre Leite e Marcelo Aguiar votaram Sim nos dois (2); Tripoli, Não nos dois (4). Esses votos não estavam em posicoesExistentes. As votações de 2012 do mesmo projeto não foram usadas.
- Thammy Miranda: G03 = 4 pelo voto Sim na Câmara Municipal de SP à adesão da capital ao contrato da Sabesp privatizada (02/05/2024, 37 x 17, lista da CartaCapital). Não usado em SPDE01 (a pergunta é sobre referendo).
- Douglas Garcia: G05 (2) e G11 (2) vêm de descrição jornalística das posições dele, não de fala entre aspas; G04 (5) tem fala direta de 2019 e descrição de 2026.
- Tarifa zero defendida em sites de campanha à Alesp (Gustavo Petta, Débora Camilo) usada em SPDE04 = 4, por ser proposta para o mandato estadual; não é voto municipal.
- Duda Hidalgo: site de campanha é renderizado por JavaScript e não abriu; bandeiras deixadas vazias.
- Alexandre Leite: está licenciado da Câmara desde 2025 (secretário estadual), por isso não tem votos de 2025 e 2026.
