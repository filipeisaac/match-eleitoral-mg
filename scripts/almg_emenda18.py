"""DE02 a partir da votação nominal da Emenda 18 ao PL 2.309/2024 na ALMG (06/06/2024).

A emenda propunha recompor o piso dos professores da rede estadual em 33,24% e foi rejeitada por 28 a 36.
A lista nominal está no Diário do Legislativo de 11/06/2024 (data/raw/almg/DL20240611.txt).
Aplicada a todos os candidatos a deputado estadual que votaram, não só a um lote.
Sim = 4 e Não = 2: o voto mostra a direção, não a intensidade máxima da afirmação.
"""
import json, re, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONTE = "https://diariolegislativo.almg.gov.br/2024/L20240611.pdf"
texto = (ROOT / "data/raw/almg/DL20240611.txt").read_text()
bloco = texto[texto.index("Em votação, a Emenda nº 18."):texto.index("Registro de Presença", texto.index("Em votação, a Emenda nº 18."))]
sim_txt, nao_txt = bloco.split("Registraram “não”:")
sim_txt = sim_txt.split("Registraram “sim”:")[1]

def nomes(t):
    return [m.group(1).strip() for m in re.finditer(r"^\s*([A-ZÀ-Ú][^\n()]+?)\s*\(([A-ZÀ-Ú]+)\)\s*$", t, re.M)]

def norm(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().upper()
    return re.sub(r"[^A-Z ]", "", s).replace("DOUTOR ", "DR ").replace("DR ", "DR ").strip()

sim, nao = nomes(sim_txt), nomes(nao_txt)
assert len(sim) == 28 and len(nao) == 36, (len(sim), len(nao))

sel = [c for c in json.loads((ROOT / "data/selected.json").read_text()) if c["cargoCod"] == 7]
por_nome = {norm(c["nomeUrna"]): c for c in sel}
# Nome de urna de 2026 diferente do nome parlamentar na ata (conferido pelo nome civil e pela eleição de 2022).
APELIDOS = {"Leandro Genaro": "LEANDRO GENARO JUNTOS SOMOS +", "Duarte Bechir": "DUARTE", "Vitório Júnior": "VITÓRIO",
            "Arnaldo Silva": "ARNALDO", "Maria Clara Marra": "MARIA CLARA"}
for ata, urna in APELIDOS.items():
    por_nome[norm(ata)] = por_nome[norm(urna)]
saida, sem_par = [], []
for lista, v, palavra in ((sim, 4, "Sim"), (nao, 2, "Não")):
    for n in lista:
        c = por_nome.get(norm(n))
        if not c:
            sem_par.append(n)
            continue
        saida.append({"id": c["id"], "nomeUrna": c["nomeUrna"], "posicoes": {"DE02": {
            "v": v, "conf": "voto", "fonte": FONTE,
            "nota": f"Votou {palavra} na Emenda 18 ao PL 2.309/2024 (recompor em 33,24% o piso dos professores), rejeitada em 06/06/2024.",
        }}})
(ROOT / "data/positions/almg_de02_piso.json").write_text(json.dumps(saida, ensure_ascii=False, indent=1))
print(f"{len(saida)} candidatos com DE02; sem par entre os candidatos selecionados: {', '.join(sem_par)}")
