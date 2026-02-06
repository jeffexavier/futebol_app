from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.schemas.player import PlayerResponse

class CheckinBase(BaseModel):
    player_id: int
    
class CheckinCreate(CheckinBase):
    pass

class CheckinUpdate(BaseModel):
    deleted_at: Optional[datetime] = None

class CheckinResponse(CheckinBase):
    id: int
    queue_position: int
    arrival_time: datetime
    deleted_at: Optional[datetime]

    player: PlayerResponse

    class Config:
        from_attributes = True

class CheckinDeleteResponse(CheckinResponse):
    deleted: bool = True