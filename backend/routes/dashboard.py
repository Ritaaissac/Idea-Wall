from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from datetime import date, datetime
import calendar

from database import get_db
from models.db_models import Usuario, Quadro, Tarefa
from routes.auth import SECRET_KEY


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

security = HTTPBearer()


def obter_usuario_logado(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Verifica o token JWT e retorna o usuário atualmente logado.
    """

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
        )

        email = payload.get("sub")

        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido."
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado."
        )

    usuario = db.query(Usuario).filter(
        Usuario.email == email
    ).first()

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado."
        )

    return usuario


def converter_data(data_tarefa):
    """
    Converte a data armazenada no banco para date.

    Aceita:
    YYYY-MM-DD
    DD/MM/YYYY
    YYYY-MM-DDTHH:MM:SS
    YYYY-MM-DDTHH:MM:SS.ffffff
    """

    if not data_tarefa:
        return None

    # Caso já seja um objeto date/datetime
    if isinstance(data_tarefa, datetime):
        return data_tarefa.date()

    if isinstance(data_tarefa, date):
        return data_tarefa

    data_tarefa = str(data_tarefa).strip()

    formatos = [
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%f"
    ]

    for formato in formatos:
        try:
            return datetime.strptime(
                data_tarefa,
                formato
            ).date()
        except ValueError:
            continue

    return None


def normalizar_status(status_tarefa):
    """
    Normaliza os status das tarefas para que o dashboard
    consiga contar corretamente.
    """

    if not status_tarefa:
        return "a-fazer"

    status_tarefa = str(status_tarefa).strip().lower()

    status_tarefa = (
        status_tarefa
        .replace("á", "a")
        .replace("ã", "a")
        .replace("â", "a")
        .replace("é", "e")
        .replace("ê", "e")
        .replace("í", "i")
        .replace("ó", "o")
        .replace("ô", "o")
        .replace("õ", "o")
        .replace("ú", "u")
    )

    status_tarefa = status_tarefa.replace("_", "-")
    status_tarefa = status_tarefa.replace(" ", "-")

    return status_tarefa


@router.get("")
def dashboard(
    usuario_atual: Usuario = Depends(obter_usuario_logado),
    db: Session = Depends(get_db)
):
    """
    Retorna todos os dados necessários para a página Dashboard.

    Os dados são filtrados pelo usuário logado.
    """

    hoje = date.today()

    # ==========================================================
    # BUSCAR TODAS AS TAREFAS DOS QUADROS DO USUÁRIO
    # ==========================================================

    tarefas = (
        db.query(Tarefa)
        .join(
            Quadro,
            Tarefa.quadro_id == Quadro.id
        )
        .filter(
            Quadro.usuario_id == usuario_atual.id
        )
        .all()
    )

    # ==========================================================
    # QUANTIDADE DE QUADROS
    # ==========================================================

    quantidade_quadros = (
        db.query(Quadro)
        .filter(
            Quadro.usuario_id == usuario_atual.id
        )
        .count()
    )

    # ==========================================================
    # CONTADORES
    # ==========================================================

    concluidas = 0
    em_andamento = 0
    a_fazer = 0

    # ==========================================================
    # TAREFAS DO DIA
    # ==========================================================

    tarefas_do_dia = []

    # ==========================================================
    # DIAS DO MÊS QUE POSSUEM TAREFAS
    # ==========================================================

    dias_com_tarefas = []

    # ==========================================================
    # PROCESSAR TAREFAS
    # ==========================================================

    for tarefa in tarefas:

        status_tarefa = normalizar_status(
            tarefa.status
        )

        # ------------------------------------------
        # CONTAR STATUS
        # ------------------------------------------

        if status_tarefa in [
            "concluido",
            "concluida"
        ]:
            concluidas += 1

        elif status_tarefa in [
            "em-andamento",
            "andamento"
        ]:
            em_andamento += 1

        else:
            a_fazer += 1

        # ------------------------------------------
        # CONVERTER DATA
        # ------------------------------------------

        data_tarefa = converter_data(
            tarefa.data
        )

        if not data_tarefa:
            continue

        # ------------------------------------------
        # TAREFAS DE HOJE
        # ------------------------------------------

        if data_tarefa == hoje:

            tarefas_do_dia.append({
                "id": tarefa.id,
                "titulo": tarefa.titulo,
                "status": tarefa.status,
                "data": tarefa.data,
                "quadro_id": tarefa.quadro_id
            })

        # ------------------------------------------
        # DIAS COM TAREFAS NO MÊS ATUAL
        # ------------------------------------------

        if (
            data_tarefa.year == hoje.year
            and data_tarefa.month == hoje.month
        ):

            if data_tarefa.day not in dias_com_tarefas:
                dias_com_tarefas.append(
                    data_tarefa.day
                )

    # ==========================================================
    # CALENDÁRIO DO MÊS
    # ==========================================================

    calendario = calendar.monthcalendar(
        hoje.year,
        hoje.month
    )

    # ==========================================================
    # NOME DO MÊS
    # ==========================================================

    nomes_meses = [
        "",
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ]

    # ==========================================================
    # RETORNO
    # ==========================================================

    return {

        # ------------------------------------------------------
        # USUÁRIO
        # ------------------------------------------------------

        "usuario": {
            "id": usuario_atual.id,
            "nome": usuario_atual.nome,
            "email": usuario_atual.email,
            "foto": usuario_atual.foto
        },

        # ------------------------------------------------------
        # DATA ATUAL
        # ------------------------------------------------------

        "data_atual": hoje.strftime(
            "%Y-%m-%d"
        ),

        "data_formatada": hoje.strftime(
            "%d/%m/%Y"
        ),

        # ------------------------------------------------------
        # MÊS
        # ------------------------------------------------------

        "mes": {
            "numero": hoje.month,
            "nome": nomes_meses[hoje.month],
            "ano": hoje.year
        },

        # ------------------------------------------------------
        # CALENDÁRIO
        # ------------------------------------------------------

        "calendario": calendario,

        # ------------------------------------------------------
        # DIAS COM TAREFAS
        # ------------------------------------------------------

        "dias_com_tarefas": sorted(
            dias_com_tarefas
        ),

        # ------------------------------------------------------
        # ESTATÍSTICAS
        # ------------------------------------------------------

        "estatisticas": {

            "concluidas": concluidas,

            "em_andamento": em_andamento,

            "a_fazer": a_fazer,

            "total": len(tarefas),

            "quadros": quantidade_quadros
        },

        # ------------------------------------------------------
        # TAREFAS DE HOJE
        # ------------------------------------------------------

        "tarefas_do_dia": tarefas_do_dia
    }