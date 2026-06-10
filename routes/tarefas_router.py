from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from database import get_session
from models import Tarefa, Usuario
from routes.auth import get_current_user

router = APIRouter(prefix="/tarefas", tags=["Tarefas"])


@router.get("/", response_model=list[Tarefa])
def get_tarefas(session: Session = Depends(get_session)):
    return session.query(Tarefa).all()

@router.post("/", response_model=Tarefa)
def create_tarefa(tarefa: Tarefa, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    session.add(tarefa)
    session.commit()
    session.refresh(tarefa)
    return tarefa

@router.get("/{id}", response_model=Tarefa)
def get_tarefa(id: int, session: Session = Depends(get_session)):
    tarefa = session.get(Tarefa, id)
    if not tarefa:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return tarefa

@router.put("/{id}", response_model=Tarefa)
def update_tarefa(id: int, tarefa_data: Tarefa, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    tarefa = session.get(Tarefa, id)
    if not tarefa:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    
    tarefa.titulo = tarefa_data.titulo
    tarefa.status = tarefa_data.status
    tarefa.quadro_id = tarefa_data.quadro_id

    session.commit()
    session.refresh(tarefa)
    return tarefa

@router.delete("/{id}")
def delete_tarefa(id: int, session: Session = Depends(get_session), current_user: Usuario = Depends(get_current_user)):
    tarefa = session.get(Tarefa, id)
    if not tarefa:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    
    session.delete(tarefa)
    session.commit()
    return {"detail": "Tarefa deletada com sucesso"}

