from sqlalchemy.orm import Session
from app.models.player import Player
from app.schemas.player import PlayerCreate, PlayerUpdate

def create_player(db: Session, player_in: PlayerCreate):

    player_data = player_in.model_dump()

    db_player = Player(**player_data)

    db.add(db_player)

    db.commit()

    db.refresh(db_player)

    return db_player

def get_player(db:Session, player_id: int):

    id: int = player_id
    
    db_player = db.get(Player, id)

    return db_player

def update_player(db:Session, player_id: int, player_up: PlayerUpdate):
    id: int = player_id
    
    player_data = player_up.model_dump()

    db_player = db.get(Player, id)

    db_player = Player(**player_data)

    db.add(db_player)

    db.commit()

    db.refresh(db_player)

    return db_player