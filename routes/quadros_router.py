from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from database import get_session
from models import Quadro, Usuario
from routes.auth import get_current_user

router = APIRouter(prefix="/quadros", tags=["Quadros"])


@router.get("/", response_model=list[Quadro])
def get_quadros(session: Session = Depends(get_session)):
    return session.query(Quadro).all()

@router.post("/", response_model=Quadro)
def create_quadro(quadro: Quadro, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    session.add(quadro)
    session.commit()
    session.refresh(quadro)
    return quadro

@router.get("/{id}", response_model=Quadro)
def get_quadro(id: int, session: Session = Depends(get_session)):
    quadro = session.get(Quadro, id)
    if not quadro:
        raise HTTPException(status_code=404, detail="Quadro não encontrado")
    return quadro

@router.put("/{id}", response_model=Quadro)
def update_quadro(id: int, quadro_data: Quadro, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    quadro = session.get(Quadro, id)
    if not quadro:
        raise HTTPException(status_code=404, detail="Quadro não encontrado")
    
    quadro.titulo = quadro_data.titulo
    quadro.descricao = quadro_data.descricao
    quadro.usuario_id = quadro_data.usuario_id

    session.commit()
    session.refresh(quadro)
    return quadro

@router.delete("/{id}")
def delete_quadro(id: int, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    quadro = session.get(Quadro, id)
    if not quadro:
        raise HTTPException(status_code=404, detail="Quadro não encontrado")
    
    session.delete(quadro)
    session.commit()
    return {"detail": "Quadro deletado com sucesso"}

