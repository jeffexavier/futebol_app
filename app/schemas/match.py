from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.checkin import CheckinResponse

class MatchEndRequest(BaseModel):
    losing_team: str

class MatchStateResponse(BaseModel):
    team_a: List[CheckinResponse]
    team_b: list[CheckinResponse]
    waiting_list: List[CheckinResponse]

    match_time_rule: Optional[str] = None

    next_up: Optional[str] = None