from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.usuario import UsuarioCadastro, UsuarioLogin, AlterarSenha, AtualizarFoto
from models.db_models import Usuario
from database import get_db
from auth.dependencies import obter_usuario_logado
from services import usuario_service

router = APIRouter(tags=["Autenticação"])


@router.post("/cadastro", status_code=201)
def cadastrar(dados: UsuarioCadastro, db: Session = Depends(get_db)):
    return usuario_service.cadastrar(db, dados)


@router.post("/login")
def login(dados: UsuarioLogin, db: Session = Depends(get_db)):
    return usuario_service.login(db, dados)


@router.put("/alterar-senha")
def alterar_senha(dados: AlterarSenha, usuario: Usuario = Depends(obter_usuario_logado), db: Session = Depends(get_db)):
    return usuario_service.alterar_senha(db, usuario, dados)


@router.put("/atualizar-foto")
def atualizar_foto(dados: AtualizarFoto, usuario: Usuario = Depends(obter_usuario_logado), db: Session = Depends(get_db)):
    return usuario_service.atualizar_foto(db, usuario, dados)
