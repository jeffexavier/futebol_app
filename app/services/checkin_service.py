from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from datetime import datetime

from app.models.checkin import Checkin
from app.models.player import Player
from app.services import audit_log_service
from app.schemas.checkin import CheckinCreate

def get_next_position(db:Session) -> int:
    max_pos = db.query(func.max(Checkin.queue_position)).scalar()
    return(max_pos or 0) + 1

def create_checkin(db: Session, checkin_in: CheckinCreate):

    player_id = checkin_in.player_id
    db_player = db.get(Player, player_id)

    if not db_player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Jogador ID = {player_id} não encontrado!"
            )

    existing_checkin = db.execute(
        select(Checkin).where(Checkin.player_id == player_id)
    ).scalar_one_or_none()

    if existing_checkin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Jogador já está na fila!"
            )

    next_pos = get_next_position(db)

    checkin_data =  checkin_in.model_dump() 

    db_checkin = Checkin(**checkin_data, queue_position=next_pos)

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

    result = db.execute(query)

    return result.scalars().all()

def get_checkin(db: Session, checkin_id = int):

    db_checkin = db.get(Checkin, checkin_id)

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