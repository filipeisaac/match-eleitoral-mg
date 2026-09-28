"""Aplica as correções revisadas da segunda passada (26/09/2026).

Cada item foi conferido contra a fonte citada nos arquivos *_correcoes.md e decidido com o mesmo
critério para todos os candidatos. Rodar de novo é seguro: o script só grava valores finais.
"""
import json
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"
POS = DATA / "positions"


def carregar(nome):
    return json.loads((POS / nome).read_text())


def salvar(nome, dados):
    (POS / nome).write_text(json.dumps(dados, ensure_ascii=False, indent=1))


def candidato(lista, nome):
    achados = [c for c in lista if c["nomeUrna"] == nome]
    assert len(achados) == 1, f"{nome}: {len(achados)} registros"
    return achados[0]


def definir(arquivo, nome, q, **campos):
    lista = carregar(arquivo)
    c = candidato(lista, nome)
    pos = c.setdefault("posicoes", {})
    if campos.get("omitir"):
        pos.pop(q, None)
    else:
        pos.setdefault(q, {}).update(campos)
    salvar(arquivo, lista)


# ---------- Presidente ----------
# Clariana G06: a posição vem da reportagem da Band, não do plano registrado.
definir("presidente.json", "CLARIANA BARAO", "G06",
        nota="Segundo a Band (17/09/2026), é contra flexibilizar as leis sobre drogas; o plano registrado só cita o combate ao narcotráfico.")
# Clariana G11: a frase sobre cotas não foi encontrada na fonte primária.
definir("presidente.json", "CLARIANA BARAO", "G11", omitir=True)
# Avalanche G08: criticar as prisões do 8/1 não é defender anistia (mesmo critério aplicado a Sargento Rodrigues).
definir("presidente.json", "LEONARDO AVALANCHE", "G08", omitir=True)
# Flávio G03: registrar a exceção da Petrobras, como foi feito para Caiado e Cury.
lista = carregar("presidente.json")
g03 = candidato(lista, "FLAVIO BOLSONARO")["posicoes"].get("G03")
if g03 and "Petrobras" not in (g03.get("nota") or ""):
    g03["nota"] = (g03.get("nota") or "").rstrip(".") + ". Exceção: em 09/02/2026 disse que a Petrobras deve seguir sob controle estatal."
    g03["nota"] = g03["nota"][:220]
salvar("presidente.json", lista)

# ---------- Governador ----------
definir("governador.json", "CLEITINHO AZEVEDO", "GV01",
        nota="Em ago/2026 disse não ter vontade de privatizar a Cemig e, em 17/09/2026, que não venderá estatais lucrativas; em 2022 defendia privatizar a Cemig.")

# ---------- Senado ----------
definir("senador.json", "ANA LUIZA DO MLB", "G03", v=1, conf="declaracao",
        fonte="https://www.youtube.com/watch?v=4DXjLD7B5V0",
        nota="Na Itatiaia (01/09/2026), disse ser contra qualquer privatização, citando Cemig e Copasa.")
definir("senador.json", "ARCANJO PIMENTA", "S01", v=4, conf="declaracao",
        fonte="https://diariodocomercio.com.br/politica/aro-e-pimenta-defendem-impeachment-de-ministros-do-stf-em-sabatina/",
        nota="Em sabatina (24/09/2026) e em manifesto (02/09/2026), defendeu que o Senado analise pedidos de impeachment de ministros, com direito de defesa.")
definir("senador.json", "MANOEL CARVALHO", "G01", v=3,
        nota="No debate de 08/09/2026 defendeu menos impostos e máquina menor, mas também mais recursos para agricultura, saúde e municípios.")
definir("senador.json", "MANOEL CARVALHO", "S02", v=5,
        nota="Defende mandato fixo para ministros do STF; reiterou no manifesto de 02/09/2026 (12 anos, sem recondução).")
definir("senador.json", "VICTÓRIA MELLO VIC", "G01",
        fonte="https://rede98.com.br/eleicoes2026/victoria-mello-pstu-defende-escala-4-x-3-em-sabatina-na-98-news/",
        nota="Na 98 News (11/09/2026) disse que vai propor no Senado o fim do arcabouço fiscal.")
lista = carregar("senador.json")
g09 = candidato(lista, "CARLIN MOURA")["posicoes"].get("G09")
if g09 and g09.get("nota"):
    g09["nota"] = g09["nota"].replace("24/08/2026", "25/08/2026")
