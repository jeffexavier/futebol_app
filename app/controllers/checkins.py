from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List

#from app.database import SessionLocal
from app.dependencies import get_db
from app.schemas.checkin import CheckinCreate, CheckinResponse
from app.services import checkin_service

router = APIRouter()

@router.post("/", response_model=CheckinResponse, status_code=status.HTTP_201_CREATED)
def create_checkin_route(checkin_in: CheckinCreate, db: Session = Depends(get_db)):
    return checkin_service.create_checkin(db = db, checkin_in = checkin_in)

@router.get("/", response_model=List[CheckinResponse], status_code=status.HTTP_200_OK)
def get_checkins_route(db:Session = Depends(get_db)):
    return checkin_service.get_checkins(db=db, limit=10)