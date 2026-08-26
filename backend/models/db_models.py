from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import text

Base = declarative_base()


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    senha = Column(String(255), nullable=False)
    foto = Column(Text, nullable=True)

    quadros = relationship("Quadro", back_populates="usuario", cascade="all, delete-orphan")


class Quadro(Base):
    __tablename__ = "quadros"

    id = Column(Integer, primary_key=True, autoincrement=True)
    titulo = Column(String(255), nullable=False)
    descricao = Column(Text, nullable=True)
    icone = Column(String(50), nullable=False, default="pessoal")
    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id", ondelete="CASCADE"),
        nullable=False
    )
    criado_em = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

    usuario = relationship("Usuario", back_populates="quadros")
    tarefas = relationship("Tarefa", back_populates="quadro", cascade="all, delete-orphan")


class Tarefa(Base):
    __tablename__ = "tarefas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    titulo = Column(String(255), nullable=False)
    data = Column(String(50), nullable=True)
    status = Column(String(50), nullable=False, default="a-fazer")
    quadro_id = Column(
        Integer,
        ForeignKey("quadros.id", ondelete="CASCADE"),
        nullable=False
    )
    criado_em = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP")
    )

    quadro = relationship("Quadro", back_populates="tarefas")