salvar("senador.json", lista)
definir("senador.json", "AÉCIO NEVES", "G02", v=3,
        fonte="https://www.psdb.org.br/acompanhe/noticias/em-entrevista-ao-canal-livre-aecio-neves-defende-uma-nova-via-para-o-brasil/",
        nota="Em 2023 defendeu ampliar programas sociais; em 06/2026 enfatizou 'portas de saída' e criticou a 'administração da pobreza'.")
lista = carregar("senador.json")
aecio = candidato(lista, "AÉCIO NEVES")["posicoes"]
if "G03" in aecio and "privatizações" not in aecio["G03"].get("nota", ""):
    aecio["G03"]["nota"] = "Em 05/2026 pediu suspender a venda da Copasa; em 06/2026 defendeu 'retomar o caminho das privatizações'. Posição mista."
if "S04" in aecio:
    aecio["S04"]["nota"] = "Votou Sim no 1º turno da PEC 10/2013 (fim do foro) em 2017 e não compareceu no 2º; em 2025 defendeu manter o foro."
salvar("senador.json", lista)
definir("senador.json", "ÁUREA CAROLINA", "G07", v=4,
        fonte="https://www.otempo.com.br/eleicoes/2026/senadores/2026/8/19/veja-o-que-os-candidatos-ao-senado-por-minas-gerais-pensam-sobre-mineracao",
        nota="Defende proteção ambiental e dos atingidos, mas em 19/08/2026 falou em conciliar mineração com industrialização.")
definir("senador.json", "ÁUREA CAROLINA", "G10",
        fonte="https://www.otempo.com.br/eleicoes/2026/senadores/2026/9/23/aecio-endossa-coro-contra-o-stf-e-internet-e-rodovias-viram-alvo-em-propaganda-de-candidatos",
        nota="Na propaganda de 23/09/2026 comprometeu-se com a 'regulação das plataformas digitais para proteger o povo brasileiro'.")

# ---------- Contexto das perguntas ----------
q = json.loads((DATA / "questions.json").read_text())
contextos = {
    "G02": "O Bolsa Família atende cerca de 19 milhões de famílias e é um dos maiores gastos sociais do orçamento federal.",
    "G06": "Em 2024 o STF definiu que portar maconha para uso pessoal é infração administrativa, não crime, e fixou 40 gramas como referência. Uma PEC que criminaliza o porte de qualquer quantidade já passou no Senado e está na Câmara.",
    "G08": "Mais de 1.300 pessoas foram condenadas pelo STF pela invasão das sedes dos Três Poderes. Em 2026 o Congresso aprovou a redução de penas para parte delas; propostas de anistia ampla não foram aprovadas.",
    "G10": "Em 2025 o STF ampliou a responsabilidade das plataformas e, em 2026, ajustou a regra para casos de falha sistêmica. Críticos veem risco à liberdade de expressão.",
    "G11": "As cotas nas universidades federais foram renovadas em 2023, e as de concursos federais em 2025, quando subiram para 30%. As duas leis preveem revisão em 10 anos.",
    "G14": "A escala 6x1 tem seis dias de trabalho para um de folga. Em 2026 a Câmara aprovou uma PEC que reduz a jornada para 40 horas semanais, com duas folgas; ela aguarda o plenário do Senado.",
    "P02": "Desde 2026 quem ganha até R$ 5 mil não paga IR, e há um imposto mínimo para rendas acima de R$ 600 mil por ano (R$ 50 mil por mês). A pergunta é se essa cobrança deve ser mantida ou ampliada.",
    "P03": "A China é o maior comprador de produtos brasileiros; os EUA aplicaram tarifas extras sobre produtos do Brasil em 2025 e novamente em 2026.",
    "S01": "Só o Senado pode processar ministros do STF por crime de responsabilidade. Hoje, por decisão provisória do STF, abrir o processo exige dois terços dos senadores. Nenhum pedido foi levado adiante até hoje.",
    "S04": "Hoje deputados, senadores e ministros de Estado são julgados pelo STF por crimes cometidos no cargo e ligados à função, mesmo depois de deixarem o cargo.",
    "DF02": "É o tema da chamada PEC da Blindagem, aprovada pela Câmara e rejeitada na CCJ do Senado, que a arquivou, em 2025.",
    "DF03": "É a tese do marco temporal. O Congresso a aprovou em lei em 2023, o STF a declarou inconstitucional em 2025, e uma PEC para incluí-la na Constituição, já aprovada pelo Senado, está na Câmara.",
    "DF05": "O fundo eleitoral é dividido entre os partidos. Em 2026 é de cerca de R$ 4,9 bilhões, o mesmo valor de 2022.",
    "GV06": "Nessas escolas, militares atuam na gestão disciplinar e professores civis cuidam do ensino. A Justiça mandou encerrar as 9 escolas estaduais do modelo em 2026, e a ALMG analisa projetos para recriá-lo.",
}
for s in q["secoes"]:
    for p in s["perguntas"]:
        if p["id"] in contextos:
            p["contexto"] = contextos[p["id"]]
