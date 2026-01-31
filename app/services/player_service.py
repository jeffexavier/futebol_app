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