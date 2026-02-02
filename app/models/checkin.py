from sqlalchemy import Integer, BigInteger, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.database import Base

class Checkin(Base):
    __tablename__ = "checkins"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)    
    player_id: Mapped[int] = mapped_column(Integer, ForeignKey("players.id"), unique=True)
    arrival_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    queue_position: Mapped[int] = mapped_column(BigInteger, index=True)

    player = relationship("Player")