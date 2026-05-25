from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.catalog import CatalogRepository
from app.schemas.catalog import CatalogRead
from app.core.security import get_current_user

router = APIRouter()


@router.get("/", response_model=list[CatalogRead])
async def get_catalog(db: AsyncSession = Depends(get_db)):
    return await CatalogRepository(db).get_all()


@router.post("/{book_id}", response_model=CatalogRead, status_code=201)
async def add_to_catalog(
    book_id: int,
    cipher: str,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    repo = CatalogRepository(db)
    if await repo.get_by_book_id(book_id):
        raise HTTPException(status_code=400, detail="Книга уже в каталоге")
    return await repo.create(book_id, cipher)
