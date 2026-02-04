from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.dependencies import get_db
from app.schemas.audit_log import AuditLogResponse
from app.services import audit_log_service

router = APIRouter()

@router.get("/", response_model=List[AuditLogResponse], status_code=status.HTTP_200_OK)
def get_audit_logs_route(db: Session = Depends(get_db)):
    return audit_log_service.get_logs(db=db)