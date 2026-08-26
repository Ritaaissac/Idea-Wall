from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

from models.usuario import UsuarioCadastro, UsuarioLogin, AlterarSenha
from models.db_models import Usuario
from database import get_db

router = APIRouter(tags=["Autenticação"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "IDEAWALL2026"


@router.post("/cadastro", status_code=status.HTTP_201_CREATED)
def cadastrar(usuario_in: UsuarioCadastro, db: Session = Depends(get_db)):
    usuario_existente = db.query(Usuario).filter(Usuario.email == usuario_in.email.strip()).first()
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuário já cadastrado."
        )

    novo_usuario = Usuario(
        nome=usuario_in.nome.strip(),
        email=usuario_in.email.strip(),
        senha=pwd_context.hash(usuario_in.senha)
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return {"mensagem": "Usuário cadastrado com sucesso"}


@router.post("/login")
def login(usuario_in: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == usuario_in.email.strip()).first()

    if not usuario or not pwd_context.verify(usuario_in.senha, usuario.senha):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos."
        )

    token = jwt.encode(
        {
            "sub": usuario.email,
            "exp": datetime.utcnow() + timedelta(hours=8)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    return {
        "access_token": token,
        "usuario": {
            "id": usuario.id,
            "nome": usuario.nome,
            "email": usuario.email,
            "foto": usuario.foto,
        },
    }


@router.put("/alterar-senha")
def alterar_senha(dados: AlterarSenha, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == dados.email.strip()).first()

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado."
        )

    if not pwd_context.verify(dados.senha_atual, usuario.senha):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A senha atual está incorreta."
        )

    usuario.senha = pwd_context.hash(dados.nova_senha)
    db.commit()

    return {"mensagem": "Senha alterada com sucesso!"}