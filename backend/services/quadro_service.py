from fastapi import HTTPException
from models.db_models import Quadro, Tarefa
from repositories import quadro_repository


def criar(db, usuario, dados):
    if not dados.titulo.strip():
        raise HTTPException(status_code=400, detail="O título é obrigatório.")
    quadro = Quadro(titulo=dados.titulo.strip(), descricao=(dados.descricao or "").strip(), icone=dados.icone or "pessoal", usuario_id=usuario.id)
    return quadro_repository.salvar(db, quadro)


def listar(db, usuario):
    return quadro_repository.listar_por_usuario(db, usuario.id)


def obter(db, usuario, quadro_id):
    quadro = quadro_repository.buscar_por_id_usuario(db, quadro_id, usuario.id)
    if not quadro:
        raise HTTPException(status_code=404, detail="Quadro não encontrado.")
    return quadro


def editar(db, usuario, quadro_id, dados):
    quadro = obter(db, usuario, quadro_id)
    quadro.titulo = dados.titulo.strip()
    quadro.descricao = (dados.descricao or "").strip()
    quadro.icone = dados.icone or quadro.icone
    db.commit()
    db.refresh(quadro)
    return quadro


def excluir(db, usuario, quadro_id):
    quadro = obter(db, usuario, quadro_id)
    db.delete(quadro)
    db.commit()
    return {"mensagem": "Quadro excluído com sucesso!"}


def estatisticas(db, usuario):
    quadros = quadro_repository.listar_por_usuario(db, usuario.id)
    tarefas = db.query(Tarefa).join(Quadro, Tarefa.quadro_id == Quadro.id).filter(Quadro.usuario_id == usuario.id).count()
    return {"quadros": len(quadros), "tarefas": tarefas}
