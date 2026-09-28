"""Posições por voto nominal na Câmara para os candidatos de um estado.

Usa as mesmas votações-chave de MG (data/positions/camara_votos.json) mais as votações que os agentes de MG
aplicaram de forma sistemática (Correios, Eletrobras, teto de gastos, maioridade penal), para que os dois
estados tenham o mesmo tratamento. Pareamento pelo nome civil do deputado com o nome completo no TSE.

Uso: python3 scripts/camara_votos_uf.py SP
"""
import json, sys, time, unicodedata, re, urllib.request
from collections import defaultdict
from pathlib import Path

UF = sys.argv[1].upper()
ROOT = Path(__file__).resolve().parent.parent
API = "https://dadosabertos.camara.leg.br/api/v2"
# MG usa as pastas originais do projeto (data/), os demais estados ficam em data/<uf>/.
PASTA = ROOT / "data" if UF == "MG" else ROOT / "data" / UF.lower()
SAIDA = PASTA / "positions" / f"camara_votos_{UF.lower()}.json"
CACHE = PASTA / "raw" / "camara_cache.json"

EXTRAS = [
    {"idVotacao": "2270894-103", "proposicao": "PL 591/2021 (privatização dos Correios)", "data": "2021-08-05", "pergunta": "G03", "valorSim": 4, "valorNao": 2},
    {"idVotacao": "2270789-73", "proposicao": "MP 1031/2021 (privatização da Eletrobras)", "data": "2021-05-19", "pergunta": "G03", "valorSim": 4, "valorNao": 2},
    {"idVotacao": "2088351-324", "proposicao": "PEC 241/2016 (teto de gastos), 2º turno", "data": "2016-10-25", "pergunta": "G01", "valorSim": 4, "valorNao": 2},
    {"idVotacao": "14493-536", "proposicao": "PEC 171/1993 (maioridade penal para crimes graves), 2º turno", "data": "2015-08-19", "pergunta": "G12", "valorSim": 4, "valorNao": 2},
    # Achadas pela pesquisa de SP e aplicadas aos dois estados.
    # Conanda: Sim (sustar o atendimento ao aborto legal) indica oposição à descriminalização; Não só defende a lei atual.
    {"idVotacao": "2482078-57", "proposicao": "PDL 3/2025 (sustou resolução do Conanda sobre aborto legal)", "data": "2025-11-05", "pergunta": "G05", "valorSim": 2, "valorNao": None},
    {"idVotacao": "596844-116", "proposicao": "PL 583/2011 (fim da saída temporária de presos)", "data": "2022-08-03", "pergunta": "DF06", "valorSim": 5, "valorNao": 1},
    {"idVotacao": "2153100-59", "proposicao": "PL 8703/2017, destaque sobre o artigo que criou o fundo eleitoral (Sim manteve)", "data": "2017-10-04", "pergunta": "DF05", "valorSim": 2, "valorNao": 4},
    # Admissibilidade na CCJ: mostra a direção, não a intensidade.
    {"idVotacao": "2428236-50", "proposicao": "PEC 45/2023 na CCJ (criminaliza porte de qualquer quantidade de droga)", "data": "2024-06-12", "pergunta": "G06", "valorSim": 2, "valorNao": 4},
    {"idVotacao": "1228863-102", "proposicao": "PEC 32/2015 na CCJ (maioridade penal aos 16 anos)", "data": "2026-06-10", "pergunta": "G12", "valorSim": 4, "valorNao": 2},
    {"idVotacao": "2410488-45", "proposicao": "PEC 8/2021 na CCJ (limita decisões monocráticas do STF)", "data": "2024-10-09", "pergunta": "G09", "valorSim": 4, "valorNao": 2},
]
# Lista de votações-chave levantada pelo agente de MG (o arquivo original fica em data/raw como referência).
votacoes = json.loads((ROOT / "data/raw/camara_votos_agente_mg.json").read_text())["votacoes"] + EXTRAS
# PEC 221/2019 (fim da 6x1) passou por 472 a 22 e 461 a 19: votação quase unânime não diferencia candidatos.
EXCLUIDAS = {"2233802-424", "2233802-438"}
# PL 2162/2023 em 10/12/2025 foi o substitutivo da dosimetria (reduz penas, sem anistia): Sim não é apoio à anistia.
AJUSTES = {"2358548-89": {"valorSim": 3, "valorNao": 2, "proposicao": "PL 2162/2023, substitutivo da dosimetria (reduz penas, sem anistia)"}}
votacoes = [{**v, **AJUSTES.get(v["idVotacao"], {})} for v in votacoes if v["idVotacao"] not in EXCLUIDAS]
cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}


