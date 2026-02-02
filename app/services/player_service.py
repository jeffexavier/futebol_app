from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.player import Player
from app.schemas.player import PlayerCreate, PlayerUpdate

def create_player(db: Session, player_in: PlayerCreate):

    player_data = player_in.model_dump()

    db_player = Player(**player_data)

    db.add(db_player)

    db.commit()

    db.refresh(db_player)

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
    db.commit()

    db.refresh(db_player)

    return db_player

def delete_player(db: Session, player_id: int):

    db_player = db.get(Player, player_id)

    if not db_player:
        return None
    
    db.delete(db_player)

    db.commit()

    return db_player