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