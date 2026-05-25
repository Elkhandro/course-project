from typing import TYPE_CHECKING
from decimal import Decimal

from sqlalchemy import String, Numeric, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.book import Book


class Catalog(Base):
    """
    Каталог магазина — публичное представление книги для покупателя.
    Содержит шифр произведения и розничную цену из прайса.
    Связан с Book отношением 1:1.
    """
    __tablename__ = "catalog"

    __table_args__ = (
        UniqueConstraint("cipher", name="uq_catalog_cipher"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    # Шифр произведения (артикул в каталоге, напр. "DET-2021-042")
    cipher: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    # Розничная цена в каталоге (может отличаться от book.retail_price при акциях)
    retail_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    # Тип носителя дублируется в каталоге для удобства отображения
    media_type: Mapped[str] = mapped_column(String(50), nullable=False)

    # Внешний ключ — 1:1 с Book
    book_id: Mapped[int] = mapped_column(
        ForeignKey("books.id", ondelete="CASCADE"), unique=True, nullable=False
    )

    book: Mapped["Book"] = relationship("Book", back_populates="catalog_entry", lazy="joined")

    def __repr__(self) -> str:
        return f"<Catalog id={self.id} cipher={self.cipher!r}>"
