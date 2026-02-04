from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.audit_log import AuditLog

def create_log(db: Session, message: str):
    
    new_log = AuditLog(event=message)
    db.add(new_log)

def get_logs(db: Session, limit: int = 100):
    query = select(AuditLog)
                   
    query = query.limit(limit)

    result = db.execute(query)

    return result.scalars().all()
    