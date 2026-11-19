from datetime import datetime, date
import unicodedata
from fastapi import HTTPException
from models.db_models import Tarefa
from repositories import quadro_repository, tarefa_repository


def verificar_quadro(db, quadro_id, usuario_id):
    quadro = quadro_repository.buscar_por_id_usuario(db, quadro_id, usuario_id)
    if not quadro:
        raise HTTPException(status_code=404, detail="Quadro não encontrado ou sem permissão de acesso.")
    return quadro


def validar_data(valor):
    if not valor or not valor.strip():
        raise HTTPException(status_code=400, detail="A data da tarefa é obrigatória.")
    try:
        data = datetime.strptime(valor.strip(), "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Data inválida. Escolha uma data válida no calendário.")
    if data < date.today():
        raise HTTPException(status_code=400, detail="Não é permitido escolher uma data que já passou.")
    return valor.strip()


def normalizar_status(valor):
    valor = (valor or "a-fazer").strip().lower()
    valor = unicodedata.normalize("NFD", valor).encode("ascii", "ignore").decode("ascii").replace("_", "-").replace(" ", "-")
    if valor in ("a-fazer", "andamento", "em-andamento", "concluido", "concluida"):
        return {"andamento": "em-andamento", "concluida": "concluido"}.get(valor, valor)
    raise HTTPException(status_code=400, detail="Status inválido.")


def listar(db, usuario, quadro_id):
    verificar_quadro(db, quadro_id, usuario.id)
    return tarefa_repository.listar_por_quadro(db, quadro_id)


def criar(db, usuario, quadro_id, dados):
    verificar_quadro(db, quadro_id, usuario.id)
    tarefa = Tarefa(titulo=dados.titulo.strip(), data=validar_data(dados.data), status=normalizar_status(dados.status), quadro_id=quadro_id)
    db.add(tarefa)
    db.commit()
    db.refresh(tarefa)
    return tarefa


def editar(db, usuario, quadro_id, tarefa_id, dados):
    verificar_quadro(db, quadro_id, usuario.id)
    tarefa = tarefa_repository.buscar_por_id_quadro(db, tarefa_id, quadro_id)
    if not tarefa:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada.")
    if dados.titulo is not None:
        tarefa.titulo = dados.titulo.strip()
    if dados.data is not None:
        tarefa.data = validar_data(dados.data)
    if dados.status is not None:
        tarefa.status = normalizar_status(dados.status)
    db.commit()
    db.refresh(tarefa)
    return tarefa


def excluir(db, usuario, quadro_id, tarefa_id):
    verificar_quadro(db, quadro_id, usuario.id)
    tarefa = tarefa_repository.buscar_por_id_quadro(db, tarefa_id, quadro_id)
    if not tarefa:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada.")
    db.delete(tarefa)
    db.commit()
    return {"mensagem": "Tarefa excluída com sucesso!"}
