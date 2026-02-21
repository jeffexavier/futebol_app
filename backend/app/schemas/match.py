from pydantic import BaseModel
from typing import Optional, List
#from datetime import datetime
from enum import Enum
from app.schemas.checkin import CheckinResponse

class MatchResultEnum(str, Enum):
    losing_team_a = "team_a"
    losing_team_b = "team_b"
    draw = "draw"

class MatchEndRequest(BaseModel):
    result: MatchResultEnum

class MatchStateResponse(BaseModel):
    team_a: List[CheckinResponse]
    team_b: List[CheckinResponse]
    waiting_team_1: List[CheckinResponse]
    waiting_team_2: List[CheckinResponse]
    following_list: List[CheckinResponse]
    can_randomize: Optional[bool] = False
    can_choose_draw: Optional[bool] = False

    match_time_rule: Optional[str] = None

    next_up: Optional[str] = None