from pydantic import BaseModel
from typing import Optional


class TarefaCriar(BaseModel):
    titulo: str
    data: Optional[str] = ""
    status: Optional[str] = "a-fazer"


class TarefaEditar(BaseModel):
    titulo: Optional[str] = None
    data: Optional[str] = None
    status: Optional[str] = None