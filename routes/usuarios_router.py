from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Usuario
from routes.auth import get_password_hash, get_current_user

router = APIRouter(prefix="/usuarios", tags=["Usuários"])

@router.get("/", response_model=list[Usuario])
def get_usuarios(session: Session = Depends(get_session)):
    return session.query(Usuario).all()

@router.post("/", response_model=Usuario)
def create_usuario(usuario: Usuario, session: Session = Depends(get_session)):
    usuario.senha = get_password_hash(usuario.senha)
    session.add(usuario)
    session.commit()
    session.refresh(usuario)
    return usuario

@router.get("/{id}", response_model=Usuario)
def get_usuario(id: int, session: Session = Depends(get_session)):
    usuario = session.get(Usuario, id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario

@router.put("/{id}", response_model=Usuario)
def update_usuario(id: int, usuario_data: Usuario, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    usuario = session.get(Usuario, id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    usuario.nome = usuario_data.nome
    usuario.email = usuario_data.email
    usuario.senha = get_password_hash(usuario_data.senha)

    session.commit()
    session.refresh(usuario)
    return usuario

@router.delete("/{id}")
def delete_usuario(id: int, session: Session = Depends(get_session)):
    usuario = session.get(Usuario, id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    session.delete(usuario)
    session.commit()
    return {"detail": "Usuário deletado com sucesso"}
