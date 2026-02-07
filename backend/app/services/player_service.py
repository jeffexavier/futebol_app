from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.player import Player
from app.schemas.player import PlayerCreate, PlayerUpdate
from app.services import audit_log_service

def create_player(db: Session, player_in: PlayerCreate):

    player_in.name = player_in.name.strip().title()
    player_data = player_in.model_dump()

    db_player = Player(**player_data)

    try:
        db.add(db_player)
        audit_log_service.create_log(db, f"Jogador {db_player.name} foi adicionado.")
        db.commit()
        db.refresh(db_player)

    except IntegrityError as e:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"O jogador '{player_in.name}' já está cadastrado."
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno ao crir jogador."
        )

    return db_player

def get_players(db:Session, paid_only: bool = False, limit: int = 100):
    query = select(Player)
    
    if paid_only != None:
        query = query.where(Player.has_paid_monthly_fee == paid_only)

    query = query.limit(limit)

    result = db.execute(query)
    
    return result.scalars().all()

def get_player(db:Session, player_id: int):
    
    db_player = db.get(Player, player_id)

    return db_player

def update_player(db:Session, player_id: int, player_up: PlayerUpdate):

    db_player = db.get(Player, player_id)

    if not db_player:
        return None

    update_data = player_up.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_player, key, value)

    db.add(db_player)
    
    audit_log_service.create_log(db, f"Jogador {db_player.name} foi atualizado.")
    db.commit()

    db.refresh(db_player)

    return db_player

def delete_player(db: Session, player_id: int):

    db_player = db.get(Player, player_id)

    if not db_player:
        return None
    
    db.delete(db_player)
    audit_log_service.create_log(db, f"Jogador {db_player.name} foi deletado.")
    db.commit()

    return db_player