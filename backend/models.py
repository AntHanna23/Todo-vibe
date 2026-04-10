from datetime import datetime, UTC
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    todos = relationship("Todo", back_populates="tag")


class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default="incomplete", nullable=False)
    priority = Column(String, nullable=True)
    due_at = Column(DateTime, nullable=True)
    tag_id = Column(Integer, ForeignKey("tags.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC))

    tag = relationship("Tag", back_populates="todos")
    reminders = relationship("Reminder", back_populates="todo", cascade="all, delete-orphan")


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    todo_id = Column(Integer, ForeignKey("todos.id", ondelete="CASCADE"), nullable=False)
    remind_at = Column(DateTime, nullable=False)
    offset_minutes = Column(Integer, nullable=False)
    method = Column(String, default="browser", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    todo = relationship("Todo", back_populates="reminders")
