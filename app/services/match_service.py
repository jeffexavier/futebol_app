from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from datetime import datetime

from app.models.checkin import Checkin
from app.schemas.match import MatchEndRequest, MatchStateResponse
from app.services import audit_log_service

def get_current_match_state(db: Session) -> MatchStateResponse:

    query = select(Checkin).where(Checkin.deleted_at.is_(None)).order_by(Checkin.queue_position.asc())
    all_checkins = db.execute(query).scalars().all()

    t_a = all_checkins[:7]
    t_b = all_checkins[7:14]
    waiting = all_checkins[14:]

    if len(waiting) >= 7:
        match_time_rule_text = "8 Minutos"
    else:
        match_time_rule_text = "10 minutos"

    return MatchStateResponse(
        team_a = t_a,
        team_b = t_b,
        waiting_list = waiting,
        match_time_rule = match_time_rule_text
    )

def rotate_losing_team(db:Session, losing_team: MatchEndRequest) -> MatchStateResponse:
    pass


