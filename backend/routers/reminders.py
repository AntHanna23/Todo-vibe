from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Reminder, Todo
from schemas import ReminderCreate, ReminderUpdate, ReminderResponse

router = APIRouter(prefix="/todos/{todo_id}/reminders", tags=["reminders"])


def _get_todo(todo_id: int, db: Session) -> Todo:
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.get("", response_model=List[ReminderResponse])
def get_reminders(todo_id: int, db: Session = Depends(get_db)):
    _get_todo(todo_id, db)
    return db.query(Reminder).filter(Reminder.todo_id == todo_id).all()


@router.post("", response_model=ReminderResponse, status_code=201)
def create_reminder(todo_id: int, reminder: ReminderCreate, db: Session = Depends(get_db)):
    _get_todo(todo_id, db)
    db_reminder = Reminder(todo_id=todo_id, **reminder.model_dump())
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder


@router.put("/{reminder_id}", response_model=ReminderResponse)
def update_reminder(
    todo_id: int,
    reminder_id: int,
    reminder_update: ReminderUpdate,
    db: Session = Depends(get_db),
):
    _get_todo(todo_id, db)
    reminder = (
        db.query(Reminder)
        .filter(Reminder.id == reminder_id, Reminder.todo_id == todo_id)
        .first()
    )
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    for key, value in reminder_update.model_dump(exclude_unset=True).items():
        setattr(reminder, key, value)
    db.commit()
    db.refresh(reminder)
    return reminder


@router.delete("/{reminder_id}", status_code=204)
def delete_reminder(todo_id: int, reminder_id: int, db: Session = Depends(get_db)):
    _get_todo(todo_id, db)
    reminder = (
        db.query(Reminder)
        .filter(Reminder.id == reminder_id, Reminder.todo_id == todo_id)
        .first()
    )
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    db.delete(reminder)
    db.commit()
