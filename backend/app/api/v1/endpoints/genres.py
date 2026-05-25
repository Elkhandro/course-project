from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.genre import GenreRepository
from app.schemas.genre import GenreCreate, GenreUpdate, GenreRead
from app.core.security import get_current_user

router = APIRouter()


@router.get("/", response_model=list[GenreRead])
async def get_genres(db: AsyncSession = Depends(get_db)):
    return await GenreRepository(db).get_all()


@router.get("/{genre_id}", response_model=GenreRead)
async def get_genre(genre_id: int, db: AsyncSession = Depends(get_db)):
    genre = await GenreRepository(db).get_by_id(genre_id)
    if not genre:
        raise HTTPException(status_code=404, detail="Жанр не найден")
    return genre


@router.post("/", response_model=GenreRead, status_code=201)
async def create_genre(
    data: GenreCreate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    repo = GenreRepository(db)
    if await repo.get_by_name(data.name):
        raise HTTPException(status_code=400, detail="Жанр с таким названием уже существует")
    return await repo.create(data)


@router.patch("/{genre_id}", response_model=GenreRead)
async def update_genre(
    genre_id: int,
    data: GenreUpdate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    repo = GenreRepository(db)
    genre = await repo.get_by_id(genre_id)
    if not genre:
        raise HTTPException(status_code=404, detail="Жанр не найден")
    return await repo.update(genre, data)


@router.delete("/{genre_id}", status_code=204)
async def delete_genre(
    genre_id: int,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    repo = GenreRepository(db)
    genre = await repo.get_by_id(genre_id)
    if not genre:
        raise HTTPException(status_code=404, detail="Жанр не найден")
    await repo.delete(genre)
