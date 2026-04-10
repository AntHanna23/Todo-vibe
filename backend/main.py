from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import todos, tags, reminders, dashboard

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo-vibe API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todos.router)
app.include_router(tags.router)
app.include_router(reminders.router)
app.include_router(dashboard.router)


@app.get("/health")
def health():
    return {"status": "ok", "message": "Todo-vibe API is running"}