(DATA / "questions.json").write_text(json.dumps(q, ensure_ascii=False, indent=2))
print("correções aplicadas")


# ---------- Deputados (segunda passada) ----------
def definir_onde(nome, q, **campos):
    """Aplica a correção no arquivo de pesquisa que tem essa pergunta para o candidato."""
    for arq in sorted(POS.glob("*.json")):
        if arq.name.startswith(("partidos", "camara_votos")):
            continue
        lista = json.loads(arq.read_text())
        for c in lista:
            if c.get("nomeUrna") == nome and q in c.get("posicoes", {}):
                if campos.get("omitir"):
                    del c["posicoes"][q]
                else:
                    c["posicoes"][q].update(campos)
                arq.write_text(json.dumps(lista, ensure_ascii=False, indent=1))
                return arq.name
    return None


correcoes_deputados = [
    ("DR. PAULO", "G03", dict(v=3, nota="Votou pela privatização da Copasa (12/2025), mas em 26/03/2026 disse não acreditar na privatização da Cemig. Posição mista.")),
    ("RAFHAEL DE PAULO", "G05", dict(v=1, nota="Autor de moção (28/09/2023) e dos requerimentos 609/2023 e 175/2024 em Unaí contra a descriminalização do aborto.")),
    ("ROBERTA LOPES", "G05", dict(fonte="https://www.camarajf.mg.gov.br/www/vereadores/exibir/42")),
    ("GILMAR MACHADO", "G07", dict(v=3, nota="Em 24/05/2011 votou contra a Emenda 164 ao Código Florestal, mas a favor do texto geral do novo Código. Registro misto.")),
    # Criticar as prisões do 8/1 não é defender anistia (mesmo critério de Avalanche e Sargento Rodrigues).
    ("VILE SANTOS", "G08", dict(omitir=True)),
]
for nome, q, campos in correcoes_deputados:
    arq = definir_onde(nome, q, **campos)
    print(f"{nome} {q}: {arq or 'NÃO ENCONTRADO'}")


# ---------- Contexto das perguntas de SP (checagem de 27/09/2026) ----------
q = json.loads((DATA / "questions.json").read_text())
sp = q["estados"]["SP"]
contextos_sp = {
    "SPGV01": "A Sabesp foi privatizada em 2024, e o estado concedeu rodovias e linhas de trem da CPTM. Em julho de 2026, após falhas, três linhas recém-concedidas voltaram temporariamente à operação da CPTM.",
    "SPGV02": "A PM paulista adotou em 2020 câmeras com gravação contínua. Em 2024 o governo passou a um modelo de gravação acionada, e um acordo homologado pelo STF em 2025 criou o acionamento remoto e automático.",
    "SPGV03": "As Operações Escudo e Verão, entre 2023 e 2024, deixaram 84 mortos na Baixada Santista. O governo destaca as mais de 2 mil prisões; críticos apontam abusos e execuções.",
    "SPGV04": "Nessas escolas, policiais militares atuam como monitores de disciplina e professores civis cuidam do ensino. A lei é de 2024, 100 escolas adotaram o modelo em 2026, e o STF ainda julga se ela é válida.",
    "SPGV06": "A lei permite internar dependentes químicos contra a vontade em casos específicos, com laudo médico. O tema ganhou força com a Cracolândia, no centro da capital, e divide especialistas em saúde e segurança.",
    "SPDE01": "A Alesp aprovou a privatização da Sabesp em dezembro de 2023, sem consulta popular, e a venda foi concluída em 2024. A oposição defendia um plebiscito.",
    "SPDE04": "Em 2026 a passagem do Metrô e da CPTM subiu para R$ 5,40, e o estado previu cerca de R$ 5,1 bilhões para cobrir a diferença entre a tarifa e o custo do sistema.",
    "SPDE05": "O estado comanda as polícias e o sistema prisional. Em 2026 a segurança tem R$ 21,1 bilhões no orçamento, contra R$ 37,9 bilhões da saúde e R$ 33,3 bilhões da educação, que têm gastos mínimos obrigatórios.",
}
textos_sp = {"SPGV06": "A internação involuntária de dependentes químicos deve ser ampliada."}
for secao in (sp["governador"], sp["deputado_estadual"]):
    for p in secao["perguntas"]:
        if p["id"] in contextos_sp:
            p["contexto"] = contextos_sp[p["id"]]
        if p["id"] in textos_sp:
            p["texto"] = textos_sp[p["id"]]
