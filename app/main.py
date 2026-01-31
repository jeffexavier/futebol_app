from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.database import engine, Base
from app.controllers import players

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Iniciando o App do Fut de Quarta...")

    Base.metadata.create_all(bind=engine)

    yield
    
    print("🛑 Encerrando o App do Fut de Quarta...")

app = FastAPI(
    title="App Fut de Quarta",
    description="API para organizar a pelada de quarta-feira.",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(players.router, prefix="/players", tags=["Players"])

@app.get("/")
def health_check():
    return {"status": "ok", "message": "O sistema está no ar! ⚽"}