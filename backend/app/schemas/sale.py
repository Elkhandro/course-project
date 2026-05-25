from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, Field
from app.schemas.book import BookListRead


class SaleCreate(BaseModel):
    book_id: int
    quantity: int = Field(..., gt=0)


class SaleRead(BaseModel):
    id: int
    quantity: int
    total_price: Decimal
    sold_at: datetime
    book: BookListRead

    model_config = {"from_attributes": True}
