from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import criar_tabela
from routes.auth import router as auth_router
from routes.quadros import router as quadros_router

app = FastAPI()

# Configuração do CORS para permitir comunicação com o React/Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializa as tabelas do banco de dados ao iniciar
criar_tabela()

# Registra as rotas de autenticação e quadros
app.include_router(auth_router)
app.include_router(quadros_router)