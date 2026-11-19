from models.db_models import Tarefa, Quadro


def listar_por_quadro(db, quadro_id):
    return db.query(Tarefa).filter(Tarefa.quadro_id == quadro_id).all()


def buscar_por_id_quadro(db, tarefa_id, quadro_id):
    return db.query(Tarefa).filter(Tarefa.id == tarefa_id, Tarefa.quadro_id == quadro_id).first()


def listar_por_usuario(db, usuario_id):
    return db.query(Tarefa).join(Quadro, Tarefa.quadro_id == Quadro.id).filter(Quadro.usuario_id == usuario_id).all()
