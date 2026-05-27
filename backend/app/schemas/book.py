from decimal import Decimal
from pydantic import BaseModel, Field, model_validator
from app.models.book import MediaType
from app.schemas.author import AuthorRead
from app.schemas.genre import GenreRead


class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    year: int = Field(..., ge=1000, le=2100)
    pages: int = Field(..., gt=0)
    media_type: MediaType
    wholesale_price: Decimal = Field(..., gt=0, decimal_places=2)
    retail_price: Decimal = Field(..., gt=0, decimal_places=2)
    stock: int = Field(0, ge=0)
    author_id: int
    genre_id: int

    @model_validator(mode="after")
    def retail_gte_wholesale(self) -> "BookBase":
        if self.retail_price < self.wholesale_price:
            raise ValueError("Розничная цена не может быть меньше оптовой")
        return self


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=255)
    year: int | None = Field(None, ge=1000, le=2100)
    pages: int | None = Field(None, gt=0)
    media_type: MediaType | None = None
    wholesale_price: Decimal | None = Field(None, gt=0, decimal_places=2)
    retail_price: Decimal | None = Field(None, gt=0, decimal_places=2)
    stock: int | None = Field(None, ge=0)
    author_id: int | None = None
    genre_id: int | None = None
    cover_image: str | None = None


# Краткое представление — для списков
class BookListRead(BaseModel):
    id: int
    title: str
    year: int
    media_type: MediaType
    retail_price: Decimal
    stock: int
    author: AuthorRead
    genre: GenreRead
    is_in_stock: bool
    cover_image: str | None = None

    model_config = {"from_attributes": True}


# Полное представление — для детальной страницы
class BookRead(BookListRead):
    pages: int
    wholesale_price: Decimal
    price_diff: Decimal
    cover_image: str | None = None

    model_config = {"from_attributes": True}
