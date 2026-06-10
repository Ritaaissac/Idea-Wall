from fastapi import FastAPI

from routes.usuarios_router import router as usuarios_router
from routes.quadros_router import router as quadros_router
from routes.tarefas_router import router as tarefas_router
from routes.categorias_router import router as categoria_router
from routes.auth import router as auth_router

app = FastAPI()

app.include_router(usuarios_router)
app.include_router(quadros_router)
app.include_router(tarefas_router)
app.include_router(categoria_router)
app.include_router(auth_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
