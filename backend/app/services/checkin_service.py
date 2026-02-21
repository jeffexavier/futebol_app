from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func, or_
from datetime import datetime

from app.models.checkin import Checkin
from app.models.player import Player
from app.schemas.checkin import TeamSide, CheckinCreate, CheckinUpdate
from app.schemas.player import PlayerCreate
from app.services import audit_log_service, player_service

def get_next_position(db:Session) -> int:
    max_pos = db.query(func.max(Checkin.queue_position)).scalar()
    return(max_pos or 0) + 1

def create_checkin(db: Session, checkin_in: CheckinCreate):
    player_name = checkin_in.name.strip().title()
    team = checkin_in.team

    if player_name == "":
        raise HTTPException(
            status_code=status.HTTP_411_LENGTH_REQUIRED,
            detail="Insira pelo o menos 1 caractere!"
        )
    
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

    active_checkin = db.query(Checkin).filter(
        Checkin.player_id == db_player.id,
        Checkin.deleted_at.is_(None) # Só procura os que não foram deletados
    ).first()

    if active_checkin:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Jogador já está na fila!"
            )

    next_pos = get_next_position(db)

    db_checkin = Checkin(
        player_id=db_player.id,
        queue_position=next_pos,
        team=team
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
    
    deleted_player_queue_pos = db_checkin.queue_position
    deleted_player_team = db_checkin.team

    next_pos = get_next_position(db)

    db_checkin.deleted_at = datetime.now()
    db_checkin.queue_position = next_pos
    db_checkin.team = TeamSide.WAITING

    initial_query = select(Checkin).where(Checkin.deleted_at.is_(None))
    query_waiting = initial_query.where(or_(Checkin.team == TeamSide.WAITING, Checkin.team.is_(None))).order_by(Checkin.queue_position.asc())
    checkins_waiting = db.scalars(query_waiting).first()
   
    log_text = f"Checkin do jogador {db_checkin.player.name} deletado com novo queue position = {db_checkin.queue_position}"

    if checkins_waiting:
        checkins_waiting.queue_position = deleted_player_queue_pos
        checkins_waiting.team = deleted_player_team

        log_text = log_text + f" | Jogador {checkins_waiting.player.name} foi atualizado para o time = {db_checkin.team} e queue position = {deleted_player_queue_pos}"


    audit_log_service.create_log(db, log_text)

    db.commit()

    db.refresh(db_checkin)

    return db_checkin