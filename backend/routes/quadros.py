from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from models.quadro import QuadroCriar
from models.db_models import Usuario, Quadro
from database import get_db
from routes.auth import SECRET_KEY

router = APIRouter(prefix="/quadros", tags=["Quadros"])
security = HTTPBearer()


def obter_usuario_logado(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido."
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado."
        )

    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado."
        )
    return usuario


@router.post("", status_code=status.HTTP_201_CREATED)
def criar_quadro(
    quadro_in: QuadroCriar,
    usuario_atual: Usuario = Depends(obter_usuario_logado),
    db: Session = Depends(get_db)
):
    novo_quadro = Quadro(
        titulo=quadro_in.titulo.strip(),
        descricao=(quadro_in.descricao or "").strip(),
        icone=quadro_in.icone or "pessoal",
        usuario_id=usuario_atual.id
    )
    db.add(novo_quadro)
    db.commit()
    db.refresh(novo_quadro)
    return novo_quadro


@router.get("")
def listar_quadros(
    usuario_atual: Usuario = Depends(obter_usuario_logado),
    db: Session = Depends(get_db)
):
    return (
        db.query(Quadro)
        .filter(Quadro.usuario_id == usuario_atual.id)
        .order_by(Quadro.id.desc())
        .all()
    )


@router.get("")
def buscar_quadro(
    quadro_id: int,
    usuario_atual: Usuario = Depends(obter_usuario_logado),
    db: Session = Depends(get_db)
):
    quadro = (
        db.query(Quadro)
        .filter(Quadro.id == quadro_id, Quadro.usuario_id == usuario_atual.id)
        .first()
    )
    if not quadro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quadro não encontrado."
        )
    return quadro


@router.put("")
def editar_quadro(
    quadro_id: int,
    quadro_in: QuadroCriar,
    usuario_atual: Usuario = Depends(obter_usuario_logado),
    db: Session = Depends(get_db)
):
    quadro = (
        db.query(Quadro)
        .filter(Quadro.id == quadro_id, Quadro.usuario_id == usuario_atual.id)
        .first()
    )
    if not quadro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quadro não encontrado."
        )

    quadro.titulo = quadro_in.titulo.strip()
    quadro.descricao = (quadro_in.descricao or "").strip()
    quadro.icone = quadro_in.icone or quadro.icone

    db.commit()
    db.refresh(quadro)
    return quadro


@router.delete("")
def excluir_quadro(
    quadro_id: int,
    usuario_atual: Usuario = Depends(obter_usuario_logado),
    db: Session = Depends(get_db)
):
    quadro = (
        db.query(Quadro)
        .filter(Quadro.id == quadro_id, Quadro.usuario_id == usuario_atual.id)
        .first()
    )
    if not quadro:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quadro não encontrado."
        )

    db.delete(quadro)
    db.commit()
    return {"mensagem": "Quadro excluído com sucesso!"}