from sqlmodel import SQLModel, Field
from typing import Optional

class Usuario(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    senha: str
    nome: str

class UserCreate(SQLModel):
    nome: str
    email: EmailStr
    senha: str

class Quadro(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    descricao: str
    usuario_id: int = Field(foreign_key="usuario.id")


class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome_quadro: str
    usuario_id: int = Field(foreign_key="usuario.id")


class Tarefa(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    titulo_atividade: str
    descricao_atividade: str
    status: str
    prazo: str
    quadro_id: int = Field(foreign_key="quadro.id")
    categoria_id: int = Field(foreign_key="categoria.id")