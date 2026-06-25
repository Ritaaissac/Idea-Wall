from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

from models.usuario import UsuarioCadastro, UsuarioLogin
from database import conectar

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"])

SECRET_KEY = "IDEAWALL2026"

@router.post("/cadastro")
def cadastrar(usuario: UsuarioCadastro):

    conn = conectar()
    cursor = conn.cursor()

    senha_hash = pwd_context.hash(usuario.senha)

    try:

        cursor.execute(
            """
            INSERT INTO usuarios(nome,email,senha)
            VALUES(?,?,?)
            """,
            (
                usuario.nome,
                usuario.email,
                senha_hash
            )
        )

        conn.commit()

        return {
            "mensagem":"Usuário cadastrado"
        }

    except:

        raise HTTPException(
            status_code=400,
            detail="Email já cadastrado"
        )

@router.post("/login")
def login(usuario: UsuarioLogin):

    conn = conectar()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT email, senha
        FROM usuarios
        WHERE email = ?
        """,
        (usuario.email,)
    )

    resultado = cursor.fetchone()

    if not resultado:
        raise HTTPException(
            status_code=401,
            detail="Usuário não encontrado"
        )

    email, senha_hash = resultado

    if not pwd_context.verify(
        usuario.senha,
        senha_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Senha inválida"
        )

    token = jwt.encode(
        {
            "sub": email,
            "exp": datetime.utcnow() + timedelta(hours=2)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

    return {
        "access_token": token
    }