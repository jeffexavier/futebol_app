from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.dependencies import get_db
from app.schemas.player import PlayerCreate, PlayerUpdate, PlayerResponse, PlayerDeleteResponse
from app.services import player_service

router = APIRouter()

@router.post("/", response_model=PlayerResponse, status_code=status.HTTP_201_CREATED)
def create_player_route(player_in: PlayerCreate, db: Session = Depends(get_db)):
    return player_service.create_player(db = db, player_in = player_in)

@router.get("/{id}", response_model=PlayerResponse, status_code=status.HTTP_200_OK)
def get_player_route(id, db: Session = Depends(get_db)):
    return player_service.get_player(db = db, player_id = id)

@router.put("/{id}", response_model=PlayerResponse, status_code=status.HTTP_202_ACCEPTED)
def update_player_route(id, player_up: PlayerUpdate, db: Session = Depends(get_db)):
    return player_service.update_player(db = db, player_id = id, player_up = player_up)

@router.delete("/{id}", response_model=PlayerDeleteResponse, status_code=status.HTTP_200_OK)
def delete_player_route(id, db:Session = Depends(get_db)):
    deleted_player = player_service.delete_player(db = db, player_id = id)

    if not deleted_player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Jogador não encontrado para deletar!"
        )

    return deleted_player