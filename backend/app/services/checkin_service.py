from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from datetime import datetime

from app.models.checkin import Checkin
from app.models.player import Player
from app.schemas.checkin import CheckinCreate, CheckinUpdate
from app.schemas.player import PlayerCreate
from app.services import audit_log_service, player_service

def get_next_position(db:Session) -> int:
    max_pos = db.query(func.max(Checkin.queue_position)).scalar()
    return(max_pos or 0) + 1

def create_checkin(db: Session, checkin_in: PlayerCreate):

    player_name = checkin_in.name.strip().title()
    
    db_player = db.scalars(select(Player).filter(Player.name == player_name)).first()

    if not db_player:
        print(f"Jogador {player_name} não encontrado. Criando novo...")
        try:
            player_in = PlayerCreate(name=player_name)
            db_player = player_service.create_player(db, player_in)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao criar jogador."
            )

    existing_checkin = db.scalars(
        select(Checkin).where(Checkin.player_id == db_player.id)
    ).one_or_none()

    if existing_checkin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Jogador já está na fila!"
            )

    next_pos = get_next_position(db)

    db_checkin = Checkin(
        player_id=db_player.id,
        queue_position=next_pos
    )

    db.add(db_checkin)

    audit_log_service.create_log(db, f"Jogador {db_player.name} entrou na fila na posição {next_pos}.")

    db.commit()

    db.refresh(db_checkin)

    return db_checkin
 
def get_checkins(db: Session, only_active: bool = None, limit: int = 100):
    
    query = select(Checkin)

    if only_active != None:
        if only_active == True:
            query = query.where(Checkin.deleted_at == None)
        elif only_active == False:
            query = query.where(Checkin.deleted_at != None)

    query = query.limit(limit)

    result = db.scalars(query)

    return result.all()

def get_checkin(db: Session, checkin_id: int):

    db_checkin = db.get(Checkin, checkin_id)

    return db_checkin

def update_checkin(db: Session, checkin_id: int, checkin_up: CheckinUpdate):
    db_checkin = db.get(Checkin, checkin_id)

    if not db_checkin:
        print("caiu_aqui")
        return None

    update_data = checkin_up.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_checkin, key, value)

    db.add(db_checkin)

    audit_log_service.create_log(db, f"Checkin ID = {db_checkin.id} foi atualizado.")    
    db.commit()

    db.refresh(db_checkin)

    return db_checkin

def delete_checkin(db: Session, checkin_id: int):

    db_checkin = db.get(Checkin, checkin_id)

    if not db_checkin or db_checkin.deleted_at is not None:
        return None
    
    db_checkin.deleted_at = datetime.now()
    
    audit_log_service.create_log(db, f"Checkin ID = {checkin_id} deletado.")

    db.commit()

    db.refresh(db_checkin)

    return db_checkin