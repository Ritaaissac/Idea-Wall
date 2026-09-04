from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List

from models.tarefa import TarefaCriar, TarefaEditar
from models.db_models import Usuario, Quadro, Tarefa
from database import get_db
from routes.quadros import obter_usuario_logado

router = APIRouter(prefix="/quadros/tarefas", tags=["Tarefas"])


def verificar_acesso_quadro(quadro_id: int, usuario_id: int, db: Session) -> Quadro:
    quadro = db.query(Quadro).filter(Quadro.id == quadro_id, Quadro.usuario_id == usuario_id).first()
    if not quadro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quadro não encontrado ou sem permissão de acesso."
        )
    return quadro


@router.get("")
def listar_tarefas(
    quadro_id: int,
    usuario_atual: Usuario = Depends(obter_usuario_logado),
    db: Session = Depends(get_db)
):
    verificar_acesso_quadro(quadro_id, usuario_atual.id, db)
    return db.query(Tarefa).filter(Tarefa.quadro_id == quadro_id).all()


@router.post("", status_code=status.HTTP_201_CREATED)
def criar_tarefa(
    quadro_id: int,
    tarefa_in: TarefaCriar,
    usuario_atual: Usuario = Depends(obter_usuario_logado),
    db: Session = Depends(get_db)
):
    verificar_acesso_quadro(quadro_id, usuario_atual.id, db)

    nova_tarefa = Tarefa(
        titulo=tarefa_in.titulo.strip(),
        data=(tarefa_in.data or "").strip(),
        status=tarefa_in.status or "a-fazer",
        quadro_id=quadro_id
    )
    db.add(nova_tarefa)
    db.commit()
    db.refresh(nova_tarefa)
    return nova_tarefa


@router.put("")
def editar_tarefa(
    quadro_id: int,
    tarefa_id: int,
    tarefa_in: TarefaEditar,
    usuario_atual: Usuario = Depends(obter_usuario_logado),
    db: Session = Depends(get_db)
):
    verificar_acesso_quadro(quadro_id, usuario_atual.id, db)

    tarefa = db.query(Tarefa).filter(Tarefa.id == tarefa_id, Tarefa.quadro_id == quadro_id).first()
    if not tarefa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tarefa não encontrada."
        )

    if tarefa_in.titulo is not None:
        tarefa.titulo = tarefa_in.titulo.strip()
    if tarefa_in.data is not None:
        tarefa.data = tarefa_in.data.strip()
    if tarefa_in.status is not None:
        tarefa.status = tarefa_in.status

    db.commit()
    db.refresh(tarefa)
    return tarefa


@router.delete("")
def excluir_tarefa(
    quadro_id: int,
    tarefa_id: int,
    usuario_atual: Usuario = Depends(obter_usuario_logado),
    db: Session = Depends(get_db)
):
    verificar_acesso_quadro(quadro_id, usuario_atual.id, db)

    tarefa = db.query(Tarefa).filter(Tarefa.id == tarefa_id, Tarefa.quadro_id == quadro_id).first()
    if not tarefa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tarefa não encontrada."
        )

    db.delete(tarefa)
    db.commit()
    return {"mensagem": "Tarefa excluída com sucesso!"}