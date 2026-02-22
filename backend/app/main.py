from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models.player import Player
from app.models.checkin import Checkin
from app.models.audit_log import AuditLog


from app.controllers import players, checkins, matches, audit_logs

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

origins = [
    "http://localhost:5173",    # Vite (React padrão)
    "http://localhost:3000",    # React Create App
    "http://127.0.0.1:5173",    # Às vezes o navegador usa IP
    "http://187.77.42.89:8080",  # IP VPS  
    "http://localhost",         # Genérico
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Permite as origens listadas acima
    allow_credentials=True,
    allow_methods=["*"],        # Permite GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],        # Permite enviar JSON, Tokens, etc.
)

app.include_router(players.router, prefix="/players", tags=["Players"])
app.include_router(checkins.router, prefix="/checkins", tags=["Checkins"])
app.include_router(audit_logs.router, prefix="/logs", tags=["Logs"])
app.include_router(matches.router, prefix="/matches", tags=["Matches"])

@app.get("/")
def health_check():
    return {"status": "ok", "message": "O sistema está no ar! ⚽"}