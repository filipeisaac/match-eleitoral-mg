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
        if arq.name in ("partidos.json", "camara_votos.json"):
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
