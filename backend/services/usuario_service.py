from fastapi import HTTPException
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from config import SECRET_KEY
from models.db_models import Usuario
from repositories import usuario_repository

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def cadastrar(db, dados):
    email = str(dados.email).strip().lower()
    if usuario_repository.buscar_por_email(db, email):
        raise HTTPException(status_code=400, detail="Usuário já cadastrado.")
    if len(dados.senha) < 6:
        raise HTTPException(status_code=400, detail="A senha deve conter pelo menos 6 caracteres.")
    usuario = Usuario(nome=dados.nome.strip(), email=email, senha=pwd_context.hash(dados.senha))
    try:
        usuario_repository.salvar(db, usuario)
    except Exception:
        db.rollback()
        raise
    return {"mensagem": "Usuário cadastrado com sucesso"}


def login(db, dados):
    email = str(dados.email).strip().lower()
    usuario = usuario_repository.buscar_por_email(db, email)
    if not usuario or not pwd_context.verify(dados.senha, usuario.senha):
        raise HTTPException(status_code=401, detail="E-mail ou senha inválidos.")
    token = jwt.encode({"sub": usuario.email, "exp": datetime.utcnow() + timedelta(hours=8)}, SECRET_KEY, algorithm="HS256")
    return {"access_token": token, "usuario": {"id": usuario.id, "nome": usuario.nome, "email": usuario.email, "foto": usuario.foto}}


def alterar_senha(db, usuario, dados):
    if not pwd_context.verify(dados.senha_atual, usuario.senha):
        raise HTTPException(status_code=400, detail="A senha atual está incorreta.")
    if len(dados.nova_senha) < 6:
        raise HTTPException(status_code=400, detail="A nova senha deve conter pelo menos 6 caracteres.")
    usuario.senha = pwd_context.hash(dados.nova_senha)
    db.commit()
    return {"mensagem": "Senha alterada com sucesso!"}


def atualizar_foto(db, usuario, dados):
    usuario.foto = dados.foto
    db.commit()
    return {"mensagem": "Foto de perfil atualizada com sucesso!"}
