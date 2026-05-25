from typing import TYPE_CHECKING
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.book import Book


class Genre(Base):
    __tablename__ = "genres"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)

    # Связь: один жанр — много книг
    books: Mapped[list["Book"]] = relationship(
        "Book", back_populates="genre", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Genre id={self.id} name={self.name!r}>"
