from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.catalog import Catalog
from app.models.book import Book


class CatalogRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Catalog]:
        result = await self.db.execute(
            select(Catalog).options(
                joinedload(Catalog.book).joinedload(Book.author),
                joinedload(Catalog.book).joinedload(Book.genre),
            )
        )
        return list(result.scalars().unique().all())

    async def get_by_book_id(self, book_id: int) -> Catalog | None:
        result = await self.db.execute(
            select(Catalog).where(Catalog.book_id == book_id)
        )
        return result.scalar_one_or_none()

    async def create(self, book_id: int, cipher: str) -> Catalog:
        from app.models.book import Book as BookModel
        book = await self.db.get(BookModel, book_id)
        catalog = Catalog(
            book_id=book_id,
            cipher=cipher,
            retail_price=book.retail_price,
            media_type=book.media_type.value,
        )
        self.db.add(catalog)
        await self.db.flush()
        await self.db.refresh(catalog)
        return catalog
