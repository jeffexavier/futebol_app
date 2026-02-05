from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db
from app.schemas.match import MatchStateResponse
from app.services import match_service

router = APIRouter()

@router.get("/", response_model=MatchStateResponse, status_code=status.HTTP_200_OK)
def get_match_state_route(db: Session = Depends(get_db)):
    return match_service.get_current_match_state(db=db)