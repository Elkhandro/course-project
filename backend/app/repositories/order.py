from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.order import Order, OrderStatus
from app.models.book import Book
from app.schemas.order import OrderCreate, OrderUpdate


class OrderRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Order]:
        result = await self.db.execute(
            select(Order).options(
                joinedload(Order.book).joinedload(Book.author),
                joinedload(Order.book).joinedload(Book.genre),
            )
        )
        return list(result.scalars().unique().all())

    async def get_by_id(self, order_id: int) -> Order | None:
        return await self.db.get(Order, order_id)

    async def create(self, data: OrderCreate) -> Order:
        order = Order(**data.model_dump())
        self.db.add(order)
        await self.db.flush()
        await self.db.refresh(order)
        return order

    async def update_status(self, order: Order, data: OrderUpdate) -> Order:
        order.status = data.status
        await self.db.flush()
        await self.db.refresh(order)
        return order
