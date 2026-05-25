from datetime import datetime
from pydantic import BaseModel, Field
from app.models.order import OrderStatus
from app.schemas.book import BookListRead


class OrderCreate(BaseModel):
    book_id: int
    quantity: int = Field(..., gt=0)


class OrderUpdate(BaseModel):
    status: OrderStatus


class OrderRead(BaseModel):
    id: int
    quantity: int
    status: OrderStatus
    created_at: datetime
    updated_at: datetime
    book: BookListRead

    model_config = {"from_attributes": True}
