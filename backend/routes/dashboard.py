from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from datetime import date, datetime
import calendar

from database import get_db
from models.db_models import Usuario, Quadro, Tarefa
from routes.auth import SECRET_KEY


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

security = HTTPBearer()


def obter_usuario_logado(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
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
    if not data_tarefa:
        return None

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


@router.get("")
def dashboard(
    usuario_atual: Usuario = Depends(obter_usuario_logado),
    db: Session = Depends(get_db)
):
    hoje = date.today()

    tarefas = (
        db.query(Tarefa)
        .join(Quadro, Tarefa.quadro_id == Quadro.id)
        .filter(Quadro.usuario_id == usuario_atual.id)
        .all()
    )

    quadros = (
        db.query(Quadro)
        .filter(Quadro.usuario_id == usuario_atual.id)
        .count()
    )

    concluidas = 0
    em_andamento = 0
    a_fazer = 0

    tarefas_do_dia = []

    dias_com_tarefas = []

    for tarefa in tarefas:
        status_tarefa = (tarefa.status or "").lower().strip()

        if status_tarefa in ["concluido", "concluída", "concluida", "concluído"]:
            concluidas += 1

        elif status_tarefa in ["em-andamento", "em andamento"]:
            em_andamento += 1

        else:
            a_fazer += 1

        data_tarefa = converter_data(tarefa.data)

        if data_tarefa:
            if data_tarefa == hoje:
                tarefas_do_dia.append({
                    "id": tarefa.id,
                    "titulo": tarefa.titulo,
                    "status": tarefa.status,
                    "data": tarefa.data,
                    "quadro_id": tarefa.quadro_id
                })

            if (
                data_tarefa.year == hoje.year
                and data_tarefa.month == hoje.month
            ):
                if data_tarefa.day not in dias_com_tarefas:
                    dias_com_tarefas.append(data_tarefa.day)

    calendario = calendar.monthcalendar(
        hoje.year,
        hoje.month
    )

    return {
        "usuario": {
            "id": usuario_atual.id,
            "nome": usuario_atual.nome,
            "email": usuario_atual.email,
            "foto": usuario_atual.foto
        },

        "data_atual": hoje.strftime("%Y-%m-%d"),

        "data_formatada": hoje.strftime("%d/%m/%Y"),

        "mes": {
            "numero": hoje.month,
            "nome": [
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
            ][hoje.month],
            "ano": hoje.year
        },

        "calendario": calendario,

        "dias_com_tarefas": sorted(dias_com_tarefas),

        "estatisticas": {
            "concluidas": concluidas,
            "em_andamento": em_andamento,
            "a_fazer": a_fazer,
            "total": len(tarefas),
            "quadros": quadros
        },

        "tarefas_do_dia": tarefas_do_dia
    }