from pydantic import BaseModel, Field


class GenreBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class GenreCreate(GenreBase):
    pass


class GenreUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)


class GenreRead(GenreBase):
    id: int

    model_config = {"from_attributes": True}
