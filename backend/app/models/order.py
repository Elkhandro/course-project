from datetime import datetime
from typing import TYPE_CHECKING
import enum

from sqlalchemy import Integer, ForeignKey, DateTime, CheckConstraint, Enum, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.book import Book


class OrderStatus(str, enum.Enum):
    """Статус заказа на отсутствующую книгу."""
    pending   = "pending"    # создан, ожидает обработки
    confirmed = "confirmed"  # подтверждён поставщиком
    completed = "completed"  # получен и добавлен на склад
    cancelled = "cancelled"  # отменён


class Order(Base):
    """
    Заказ на книгу, отсутствующую на складе.
    """
    __tablename__ = "orders"

    __table_args__ = (
        CheckConstraint("quantity > 0", name="ck_order_quantity_positive"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus, name="order_status_enum"),
        nullable=False,
        default=OrderStatus.pending,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    book_id: Mapped[int] = mapped_column(
        ForeignKey("books.id", ondelete="RESTRICT"), nullable=False
    )
    book: Mapped["Book"] = relationship("Book", back_populates="orders", lazy="joined")

    def __repr__(self) -> str:
        return f"<Order id={self.id} book_id={self.book_id} status={self.status}>"
