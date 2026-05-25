from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.genre import Genre
from app.schemas.genre import GenreCreate, GenreUpdate


class GenreRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Genre]:
        result = await self.db.execute(select(Genre))
        return list(result.scalars().all())

    async def get_by_id(self, genre_id: int) -> Genre | None:
        return await self.db.get(Genre, genre_id)

    async def get_by_name(self, name: str) -> Genre | None:
        result = await self.db.execute(select(Genre).where(Genre.name == name))
        return result.scalar_one_or_none()

    async def create(self, data: GenreCreate) -> Genre:
        genre = Genre(**data.model_dump())
        self.db.add(genre)
        await self.db.flush()
        await self.db.refresh(genre)
        return genre

    async def update(self, genre: Genre, data: GenreUpdate) -> Genre:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(genre, field, value)
        await self.db.flush()
        await self.db.refresh(genre)
        return genre

    async def delete(self, genre: Genre) -> None:
        await self.db.delete(genre)
        await self.db.flush()
