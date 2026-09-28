"""G03 e SPDE01 a partir da votação nominal da Alesp sobre a privatização da Sabesp.

Requerimento de encerramento da discussão do PL 1.501/2023, 05/12/2023, 58 a 20. Foi a única votação
nominal dividida do processo: a votação principal saiu 62 a 1 porque a oposição deixou o plenário.
Por ser votação de procedimento, vale no máximo 4 ou 2:
  G03 (privatizar sempre que possível): Sim = 4, Não = 2.
  SPDE01 (referendo para vender estatais): Sim = 2, Não = 4, porque a oposição defendia plebiscito.
Obstrução, licença e ausência não geram posição. Aplicada a todos os candidatos de SP que votaram.
"""
import json, re, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SP = ROOT / "data" / "sp"
FONTE = "https://www.al.sp.gov.br/repositorio/ementario/votacoes/9eee1206-2298-495c-a0a0-48733890f968.pdf"
texto = (SP / "raw/alesp/raw.txt").read_text()

VOTO = r"(Sim|Não|Obstrução|Licenciado|Abstenção|Presidente)"
linhas = []
for l in texto.splitlines():
    m = re.match(rf"^(.+?) {VOTO}( L)? (.+)$", l.strip())
    if m and m.group(1) not in ("Parlamentar",):
        linhas.append((m.group(1).strip(), m.group(2)))
sim = sum(1 for _, v in linhas if v == "Sim")
nao = sum(1 for _, v in linhas if v == "Não")
assert (sim, nao) == (58, 20), (sim, nao)


def norm(s):
    s = unicodedata.normalize("NFD", s or "").encode("ascii", "ignore").decode().upper()
    return re.sub(r"\s+", " ", re.sub(r"[^A-Z ]", " ", s)).strip()


sel = json.loads((SP / "selected.json").read_text())
por_urna = {norm(c["nomeUrna"]): c for c in sel}
# Nome parlamentar na Alesp diferente do nome de urna de 2026 (conferido pelo partido e pela eleição de 2022).
APELIDOS = {
    "CARLA S MORANDO": "CARLA MORANDO", "PAULA B FEMINISTA": "PAULA DA BANCADA FEMINISTA",
    "MONICA PRETAS": "MONICA DAS PRETAS", "PROF BEBEL": "PROFESSORA BEBEL",
    "LUIZ C MARCOLINO": "MARCOLINO", "ATILA JACOMUSSI": "ATILA JACOMUSSI",
    "EMIDIO DE SOUZA": "EMIDIO", "ROMULO FERNANDES": "ROMULO", "TEONILIO BARBA": "BARBA", "JORGE CARUSO": "CARUSO",
    "AGENTE FEDERAL DANILO BALAS": "DANILO BALAS", "CAPITAO TELHADA": "TELHADINHA CAPITAO TELHADA",
    "RAFAEL SILVA": "RAFAEL SILVA JR", "JORGE WILSON": "JORGE WILSON XERIFE CONSUMIDOR",
}
saida, sem_par = [], []
for nome, voto in linhas:
    if voto not in ("Sim", "Não"):
        continue
    c = por_urna.get(norm(APELIDOS.get(norm(nome), nome)))
    if not c:
        sem_par.append(f"{nome} ({voto})")
        continue
    data = "05/12/2023"
    nota = f"Votou {voto} no encerramento da discussão da privatização da Sabesp na Alesp ({data}), votação de procedimento."
    saida.append({"id": c["id"], "nomeUrna": c["nomeUrna"], "posicoes": {
        "G03": {"v": 4 if voto == "Sim" else 2, "conf": "voto", "fonte": FONTE, "nota": nota},
        "SPDE01": {"v": 2 if voto == "Sim" else 4, "conf": "voto", "fonte": FONTE, "nota": nota},
    }})
(SP / "positions/alesp_sabesp.json").write_text(json.dumps(saida, ensure_ascii=False, indent=1))
print(f"{len(saida)} candidatos com o voto; sem par entre os selecionados ({len(sem_par)}): {', '.join(sem_par)}")
