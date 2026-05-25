from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Integer, Numeric, ForeignKey, DateTime, CheckConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.book import Book


class Sale(Base):
    """
    Запись о продаже книги.
    При создании: stock книги уменьшается, total_price рассчитывается автоматически.
    """
    __tablename__ = "sales"

    __table_args__ = (
        CheckConstraint("quantity > 0",    name="ck_sale_quantity_positive"),
        CheckConstraint("total_price > 0", name="ck_sale_total_positive"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    total_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    sold_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )

    book_id: Mapped[int] = mapped_column(
        ForeignKey("books.id", ondelete="RESTRICT"), nullable=False
    )
    book: Mapped["Book"] = relationship("Book", back_populates="sales", lazy="joined")

    def __repr__(self) -> str:
        return f"<Sale id={self.id} book_id={self.book_id} qty={self.quantity}>"
