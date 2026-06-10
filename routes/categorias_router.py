from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from database import get_session
from models import Categoria, Usuario
from routes.auth import get_current_user

router = APIRouter(prefix="/categorias", tags=["Categorias"])


@router.get("/", response_model=list[Categoria])
def get_categorias(session: Session = Depends(get_session)):
    return session.query(Categoria).all()


@router.post("/", response_model=Categoria, status_code=status.HTTP_201_CREATED)
def create_categoria(categoria: Categoria, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    categoria.usuario_id = current_user.id
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria


@router.get("/{id}", response_model=Categoria)
def get_categoria(id: int, session: Session = Depends(get_session)):
    categoria = session.get(Categoria, id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    return categoria


@router.put("/{id}", response_model=Categoria)
def update_categoria(id: int, categoria_data: Categoria, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    categoria = session.get(Categoria, id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    if categoria.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Não autorizado")

    categoria.nome_quadro = categoria_data.nome_quadro

    session.commit()
    session.refresh(categoria)
    return categoria


@router.delete("/{id}")
def delete_categoria(id: int, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    categoria = session.get(Categoria, id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada")
    if categoria.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Não autorizado")

    session.delete(categoria)
    session.commit()
    return {"detail": "Categoria deletada com sucesso"}
