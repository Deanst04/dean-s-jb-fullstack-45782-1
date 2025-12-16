from fastapi import FastAPI
from sqlmodel import Session, select
from database import create_db_and_tables, engine 
from models import User, UserCreate, UserUpdate
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    create_db_and_tables()
    print("Database tables created!")
    yield

app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/add_user")
def create_user(user: UserCreate):
    with Session(engine) as session:
        user = UserCreate(
            name = user.name,
            last_name = user.last_name
        )

        session.add(user)
        session.commit()
        session.refresh(user)

        return user


@app.get("/get_users")
def get_users():
    with Session(engine) as session:
        statement = select(User)
        users = session.exec(statement).all()
        return users



@app.get("/get_user/{id}")
def get_user_by_id(id: int):
    with Session(engine) as session:
        user = session.get(User, id)
        if not user:
            return {"error": "User not found"}
        return user


@app.patch("/edit_user/{id}")
def edit_user_by_id(id: int, user: UserUpdate):
    with Session(engine) as session:
        db_user = session.get(User, id)
        if not db_user:
            return {"error": "User not found"}

        if user.name is not None:
            db_user.name = user.name

        if user.last_name is not None:
            db_user.last_name = user.last_name

        session.commit()
        session.refresh(db_user)
        return db_user


@app.delete("/delete_user/{id}")
def delete_user_by_id(id: int):
    with Session(engine) as session:
        db_user = session.get(User, id)
        if not db_user:
            return {"error": "User not found"}
        session.delete(db_user)
        session.commit()
        return {"success": "user deleted successfully"}