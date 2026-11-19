from models.db_models import Usuario


def buscar_por_email(db, email):
    return db.query(Usuario).filter(Usuario.email == email).first()


def salvar(db, usuario):
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario
