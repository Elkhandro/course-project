from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.sale import SaleRepository
from app.repositories.book import BookRepository
from app.schemas.sale import SaleCreate, SaleRead
from app.schemas.author import AuthorRead
from app.core.security import get_current_user

router = APIRouter()


@router.get("/", response_model=list[SaleRead])
async def get_sales(
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    return await SaleRepository(db).get_all()


@router.post("/", response_model=SaleRead, status_code=201)
async def create_sale(
    data: SaleCreate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    book_repo = BookRepository(db)
    book = await book_repo.get_by_id(data.book_id)

    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")
    if book.stock < data.quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Недостаточно товара на складе. Доступно: {book.stock}"
        )

    # Считаем сумму и обновляем склад
    total_price = book.retail_price * data.quantity
    await book_repo.update_stock(data.book_id, -data.quantity)

    sale = await SaleRepository(db).create(data.book_id, data.quantity, total_price)
    return sale


@router.get("/analytics/revenue")
async def get_total_revenue(
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    """Общая сумма всех продаж."""
    revenue = await SaleRepository(db).get_total_revenue()
    return {"total_revenue": revenue}


@router.get("/analytics/best-author", response_model=AuthorRead)
async def get_best_selling_author(
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    """Автор с наибольшим количеством проданных книг."""
    author = await SaleRepository(db).get_best_selling_author()
    if not author:
        raise HTTPException(status_code=404, detail="Продаж ещё нет")
    return author
