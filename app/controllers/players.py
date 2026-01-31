from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.dependencies import get_db
from app.schemas.player import PlayerCreate, PlayerResponse
from app.services import player_service

router = APIRouter()

@router.post("/", response_model=PlayerResponse, status_code=status.HTTP_201_CREATED)
def create_player_route(player: PlayerCreate, db: Session = Depends(get_db)):
    return player_service.create_player(db=db, player_in=player)

@router.get("/{id}", response_model=PlayerResponse, status_code=status.HTTP_200_OK)
def get_player_route(id, db: Session = Depends(get_db)):
    return player_service.get_player(db=db, player_id=id)