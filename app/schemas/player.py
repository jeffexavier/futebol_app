from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PlayerBase(BaseModel):
    name: str

class PlayerCreate(PlayerBase):
    pass

class PlayerUpdate(PlayerBase):
    name: Optional[str] = None
    has_paid_monthly_fee: Optional[bool] = None
    is_present: Optional[bool] = None

class PlayerResponse(PlayerBase):
    id: int
    has_paid_monthly_fee: bool
    is_present: bool
    created_at: datetime

    class Config:
        from_attributes = True

class PlayerDeleteResponse(PlayerResponse):
    deleted: bool = True
