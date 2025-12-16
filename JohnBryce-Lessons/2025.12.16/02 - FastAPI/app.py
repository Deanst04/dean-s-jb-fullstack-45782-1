from fastapi import FastAPI
from sqlmodel import Session, select
from database import create_db_and_tables, engine 
from models import User

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    print("Database tables created!")



@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/add_user")
def create_user(user: User):
    with Session(engine) as session:
        user = User(
            name = user.name,
            email= user.email
        )

        session.add(user)
        session.commit()
        session.refresh(user)

        return user

