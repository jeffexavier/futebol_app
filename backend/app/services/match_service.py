from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func, or_
from typing import List
from datetime import datetime
import random

from app.models.checkin import Checkin
from app.schemas.checkin import TeamSide
from app.schemas.match import MatchResultEnum, MatchEndRequest, MatchStateResponse
from app.services import audit_log_service, checkin_service

def get_current_match_state(db: Session) -> MatchStateResponse:

    initial_query = select(Checkin).where(Checkin.deleted_at.is_(None))
    query_team_a = initial_query.where(Checkin.team == TeamSide.TEAM_A).order_by(Checkin.queue_position.asc())
    query_team_b = initial_query.where(Checkin.team == TeamSide.TEAM_B).order_by(Checkin.queue_position.asc())
    query_waiting = initial_query.where(or_(Checkin.team == TeamSide.WAITING, Checkin.team.is_(None))).order_by(Checkin.queue_position.asc())
    
    checkins_team_a = db.scalars(query_team_a).all()
    checkins_team_b = db.scalars(query_team_b).all()
    checkins_waiting = db.scalars(query_waiting).all()
 
    t_a = checkins_team_a[:7]
    t_b = checkins_team_b[:7]
    w_t_1 = checkins_waiting[:7]
    w_t_2 = checkins_waiting[7:14]
    f_l = checkins_waiting[14:]

    if len(t_a + t_b) < 14 and len(t_a + t_b + w_t_1 + w_t_2) >= 14:
        can_randomize_rule = True
    else :
        can_randomize_rule = False

    if len(w_t_1 + w_t_2) >= 14:
        can_choose_draw_rule = True
    else:
        can_choose_draw_rule = False

    if len(w_t_1 + w_t_2) >= 14:
        match_time_rule_text = "8 Minutos"
    else:
        match_time_rule_text = "10 minutos"

    return MatchStateResponse(
        team_a = t_a,
        team_b = t_b,
        waiting_team_1 = w_t_1,
        waiting_team_2 = w_t_2,
        following_list = f_l,
        can_randomize = can_randomize_rule,
        can_choose_draw = can_choose_draw_rule,
        match_time_rule = match_time_rule_text
    )

def randomize_first_teams(db: Session):

    query = select(Checkin).where(Checkin.deleted_at.is_(None)).order_by(Checkin.arrival_time.asc())
    checkins = db.scalars(query).all()  

    first_teams_checkins = checkins[0:14]
    random.shuffle(first_teams_checkins)

    new_team_a = first_teams_checkins[:7]
    new_team_b = first_teams_checkins[7:14]
    following_teams = checkins[14:]

    ids_team_a = [c.id for c in new_team_a]
    ids_team_b = [c.id for c in new_team_b]
    ids_ft = [c.id for c in following_teams]

    real_checkins_team_a = db.scalars(select(Checkin).where(Checkin.id.in_(ids_team_a))).all()
    real_checkins_team_a.sort(key=lambda x: x.arrival_time)

    real_checkins_team_b = db.scalars(select(Checkin).where(Checkin.id.in_(ids_team_b))).all()
    real_checkins_team_b.sort(key=lambda x: x.arrival_time)

    real_checkins_ft = db.scalars(select(Checkin).where(Checkin.id.in_(ids_ft))).all()
    real_checkins_ft.sort(key=lambda x: x.arrival_time)

    player_names_t_a = []
    player_names_t_b = []
    player_names_ft = []

    for index, checkin in enumerate(real_checkins_team_a):
        checkin.queue_position = index + 1
        checkin.team = TeamSide.TEAM_A
        player_names_t_a.append(checkin.player.name)

    for index, checkin in enumerate(real_checkins_team_b):
        checkin.queue_position = index + 8
        checkin.team = TeamSide.TEAM_B
        player_names_t_b.append(checkin.player.name)

    for index, checkin in enumerate(real_checkins_ft):
        checkin.queue_position = index + 15
        checkin.team = TeamSide.WAITING
        player_names_ft.append(checkin.player.name)
    
    audit_log_service.create_log(
        db,
        f"Time A sorteado: {', '.join(player_names_t_a)} | Time B sorteado: {', '.join(player_names_t_b)} | Checkins atuailizados para espera: {', '.join(player_names_ft)}"
    )

    db.commit()

    return get_current_match_state(db)

def update_checkin_team(db: Session, team_checkins: List[Checkin], team: TeamSide, is_next_pos: bool = False):
                
    next_pos = checkin_service.get_next_position(db)

    ids_to_update = [c.id for c in team_checkins]

    real_checkins = db.scalars(select(Checkin).where(Checkin.id.in_(ids_to_update))).all()
    real_checkins.sort(key=lambda x: x.queue_position)

    player_names = []

    for index, checkin in enumerate(real_checkins):
        
        if is_next_pos == True:
            checkin.queue_position = next_pos + index

        checkin.team = team

        player_names.append(checkin.player.name)
    
    audit_log_service.create_log(
        db,
        f"Rodaram todos: {', '.join(player_names)}"
    )

    db.commit()

def process_draw(db: Session, state: MatchStateResponse, coin_winner_team: MatchEndRequest = None):

    if coin_winner_team == TeamSide.TEAM_B:
        print("#------------------------------------------------------ Azul")
        update_checkin_team(db, state.team_b, TeamSide.WAITING, True)
        update_checkin_team(db, state.team_a, TeamSide.WAITING, True)
    else:
        print("#------------------------------------------------------ Amarelo | NÂO informado!")
        update_checkin_team(db, state.team_a, TeamSide.WAITING, True)
        update_checkin_team(db, state.team_b, TeamSide.WAITING, True)

    current_match_state = get_current_match_state(db)

    wt1_checkins = current_match_state.waiting_team_1
    wt2_checkins = current_match_state.waiting_team_2

    update_checkin_team(db, wt1_checkins, TeamSide.TEAM_A, False)
    update_checkin_team(db, wt2_checkins, TeamSide.TEAM_B, False)

    return get_current_match_state(db)

def rotate_team(db: Session, team_checkins: List[Checkin], team: TeamSide):

    update_checkin_team(db, team_checkins, TeamSide.WAITING, True)

    current_match_state = get_current_match_state(db)

    wt1_checkins = current_match_state.waiting_team_1

    update_checkin_team(db, wt1_checkins, team, False)

    return get_current_match_state(db)


def end_match(db: Session, match_result: MatchEndRequest):
    state = get_current_match_state(db)

    if match_result.result == MatchResultEnum.losing_team_a:
        return rotate_team(db, state.team_a, TeamSide.TEAM_A)
    elif match_result.result == MatchResultEnum.losing_team_b:
        return rotate_team(db, state.team_b, TeamSide.TEAM_B)
    elif match_result.result == MatchResultEnum.draw:
        return process_draw(db, state, match_result.coin_winner_team)