def get(url):
    if url in cache:
        return cache[url]
    for tentativa in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"Accept": "application/json"}), timeout=60) as r:
                cache[url] = json.loads(r.read())["dados"]
                return cache[url]
        except Exception:
            time.sleep(2 * (tentativa + 1))
    raise RuntimeError(url)


def norm(s):
    s = unicodedata.normalize("NFD", s or "").encode("ascii", "ignore").decode().upper()
    return re.sub(r"\s+", " ", re.sub(r"[^A-Z ]", " ", s)).strip()


sel = json.loads((PASTA / "selected.json").read_text())
por_nome = {norm(c["nomeCompleto"]): c for c in sel if c.get("nomeCompleto")}
# Pareamentos conferidos à mão: o TSE usa nome social ou acrescenta sobrenome ao nome civil da Câmara.
MANUAIS = {"SP": {"Erika Hilton": "ERIKA HILTON", "Ely Santos": "ELY SANTOS", "Eleuses Paiva": "ELEUSES PAIVA"},
           "MG": {"Patrus Ananias": "PATRUS ANANIAS", "Duda Salabert": "DUDA SALABERT"}}.get(UF, {})
por_urna = {c["nomeUrna"]: c for c in sel}

votos_dep = defaultdict(dict)  # idCamara -> idVotacao -> "Sim"/"Não"
nomes = {}
for v in votacoes:
    for voto in get(f"{API}/votacoes/{v['idVotacao']}/votos"):
        d = voto["deputado_"]
        if d.get("siglaUf") != UF:
            continue
        votos_dep[d["id"]][v["idVotacao"]] = voto["tipoVoto"]
        nomes[d["id"]] = d["nome"]

candidatos, nao_pareados = {}, []
for dep_id, votos in votos_dep.items():
    civil = get(f"{API}/deputados/{dep_id}")["nomeCivil"]
    c = por_nome.get(norm(civil)) or por_urna.get(MANUAIS.get(nomes[dep_id], ""))
    if not c:
        nao_pareados.append(f"{nomes[dep_id]} ({civil})")
        continue
    por_q = defaultdict(list)
    for v in votacoes:
        tipo = votos.get(v["idVotacao"])
        if tipo not in ("Sim", "Não"):
            continue  # abstenção, obstrução, art. 17 e ausência não geram posição
        valor = v["valorSim"] if tipo == "Sim" else v["valorNao"]
        if valor is None:
            continue
        por_q[v["pergunta"]].append((valor, tipo, v))
    pos = {}
    for q, itens in por_q.items():
        media = round(sum(x[0] for x in itens) / len(itens))
        partes = [f"{t} em {v['proposicao']} ({v['data'][8:10]}/{v['data'][5:7]}/{v['data'][:4]})" for _, t, v in itens]
        pos[q] = {"v": media, "conf": "voto", "fonte": f"{API}/votacoes/{itens[0][2]['idVotacao']}/votos",
                  "nota": ("Votou " + "; ".join(partes) + ".")[:220]}
    if pos:
        candidatos[str(c["id"])] = {"nomeUrna": c["nomeUrna"], "cargo": c["cargo"], "idCamara": dep_id, "posicoes": pos}

CACHE.write_text(json.dumps(cache))
SAIDA.write_text(json.dumps({"metodo": "Mesmas votações-chave de MG mais Correios, Eletrobras, teto de gastos e maioridade penal. Sim/Não viram valor conforme valorSim/valorNao; duas votações na mesma pergunta: média arredondada.",
                             "votacoes": votacoes, "candidatos": candidatos, "naoPareados": sorted(nao_pareados)}, ensure_ascii=False, indent=1))
print(f"{UF}: {len(votos_dep)} deputados votaram; {len(candidatos)} candidatos com posições; não pareados: {len(nao_pareados)}")
for n in sorted(nao_pareados):
    print("  ", n)