(DATA / "questions.json").write_text(json.dumps(q, ensure_ascii=False, indent=2))
print("contextos de SP atualizados")


# ---------- SP: voto "Não" no PDL do Conanda não é posição sobre descriminalizar o aborto ----------
# Mesmo critério de MG: defender o aborto nos casos já legais não é defender a descriminalização (G05).
SP_POS = DATA / "sp" / "positions"
arq = SP_POS / "sp_fed_inc.json"
if arq.exists():
    lista = json.loads(arq.read_text())
    removidas = 0
    for c in lista:
        g05 = c.get("posicoes", {}).get("G05")
        if g05 and g05.get("conf") == "voto" and "2482078-57" in (g05.get("fonte") or "") and g05.get("v", 0) >= 3:
            del c["posicoes"]["G05"]
            removidas += 1
    arq.write_text(json.dumps(lista, ensure_ascii=False, indent=1))
    print(f"SP G05 (Conanda, voto Não): {removidas} removidas")


# ---------- Votações que não medem a afirmação (revisão de 27/09/2026, vale para MG e SP) ----------
def cita(p, *marcas):
    txt = (p.get("fonte") or "") + " " + (p.get("nota") or "")
    return any(m in txt for m in marcas)

PEC221 = ("2233802", "PEC 221")          # fim da 6x1: 472 a 22, quase unânime
DOSIMETRIA = ("2358548", "osimetria")     # 10/12/2025: reduz penas, sem anistia

# Partidos: G14 vinda da votação quase unânime da PEC 221 sai.
arq = POS / "partidos.json"
partidos = json.loads(arq.read_text())
n = 0
for sigla, pos in partidos.items():
    if "G14" in pos and cita(pos["G14"], *PEC221):
        del pos["G14"]; n += 1
arq.write_text(json.dumps(partidos, ensure_ascii=False, indent=1))
print(f"partidos: G14 da PEC 221 removida de {n}")

for pasta in (POS, DATA / "sp" / "positions"):
    for arq in sorted(pasta.glob("*.json")):
        if arq.name.startswith(("partidos", "camara_votos", "alesp_sabesp")):
            continue
        lista = json.loads(arq.read_text())
        mudou = []
        for c in lista:
            pos = c.get("posicoes", {})
            g14 = pos.get("G14")
            if g14 and g14.get("conf") == "voto" and cita(g14, *PEC221):
                del pos["G14"]; mudou.append(f"{c['nomeUrna']} G14 removida")
            g08 = pos.get("G08")
            if g08 and g08.get("conf") == "voto" and cita(g08, *DOSIMETRIA):
                # Só votos: dosimetria Sim = 3, Não = 2; combinado com a urgência da anistia, fica na média.
                if g08["v"] == 4 and "urgência" not in (g08.get("nota") or "") and "coautor" not in (g08.get("nota") or ""):
                    g08["v"] = 3; mudou.append(f"{c['nomeUrna']} G08 4->3")
                elif g08["v"] == 1:
                    g08["v"] = 2; mudou.append(f"{c['nomeUrna']} G08 1->2")
        if mudou:
            arq.write_text(json.dumps(lista, ensure_ascii=False, indent=1))
            print(f"{arq.name}: {'; '.join(mudou)}")

# ---------- SP: casos das notas de revisão ----------
# Criticar um julgamento específico do STF não é dizer que o tribunal extrapola seus poderes (mesmo critério de MG).
def definir_onde_sp(nome, q, **campos):
    for arq in sorted((DATA / "sp" / "positions").glob("sp_*.json")):
        lista = json.loads(arq.read_text())
        for c in lista:
            if c.get("nomeUrna") == nome and q in c.get("posicoes", {}):
                if campos.get("omitir"):
                    del c["posicoes"][q]
                else:
                    c["posicoes"][q].update(campos)
                arq.write_text(json.dumps(lista, ensure_ascii=False, indent=1))
                return arq.name
    return None

print("PR ANDRE BUENO G09:", definir_onde_sp("PR ANDRE BUENO", "G09", omitir=True) or "já sem G09")
# Apoiar o fim da 6x1 com ressalvas sobre o custo é posição mista (mesmo critério de André do Prado).
print("SONINHA FRANCINE G14:", definir_onde_sp("SONINHA FRANCINE", "G14", v=3,
      nota="Diz ser a favor do fim da 6x1 com ressalvas; no debate de 23/09/2026 levantou preocupação com os custos. Posição mista."))
