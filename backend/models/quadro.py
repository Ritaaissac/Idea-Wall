from pydantic import BaseModel
from typing import Optional

class QuadroCriar(BaseModel):
    titulo: str
    descricao: Optional[str] = ""
    icone: Optional[str] = "chapeu" # Ex: chapeu, mala, pessoa