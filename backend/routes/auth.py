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
            INSERT INTO usuarios(nome, email, senha)
            VALUES (%s, %s, %s)
            """,
            (
                usuario.nome,
                usuario.email,
                senha_hash
            )
        )

        conn.commit()

        return {
            "mensagem": "Usuário cadastrado com sucesso"
        }

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Usuário já cadastrado ou erro na operação."
        )

    finally:
        cursor.close()
        conn.close()


@router.post("/login")
def login(usuario: UsuarioLogin):
    conn = conectar()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT nome, email, senha, foto
        FROM usuarios   
        WHERE email = %s
        """,
        (usuario.email,)
    )

    resultado = cursor.fetchone()

    cursor.close()
    conn.close()

    if not resultado:
        raise HTTPException(
            status_code=401,
            detail="Usuário não encontrado"
        )

    # Acesso corrigido para DictCursor
    email = resultado["email"]
    senha_hash = resultado["senha"]

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
        "access_token": token,
        "usuario": {
            "nome": resultado["nome"],
            "email": email,
            "foto": resultado.get("foto"),
        },
    }
