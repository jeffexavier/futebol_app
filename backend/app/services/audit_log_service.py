from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.audit_log import AuditLog

def create_log(db: Session, message: str):
    
    new_log = AuditLog(event=message)
    db.add(new_log)

def get_logs(db: Session, limit: int = 100, order_desc: bool = True):
    query = select(AuditLog)

    if order_desc:
        query = query.order_by(AuditLog.id.desc())
                   
    query = query.limit(limit)

    result = db.execute(query)

    return result.scalars().all()
    