from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from jose import jwt, JWTError

from models.quadro import QuadroCriar
from database import conectar
from routes.auth import SECRET_KEY

router = APIRouter(prefix="/quadros", tags=["Quadros"])

def obter_usuario_logado(authorization: Optional[str]):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token de autenticação não fornecido.")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")

@router.post("")
def criar_quadro(quadro: QuadroCriar, authorization: Optional[str] = Header(None)):
    email_usuario = obter_usuario_logado(authorization)
    
    conn = conectar()
    cursor = conn.cursor()

    try:
        # Garante que a tabela de quadros exista
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS quadros (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                descricao TEXT,
                icone VARCHAR(50),
                usuario_email VARCHAR(255)
            )
        """)

        cursor.execute(
            """
            INSERT INTO quadros (titulo, descricao, icone, usuario_email)
            VALUES (%s, %s, %s, %s)
            """,
            (quadro.titulo, quadro.descricao, quadro.icone, email_usuario)
        )
        conn.commit()
        return {"mensagem": "Quadro criado com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar quadro: {str(e)}")
    finally:
        cursor.close()
        conn.close()