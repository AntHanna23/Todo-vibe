from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, field_validator


# --- Tag ---

class TagCreate(BaseModel):
    name: str


class TagResponse(BaseModel):
    id: int
    name: str
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Reminder ---

class ReminderCreate(BaseModel):
    offset_minutes: int
    remind_at: datetime
    method: str = "browser"


class ReminderUpdate(BaseModel):
    offset_minutes: Optional[int] = None
    remind_at: Optional[datetime] = None
    method: Optional[str] = None


class ReminderResponse(BaseModel):
    id: int
    todo_id: int
    offset_minutes: int
    remind_at: datetime
    method: str
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Todo ---

class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[str] = None
    due_at: Optional[datetime] = None
    tag_id: Optional[int] = None

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v):
        if v is not None and v not in ("high", "medium", "low"):
            raise ValueError("priority must be high, medium, or low")
        return v


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_at: Optional[datetime] = None
    tag_id: Optional[int] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v is not None and v not in ("complete", "incomplete"):
            raise ValueError("status must be complete or incomplete")
        return v

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v):
        if v is not None and v not in ("high", "medium", "low"):
            raise ValueError("priority must be high, medium, or low")
        return v


class TodoResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    priority: Optional[str]
    due_at: Optional[datetime]
    tag_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    tag: Optional[TagResponse] = None
    reminders: List[ReminderResponse] = []

    model_config = {"from_attributes": True}
