from app.repositories.author import AuthorRepository
from app.repositories.genre import GenreRepository
from app.repositories.book import BookRepository
from app.repositories.sale import SaleRepository
from app.repositories.order import OrderRepository
from app.repositories.user import UserRepository
from app.repositories.catalog import CatalogRepository

__all__ = [
    "AuthorRepository",
    "GenreRepository",
    "BookRepository",
    "SaleRepository",
    "OrderRepository",
    "UserRepository",
    "CatalogRepository",
]
