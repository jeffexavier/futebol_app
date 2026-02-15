from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime

from app.schemas.player import PlayerCreate, PlayerResponse

class TeamSide(str, Enum):
    TEAM_A = "team_a"
    TEAM_B = "team_b"
    WAITING = "waiting"  # Lista de Espera

class CheckinBase(BaseModel):
    player_id: str
    
class CheckinCreate(PlayerCreate):
    team: Optional[TeamSide] = None

class CheckinUpdate(BaseModel):
    deleted_at: Optional[datetime] = None
    team: Optional[TeamSide] = None

class CheckinResponse(BaseModel):
    id: int
    player_id: int
    arrival_time: datetime
    queue_position: int
    team: Optional[TeamSide]
    deleted_at: Optional[datetime]
    player: PlayerResponse

    class Config:
        from_attributes = True

class CheckinDeleteResponse(CheckinResponse):
    deleted: bool = True