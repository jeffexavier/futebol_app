from pydantic import BaseModel
from datetime import datetime

class AuditLogResponse(BaseModel):
    id: int
    event: str
    created_at: datetime

    class Config:
        from_attributes = True 