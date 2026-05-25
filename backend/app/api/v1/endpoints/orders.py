from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.order import OrderRepository
from app.repositories.book import BookRepository
from app.schemas.order import OrderCreate, OrderUpdate, OrderRead
from app.core.security import get_current_user

router = APIRouter()


@router.get("/", response_model=list[OrderRead])
async def get_orders(
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    return await OrderRepository(db).get_all()


@router.get("/{order_id}", response_model=OrderRead)
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    order = await OrderRepository(db).get_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return order


@router.post("/", response_model=OrderRead, status_code=201)
async def create_order(
    data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    book = await BookRepository(db).get_by_id(data.book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Книга не найдена")
    return await OrderRepository(db).create(data)


@router.patch("/{order_id}/status", response_model=OrderRead)
async def update_order_status(
    order_id: int,
    data: OrderUpdate,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_user),
):
    repo = OrderRepository(db)
    order = await repo.get_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return await repo.update_status(order, data)
