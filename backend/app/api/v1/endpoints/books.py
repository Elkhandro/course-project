from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.book import BookRepository
from app.schemas.book import BookCreate, BookUpdate, BookRead, BookListRead
from app.core.security import get_current_user

router = APIRouter()


@router.get("/", response_model=list[BookListRead])
async def get_books(
    genre_id: int | None = Query(None, description="Фильтр по жанру"),
    author_id: int | None = Query(None, description="Фильтр по автору"),
    out_of_stock: bool = Query(False, description="Только отсутствующие на складе"),
    db: AsyncSession = Depends(get_db),
):
    repo = BookRepository(db)
    if out_of_stock:
        return await repo.get_out_of_stock()
    if genre_id:
        return await repo.get_by_genre(genre_id)
    if author_id:
        return await repo.get_by_author(author_id)
    return await repo.get_all()


@router.get("/analytics/max-price-diff", response_model=BookRead)
async def get_max_price_diff(
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    """Книга с максимальной разницей между розничной и оптовой ценой."""
    book = await BookRepository(db).get_max_price_diff()
    if not book:
        raise HTTPException(status_code=404, detail="Книги не найдены")
    return book


@router.get("/{book_id}", response_model=BookRead)
async def get_book(book_id: int, db: AsyncSession = Depends(get_db)):
    book = await BookRepository(db).get_by_id(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")
    return book


@router.post("/", response_model=BookRead, status_code=201)
async def create_book(
    data: BookCreate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    return await BookRepository(db).create(data)


@router.patch("/{book_id}", response_model=BookRead)
async def update_book(
    book_id: int,
    data: BookUpdate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    repo = BookRepository(db)
    book = await repo.get_by_id(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")
    return await repo.update(book, data)


@router.delete("/{book_id}", status_code=204)
async def delete_book(
    book_id: int,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    repo = BookRepository(db)
    book = await repo.get_by_id(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")
    await repo.delete(book)
