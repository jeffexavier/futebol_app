from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.database import Base

class Player(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(collation='NOCASE'), unique=True, index=True, nullable=False)
    has_paid_monthly_fee: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now, onupdate=datetime.now)