from decimal import Decimal
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.sale import Sale
from app.models.book import Book
from app.models.author import Author


class SaleRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Sale]:
        result = await self.db.execute(
            select(Sale).options(
                joinedload(Sale.book).joinedload(Book.author),
                joinedload(Sale.book).joinedload(Book.genre),
            )
        )
        return list(result.scalars().unique().all())

    async def get_by_id(self, sale_id: int) -> Sale | None:
        return await self.db.get(Sale, sale_id)

    async def create(self, book_id: int, quantity: int, total_price: Decimal) -> Sale:
        sale = Sale(book_id=book_id, quantity=quantity, total_price=total_price)
        self.db.add(sale)
        await self.db.flush()
        await self.db.refresh(sale)
        return sale

    async def get_total_revenue(self) -> Decimal:
        """Общая сумма всех продаж."""
        result = await self.db.execute(select(func.sum(Sale.total_price)))
        return result.scalar_one_or_none() or Decimal("0")

    async def get_best_selling_author(self) -> Author | None:
        """Автор с наибольшим количеством проданных книг."""
        result = await self.db.execute(
            select(Author)
            .join(Book, Book.author_id == Author.id)
            .join(Sale, Sale.book_id == Book.id)
            .group_by(Author.id)
            .order_by(func.sum(Sale.quantity).desc())
            .limit(1)
        )
        return result.scalar_one_or_none()
