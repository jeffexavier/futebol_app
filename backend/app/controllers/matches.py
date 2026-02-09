from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db
from app.schemas.match import MatchResultEnum, MatchEndRequest, MatchStateResponse
from app.schemas.checkin import CheckinResponse
from app.services import match_service

router = APIRouter()

@router.get("/", response_model=MatchStateResponse, status_code=status.HTTP_200_OK)
def get_match_state_route(db: Session = Depends(get_db)):
    return match_service.get_current_match_state(db=db)

@router.post("/randomize/", response_model=MatchStateResponse, status_code=status.HTTP_202_ACCEPTED)
def randomize_first_team_route(db: Session = Depends(get_db)):
    return match_service.randomize_first_teams(db=db)

@router.post("/", response_model=MatchStateResponse, status_code=status.HTTP_202_ACCEPTED)
def rotate_team_route(result: MatchEndRequest, db: Session = Depends(get_db)):
    return match_service.end_match(match_result=result, db=db)