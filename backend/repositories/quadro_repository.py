from models.db_models import Quadro


def listar_por_usuario(db, usuario_id):
    return db.query(Quadro).filter(Quadro.usuario_id == usuario_id).order_by(Quadro.id.desc()).all()


def buscar_por_id_usuario(db, quadro_id, usuario_id):
    return db.query(Quadro).filter(Quadro.id == quadro_id, Quadro.usuario_id == usuario_id).first()


def salvar(db, quadro):
    db.add(quadro)
    db.commit()
    db.refresh(quadro)
    return quadro
