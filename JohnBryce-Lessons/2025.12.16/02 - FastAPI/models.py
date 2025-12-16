from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    last_name: str

class UserCreate(SQLModel):
    name: str
    last_name: str

class UserUpdate(SQLModel):
    name: str | None = None
    last_name: str | None = None