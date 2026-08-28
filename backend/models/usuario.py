from pydantic import BaseModel, EmailStr

class UsuarioCadastro(BaseModel):
    nome: str
    email: EmailStr
    senha: str

class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str

class AlterarSenha(BaseModel):
    email: EmailStr
    senha_atual: str
    nova_senha: str

class AtualizarFoto(BaseModel):
    email: EmailStr
    foto: str