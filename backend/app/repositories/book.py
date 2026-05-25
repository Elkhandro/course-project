from decimal import Decimal
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.book import Book
from app.models.author import Author
from app.schemas.book import BookCreate, BookUpdate


class BookRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Book]:
        result = await self.db.execute(
            select(Book).options(joinedload(Book.author), joinedload(Book.genre))
        )
        return list(result.scalars().unique().all())

    async def get_by_id(self, book_id: int) -> Book | None:
        result = await self.db.execute(
            select(Book)
            .where(Book.id == book_id)
            .options(joinedload(Book.author), joinedload(Book.genre))
        )
        return result.scalar_one_or_none()

    async def get_by_genre(self, genre_id: int) -> list[Book]:
        result = await self.db.execute(
            select(Book)
            .where(Book.genre_id == genre_id)
            .options(joinedload(Book.author), joinedload(Book.genre))
        )
        return list(result.scalars().unique().all())

    async def get_by_author(self, author_id: int) -> list[Book]:
        result = await self.db.execute(
            select(Book)
            .where(Book.author_id == author_id)
            .options(joinedload(Book.author), joinedload(Book.genre))
        )
        return list(result.scalars().unique().all())

    async def get_out_of_stock(self) -> list[Book]:
        """Книги, которых нет на складе (stock = 0)."""
        result = await self.db.execute(
            select(Book)
            .where(Book.stock == 0)
            .options(joinedload(Book.author), joinedload(Book.genre))
        )
        return list(result.scalars().unique().all())

    async def get_max_price_diff(self) -> Book | None:
        """Книга с максимальной разницей между розничной и оптовой ценой."""
        result = await self.db.execute(
            select(Book)
            .options(joinedload(Book.author), joinedload(Book.genre))
            .order_by((Book.retail_price - Book.wholesale_price).desc())
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def create(self, data: BookCreate) -> Book:
        book = Book(**data.model_dump())
        self.db.add(book)
        await self.db.flush()
        await self.db.refresh(book)
        return book

    async def update(self, book: Book, data: BookUpdate) -> Book:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(book, field, value)
        await self.db.flush()
        await self.db.refresh(book)
        return book

    async def delete(self, book: Book) -> None:
        await self.db.delete(book)
        await self.db.flush()

    async def update_stock(self, book_id: int, delta: int) -> Book | None:
        """Изменить остаток на складе. delta может быть отрицательным (продажа)."""
        book = await self.get_by_id(book_id)
        if book is None:
            return None
        book.stock += delta
        await self.db.flush()
        await self.db.refresh(book)
        return book
