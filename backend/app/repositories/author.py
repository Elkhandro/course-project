from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.author import Author
from app.schemas.author import AuthorCreate, AuthorUpdate


class AuthorRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Author]:
        result = await self.db.execute(select(Author))
        return list(result.scalars().all())

    async def get_by_id(self, author_id: int) -> Author | None:
        return await self.db.get(Author, author_id)

    async def create(self, data: AuthorCreate) -> Author:
        author = Author(**data.model_dump())
        self.db.add(author)
        await self.db.flush()
        await self.db.refresh(author)
        return author

    async def update(self, author: Author, data: AuthorUpdate) -> Author:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(author, field, value)
        await self.db.flush()
        await self.db.refresh(author)
        return author

    async def delete(self, author: Author) -> None:
        await self.db.delete(author)
        await self.db.flush()
