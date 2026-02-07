from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List

#from app.database import SessionLocal
from app.dependencies import get_db
from app.schemas.checkin import CheckinUpdate, CheckinResponse
from app.schemas.player import PlayerCreate
from app.services import checkin_service

router = APIRouter()

@router.post("/", response_model=CheckinResponse, status_code=status.HTTP_201_CREATED)
def create_checkin_route(checkin_in: PlayerCreate, db: Session = Depends(get_db)):
    return checkin_service.create_checkin(db = db, checkin_in = checkin_in)

@router.get("/", response_model=List[CheckinResponse], status_code=status.HTTP_200_OK)
def get_checkins_route(db:Session = Depends(get_db), only_active: bool = None, limit: int = 10):
    return checkin_service.get_checkins(db=db, only_active=only_active, limit=limit)

@router.get("/{id}", response_model=CheckinResponse, status_code=status.HTTP_200_OK)
def get_checkin_route(id, db: Session = Depends(get_db)):

    checkin = checkin_service.get_checkin(db=db, checkin_id=id)

    if not checkin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Checkin não encontrado! "
        )

    return checkin

@router.put("/{id}", response_model=CheckinResponse, status_code=status.HTTP_202_ACCEPTED)
def update_checkin_route(id, checkin_up: CheckinUpdate, db: Session = Depends(get_db)):
    updated_checkin = checkin_service.update_checkin(db = db, checkin_id=id, checkin_up = checkin_up)

    if not updated_checkin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Checkin não encontrado para atualizar!"
        )
    
    return updated_checkin


@router.delete("/{id}", response_model=CheckinResponse, status_code=status.HTTP_200_OK)
def delete_checkin_route(id, db: Session = Depends(get_db)):

    deleted_checkin = checkin_service.delete_checkin(db=db, checkin_id=id)

    if not deleted_checkin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Checkin não encontrado para deletar!"
        )

    return deleted_checkin