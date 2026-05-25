from decimal import Decimal
from pydantic import BaseModel
from app.schemas.book import BookListRead


class CatalogRead(BaseModel):
    id: int
    cipher: str
    retail_price: Decimal
    media_type: str
    book: BookListRead

    model_config = {"from_attributes": True}
