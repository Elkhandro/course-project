# Импорт всех моделей — нужен для Alembic, чтобы он видел все таблицы
from app.models.user import User
from app.models.author import Author
from app.models.genre import Genre
from app.models.book import Book, MediaType
from app.models.catalog import Catalog
from app.models.sale import Sale
from app.models.order import Order, OrderStatus

__all__ = [
    "User",
    "Author",
    "Genre",
    "Book", "MediaType",
    "Catalog",
    "Sale",
    "Order", "OrderStatus",
]
