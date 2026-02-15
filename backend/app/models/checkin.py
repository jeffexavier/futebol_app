from sqlalchemy import Integer, BigInteger, String, Boolean, DateTime, ForeignKey, Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Optional
from enum import Enum
from app.schemas.checkin import TeamSide
from app.database import Base

class Checkin(Base):
    __tablename__ = "checkins"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)    
    player_id: Mapped[int] = mapped_column(Integer, ForeignKey("players.id"), unique=True)
    arrival_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    queue_position: Mapped[int] = mapped_column(BigInteger, index=True)
    team: Mapped[Optional[TeamSide]] = mapped_column(SqlEnum(TeamSide), nullable=True)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    player = relationship("Player") 

