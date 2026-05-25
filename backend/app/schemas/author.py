from pydantic import BaseModel, Field


class AuthorBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)


class AuthorCreate(AuthorBase):
    pass


class AuthorUpdate(BaseModel):
    first_name: str | None = Field(None, min_length=1, max_length=100)
    last_name: str | None = Field(None, min_length=1, max_length=100)


class AuthorRead(AuthorBase):
    id: int
    full_name: str

    model_config = {"from_attributes": True}
