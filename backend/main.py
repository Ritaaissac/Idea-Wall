from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import criar_tabela
from routes.auth import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

criar_tabela()

app.include_router(router)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import criar_tabela
from routes.auth import router as auth_router
# Importe o router de quadros
from routes.quadros import router as quadros_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

criar_tabela()

# Registra os dois roteadores
app.include_router(auth_router)
app.include_router(quadros_router)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import criar_tabela
from routes.auth import router as auth_router
# Importe o router de quadros
from routes.quadros import router as quadros_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

criar_tabela()

# Registra os dois roteadores
app.include_router(auth_router)
app.include_router(quadros_router)
