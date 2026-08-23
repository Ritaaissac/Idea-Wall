from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from pydantic import BaseModel

from models.quadro import QuadroCriar
from database import conectar
from routes.auth import SECRET_KEY


router = APIRouter(prefix="/quadros", tags=["Quadros"])

security = HTTPBearer()


# =====================================================
# AUTENTICAÇÃO
# =====================================================

def obter_usuario_logado(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"]
        )

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


# =====================================================
# MODELO PARA EDITAR QUADRO
# =====================================================

class QuadroEditar(BaseModel):
    titulo: str
    descricao: str = ""
    icone: str = "pessoal"


# =====================================================
# CRIAR QUADRO
# =====================================================

@router.post("")
def criar_quadro(
    quadro: QuadroCriar,
    email_usuario: str = Depends(obter_usuario_logado)
):
    conn = conectar()
    cursor = conn.cursor()

    try:

        # Busca o usuário pelo e-mail
        cursor.execute(
            "SELECT id FROM usuarios WHERE email = %s",
            (email_usuario,)
        )

        usuario = cursor.fetchone()

        if not usuario:
            raise HTTPException(
                status_code=404,
                detail="Usuário não encontrado."
            )

        usuario_id = usuario["id"]

        # Cria o quadro
        cursor.execute(
            """
            INSERT INTO quadros
                (titulo, descricao, icone, usuario_id)
            VALUES
                (%s, %s, %s, %s)
            """,
            (
                quadro.titulo,
                quadro.descricao,
                quadro.icone,
                usuario_id
            )
        )

        conn.commit()

        return {
            "mensagem": "Quadro criado com sucesso!"
        }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as e:
        conn.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao criar quadro: {str(e)}"
        )

    finally:
        cursor.close()
        conn.close()


# =====================================================
# LISTAR QUADROS
# =====================================================

@router.get("")
def listar_quadros(
    email_usuario: str = Depends(obter_usuario_logado)
):
    conn = conectar()
    cursor = conn.cursor()

    try:

        # Busca o usuário
        cursor.execute(
            """
            SELECT id
            FROM usuarios
            WHERE email = %s
            """,
            (email_usuario,)
        )

        usuario = cursor.fetchone()

        if not usuario:
            raise HTTPException(
                status_code=404,
                detail="Usuário não encontrado."
            )

        usuario_id = usuario["id"]

        # Busca somente os quadros do usuário
        cursor.execute(
            """
            SELECT
                id,
                titulo,
                descricao,
                icone,
                criado_em
            FROM quadros
            WHERE usuario_id = %s
            ORDER BY id DESC
            """,
            (usuario_id,)
        )

        quadros = cursor.fetchall()

        return quadros

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao listar quadros: {str(e)}"
        )

    finally:
        cursor.close()
        conn.close()


# =====================================================
# EDITAR QUADRO
# =====================================================

@router.put("/{quadro_id}")
def editar_quadro(
    quadro_id: int,
    quadro: QuadroEditar,
    email_usuario: str = Depends(obter_usuario_logado)
):
    conn = conectar()
    cursor = conn.cursor()

    try:

        # ---------------------------------------------
        # Busca o usuário
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT id
            FROM usuarios
            WHERE email = %s
            """,
            (email_usuario,)
        )

        usuario = cursor.fetchone()

        if not usuario:
            raise HTTPException(
                status_code=404,
                detail="Usuário não encontrado."
            )

        usuario_id = usuario["id"]


        # ---------------------------------------------
        # Verifica se o quadro pertence ao usuário
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT
                id,
                titulo,
                descricao,
                icone
            FROM quadros
            WHERE id = %s
              AND usuario_id = %s
            """,
            (quadro_id, usuario_id)
        )

        quadro_existente = cursor.fetchone()

        if not quadro_existente:
            raise HTTPException(
                status_code=404,
                detail="Quadro não encontrado."
            )


        # ---------------------------------------------
        # Validação do título
        # ---------------------------------------------

        titulo = quadro.titulo.strip()

        if not titulo:
            raise HTTPException(
                status_code=400,
                detail="O título do quadro não pode ficar vazio."
            )


        # ---------------------------------------------
        # Atualiza o quadro
        # ---------------------------------------------

        cursor.execute(
            """
            UPDATE quadros
            SET
                titulo = %s,
                descricao = %s,
                icone = %s
            WHERE id = %s
              AND usuario_id = %s
            """,
            (
                titulo,
                quadro.descricao.strip(),
                quadro.icone,
                quadro_id,
                usuario_id
            )
        )

        conn.commit()


        # ---------------------------------------------
        # Busca o quadro atualizado
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT
                id,
                titulo,
                descricao,
                icone,
                criado_em
            FROM quadros
            WHERE id = %s
              AND usuario_id = %s
            """,
            (quadro_id, usuario_id)
        )

        quadro_atualizado = cursor.fetchone()

        return quadro_atualizado

    except HTTPException:
        conn.rollback()
        raise

    except Exception as e:
        conn.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao editar quadro: {str(e)}"
        )

    finally:
        cursor.close()
        conn.close()


# =====================================================
# EXCLUIR QUADRO
# =====================================================

@router.delete("/{quadro_id}")
def excluir_quadro(
    quadro_id: int,
    email_usuario: str = Depends(obter_usuario_logado)
):
    conn = conectar()
    cursor = conn.cursor()

    try:

        # ---------------------------------------------
        # Busca o usuário
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT id
            FROM usuarios
            WHERE email = %s
            """,
            (email_usuario,)
        )

        usuario = cursor.fetchone()

        if not usuario:
            raise HTTPException(
                status_code=404,
                detail="Usuário não encontrado."
            )

        usuario_id = usuario["id"]


        # ---------------------------------------------
        # Verifica se o quadro pertence ao usuário
        # ---------------------------------------------

        cursor.execute(
            """
            SELECT id
            FROM quadros
            WHERE id = %s
              AND usuario_id = %s
            """,
            (quadro_id, usuario_id)
        )

        quadro = cursor.fetchone()

        if not quadro:
            raise HTTPException(
                status_code=404,
                detail="Quadro não encontrado."
            )


        # ---------------------------------------------
        # Exclui o quadro
        # ---------------------------------------------

        cursor.execute(
            """
            DELETE FROM quadros
            WHERE id = %s
              AND usuario_id = %s
            """,
            (quadro_id, usuario_id)
        )

        conn.commit()

        return {
            "mensagem": "Quadro excluído com sucesso!"
        }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as e:
        conn.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Erro ao excluir quadro: {str(e)}"
        )

    finally:
        cursor.close()
        conn.close()