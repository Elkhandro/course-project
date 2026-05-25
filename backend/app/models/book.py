from typing import TYPE_CHECKING
from decimal import Decimal

from sqlalchemy import String, Integer, Numeric, ForeignKey, CheckConstraint, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.author import Author
    from app.models.genre import Genre
    from app.models.catalog import Catalog
    from app.models.sale import Sale
    from app.models.order import Order


class MediaType(str, enum.Enum):
    """Тип носителя книги."""
    paperback = "paperback"   # мягкая обложка
    hardcover = "hardcover"   # твёрдая обложка
    ebook = "ebook"           # электронная книга
    audio = "audio"           # аудиокнига


class Book(Base):
    __tablename__ = "books"

    __table_args__ = (
        CheckConstraint("wholesale_price > 0", name="ck_book_wholesale_positive"),
        CheckConstraint("retail_price > 0",    name="ck_book_retail_positive"),
        CheckConstraint("retail_price >= wholesale_price", name="ck_book_retail_gte_wholesale"),
        CheckConstraint("stock >= 0",          name="ck_book_stock_non_negative"),
        CheckConstraint("pages > 0",           name="ck_book_pages_positive"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    pages: Mapped[int] = mapped_column(Integer, nullable=False)
    media_type: Mapped[MediaType] = mapped_column(
        Enum(MediaType, name="media_type_enum"), nullable=False
    )

    # Цены хранятся с точностью до копейки (10 цифр, 2 знака после запятой)
    wholesale_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    retail_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    # Остаток на складе
    stock: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # Внешние ключи
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id"), nullable=False)
    genre_id: Mapped[int] = mapped_column(ForeignKey("genres.id"), nullable=False)

    # Связи
    author: Mapped["Author"] = relationship("Author", back_populates="books", lazy="joined")
    genre: Mapped["Genre"] = relationship("Genre", back_populates="books", lazy="joined")
    catalog_entry: Mapped["Catalog"] = relationship(
        "Catalog", back_populates="book", uselist=False, lazy="selectin"
    )
    sales: Mapped[list["Sale"]] = relationship(
        "Sale", back_populates="book", lazy="selectin"
    )
    orders: Mapped[list["Order"]] = relationship(
        "Order", back_populates="book", lazy="selectin"
    )

    @property
    def price_diff(self) -> Decimal:
        """Разница между розничной и оптовой ценой."""
        return self.retail_price - self.wholesale_price

    @property
    def is_in_stock(self) -> bool:
        return self.stock > 0

    def __repr__(self) -> str:
        return f"<Book id={self.id} title={self.title!r}>"
