from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.models.checkin import Checkin
from app.schemas.checkin import CheckinCreate

def get_next_position(db:Session) -> int:
    max_pos = db.query(func.max(Checkin.queue_position)).scalar()

    return(max_pos or 0) + 1

def create_checkin(db: Session, checkin_in: CheckinCreate):

    next_pos = get_next_position(db)

    checkin_data =  checkin_in.model_dump()   
    db_checkin = Checkin(**checkin_data, queue_position=next_pos)

    db.add(db_checkin)
    db.commit()

    db.refresh(db_checkin)
    
    print(db_checkin)

    return db_checkin
 
def get_checkins(db: Session, limit: int = 100):
    
    query = select(Checkin)

    query.limit(limit)

    result = db.execute(query)

    return result.scalars().all()