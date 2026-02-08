from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from typing import List
from datetime import datetime
import random

from app.models.checkin import Checkin
from app.schemas.match import MatchResultEnum, MatchEndRequest, MatchStateResponse
from app.services import audit_log_service, checkin_service

def get_current_match_state(db: Session) -> MatchStateResponse:

    query = select(Checkin).where(Checkin.deleted_at.is_(None)).order_by(Checkin.queue_position.asc())
    all_checkins = db.scalars(query).all()

    t_a = all_checkins[:7]
    t_b = all_checkins[7:14]
    waiting = all_checkins[14:]

    if len(waiting) >= 14:
        match_time_rule_text = "8 Minutos"
    else:
        match_time_rule_text = "10 minutos"

    return MatchStateResponse(
        team_a = t_a,
        team_b = t_b,
        waiting_list = waiting,
        match_time_rule = match_time_rule_text
    )

def randomize_first_teams(db: Session):

    current_match_state = get_current_match_state(db)

    teams_checkins = current_match_state.team_a + current_match_state.team_b

    random.shuffle(teams_checkins)

    new_team_a = teams_checkins[:7]
    new_team_b = teams_checkins[7:14]

    ids_team_a = [c.id for c in new_team_a]
    ids_team_b = [c.id for c in new_team_b]

    real_checkins_team_a = db.scalars(select(Checkin).where(Checkin.id.in_(ids_team_a))).all()
    real_checkins_team_a.sort(key=lambda x: x.arrival_time)

    real_checkins_team_b = db.scalars(select(Checkin).where(Checkin.id.in_(ids_team_b))).all()
    real_checkins_team_b.sort(key=lambda x: x.arrival_time)

    player_names_t_a = []
    player_names_t_b = []

    for index, checkin in enumerate(real_checkins_team_a):
        checkin.queue_position = index + 1
        player_names_t_a.append(checkin.player.name)

    for index, checkin in enumerate(real_checkins_team_b):
        checkin.queue_position = index + 8
        player_names_t_b.append(checkin.player.name)
    
    audit_log_service.create_log(
        db,
        f"Time A sorteado: {', '.join(player_names_t_a)} | Time B sorteado: {', '.join(player_names_t_b)}"
    )

    db.commit()

    return get_current_match_state(db)



def process_draw(db: Session, state: MatchStateResponse):
    next_pos = checkin_service.get_next_position(db)
    
    teams_checkins = state.team_a + state.team_b

    ids_to_update = [c.id for c in teams_checkins]

    real_checkins = db.scalars(select(Checkin).where(Checkin.id.in_(ids_to_update))).all()

    real_checkins.sort(key=lambda x: x.arrival_time)

    player_names = []

    for index, checkin in enumerate(real_checkins):
        checkin.queue_position = next_pos + index
        player_names.append(checkin.player.name)
    
    audit_log_service.create_log(
        db,
        f"Empate (2 times fora). Rodaram todos: {', '.join(player_names)}"
    )

    db.commit()

    return get_current_match_state(db)


def rotate_team(db: Session, team_checkins: List[Checkin]):
    next_pos = checkin_service.get_next_position(db)

    ids_to_update = [c.id for c in team_checkins]

    real_checkins = db.scalars(select(Checkin).where(Checkin.id.in_(ids_to_update))).all()

    real_checkins.sort(key=lambda x: x.arrival_time)

    player_names = []

    for index, checkin in enumerate(real_checkins):
        checkin.queue_position = next_pos + index
        player_names.append(checkin.player.name)
    
    audit_log_service.create_log(
        db,
        f"Rodaram todos: {', '.join(player_names)}"
    )

    db.commit()

    return get_current_match_state(db)


def end_match(db: Session, match_result: MatchEndRequest):
    state = get_current_match_state(db)

    if match_result.result == MatchResultEnum.losing_team_a:
        return rotate_team(db, state.team_a)
    elif match_result.result == MatchResultEnum.losing_team_b:
        return rotate_team(db, state.team_b)
    elif match_result.result == MatchResultEnum.draw:
        return process_draw(db, state)

