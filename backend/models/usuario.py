from pydantic import BaseModel

class UsuarioCadastro(BaseModel):
    nome: str
    email: str
    senha: str

class UsuarioLogin(BaseModel):
    email: str
    senha: str

class AlterarSenha(BaseModel):
    email: str
    senha_atual: str
    nova_senha: str
