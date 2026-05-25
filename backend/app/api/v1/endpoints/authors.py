from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.author import AuthorRepository
from app.schemas.author import AuthorCreate, AuthorUpdate, AuthorRead
from app.core.security import get_current_user

router = APIRouter()


@router.get("/", response_model=list[AuthorRead])
async def get_authors(db: AsyncSession = Depends(get_db)):
    return await AuthorRepository(db).get_all()


@router.get("/{author_id}", response_model=AuthorRead)
async def get_author(author_id: int, db: AsyncSession = Depends(get_db)):
    author = await AuthorRepository(db).get_by_id(author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Автор не найден")
    return author


@router.post("/", response_model=AuthorRead, status_code=201)
async def create_author(
    data: AuthorCreate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    return await AuthorRepository(db).create(data)


@router.patch("/{author_id}", response_model=AuthorRead)
async def update_author(
    author_id: int,
    data: AuthorUpdate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    repo = AuthorRepository(db)
    author = await repo.get_by_id(author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Автор не найден")
    return await repo.update(author, data)


@router.delete("/{author_id}", status_code=204)
async def delete_author(
    author_id: int,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    repo = AuthorRepository(db)
    author = await repo.get_by_id(author_id)
    if not author:
        raise HTTPException(status_code=404, detail="Автор не найден")
    await repo.delete(author)
