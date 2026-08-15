from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from models.quadro import QuadroCriar
from database import conectar
from routes.auth import SECRET_KEY

router = APIRouter(prefix="/quadros", tags=["Quadros"])

security = HTTPBearer()

def obter_usuario_logado(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido: payload sem identificação."
            )
        return email
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado."
        )

@router.post("")
def criar_quadro(
    quadro: QuadroCriar,
    email_usuario: str = Depends(obter_usuario_logado)
):
    conn = conectar()
    cursor = conn.cursor()

    try:
        # 1. Busca o ID do usuário através do e-mail extraído do token
        cursor.execute("SELECT id FROM usuarios WHERE email = %s", (email_usuario,))
        usuario = cursor.fetchone()

        if not usuario:
            raise HTTPException(status_code=404, detail="Usuário não encontrado.")

        usuario_id = usuario["id"]

        # 2. Insere o quadro utilizando o usuario_id
        cursor.execute(
            """
            INSERT INTO quadros (titulo, descricao, icone, usuario_id)
            VALUES (%s, %s, %s, %s)
            """,
            (quadro.titulo, quadro.descricao, quadro.icone, usuario_id)
        )
        conn.commit()
        return {"mensagem": "Quadro criado com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar quadro: {str(e)}")
    finally:
        cursor.close()
        conn.close()