"""
Скрипт заполнения базы данных тестовыми данными.
Запуск: python seed.py
Из папки backend, с активированным виртуальным окружением.
"""
import asyncio
from decimal import Decimal

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.core.config import settings
from app.core.security import hash_password
from app.models.user import User
from app.models.author import Author
from app.models.genre import Genre
from app.models.book import Book, MediaType
from app.models.sale import Sale        # нужен чтобы SQLAlchemy знал о связях
from app.models.order import Order      # то же самое
from app.models.catalog import Catalog  # то же самое

engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


async def seed():
    async with AsyncSessionLocal() as db:
        # ── 1. Пользователь-сотрудник ──────────────────────────────────────
        user = User(
            username="admin",
            email="admin@bookshop.ru",
            hashed_password=hash_password("admin123"),
            is_active=True,
        )
        db.add(user)
        await db.flush()
        print("✅ Пользователь: admin / admin123")

        # ── 2. Жанры ───────────────────────────────────────────────────────
        genres_data = [
            "Роман", "Детектив", "Фантастика",
            "Научная литература", "Поэзия", "Биография",
            "Приключения", "Психология",
        ]
        genres = {}
        for name in genres_data:
            g = Genre(name=name)
            db.add(g)
            genres[name] = g
        await db.flush()
        print(f"✅ Жанры: {len(genres)} шт.")

        # ── 3. Авторы ──────────────────────────────────────────────────────
        authors_data = [
            ("Лев", "Толстой"),
            ("Фёдор", "Достоевский"),
            ("Михаил", "Булгаков"),
            ("Агата", "Кристи"),
            ("Стивен", "Кинг"),
            ("Харуки", "Мураками"),
            ("Джоан", "Роулинг"),
            ("Антон", "Чехов"),
        ]
        authors = {}
        for first, last in authors_data:
            a = Author(first_name=first, last_name=last)
            db.add(a)
            authors[f"{first} {last}"] = a
        await db.flush()
        print(f"✅ Авторы: {len(authors)} шт.")

        # ── 4. Книги ───────────────────────────────────────────────────────
        books_data = [
            {
                "title": "Война и мир",
                "author": "Лев Толстой",
                "genre": "Роман",
                "year": 1869,
                "pages": 1274,
                "media_type": MediaType.hardcover,
                "wholesale_price": Decimal("450.00"),
                "retail_price": Decimal("890.00"),
                "stock": 15,
            },
            {
                "title": "Преступление и наказание",
                "author": "Фёдор Достоевский",
                "genre": "Роман",
                "year": 1866,
                "pages": 592,
                "media_type": MediaType.paperback,
                "wholesale_price": Decimal("280.00"),
                "retail_price": Decimal("550.00"),
                "stock": 8,
            },
            {
                "title": "Мастер и Маргарита",
                "author": "Михаил Булгаков",
                "genre": "Роман",
                "year": 1967,
                "pages": 480,
                "media_type": MediaType.paperback,
                "wholesale_price": Decimal("300.00"),
                "retail_price": Decimal("620.00"),
                "stock": 20,
            },
            {
                "title": "Убийство в «Восточном экспрессе»",
                "author": "Агата Кристи",
                "genre": "Детектив",
                "year": 1934,
                "pages": 256,
                "media_type": MediaType.paperback,
                "wholesale_price": Decimal("200.00"),
                "retail_price": Decimal("420.00"),
                "stock": 12,
            },
            {
                "title": "Оно",
                "author": "Стивен Кинг",
                "genre": "Фантастика",
                "year": 1986,
                "pages": 1138,
                "media_type": MediaType.hardcover,
                "wholesale_price": Decimal("520.00"),
                "retail_price": Decimal("980.00"),
                "stock": 5,
            },
            {
                "title": "Норвежский лес",
                "author": "Харуки Мураками",
                "genre": "Роман",
                "year": 1987,
                "pages": 368,
                "media_type": MediaType.paperback,
                "wholesale_price": Decimal("350.00"),
                "retail_price": Decimal("680.00"),
                "stock": 0,
            },
            {
                "title": "Гарри Поттер и философский камень",
                "author": "Джоан Роулинг",
                "genre": "Приключения",
                "year": 1997,
                "pages": 309,
                "media_type": MediaType.hardcover,
                "wholesale_price": Decimal("400.00"),
                "retail_price": Decimal("750.00"),
                "stock": 30,
            },
            {
                "title": "Гарри Поттер и тайная комната",
                "author": "Джоан Роулинг",
                "genre": "Приключения",
                "year": 1998,
                "pages": 341,
                "media_type": MediaType.hardcover,
                "wholesale_price": Decimal("400.00"),
                "retail_price": Decimal("750.00"),
                "stock": 25,
            },
            {
                "title": "Вишнёвый сад",
                "author": "Антон Чехов",
                "genre": "Роман",
                "year": 1904,
                "pages": 96,
                "media_type": MediaType.paperback,
                "wholesale_price": Decimal("120.00"),
                "retail_price": Decimal("280.00"),
                "stock": 0,
            },
            {
                "title": "Идиот",
                "author": "Фёдор Достоевский",
                "genre": "Роман",
                "year": 1869,
                "pages": 640,
                "media_type": MediaType.ebook,
                "wholesale_price": Decimal("150.00"),
                "retail_price": Decimal("320.00"),
                "stock": 999,
            },
            {
                "title": "Сияние",
                "author": "Стивен Кинг",
                "genre": "Фантастика",
                "year": 1977,
                "pages": 447,
                "media_type": MediaType.paperback,
                "wholesale_price": Decimal("380.00"),
                "retail_price": Decimal("720.00"),
                "stock": 7,
            },
            {
                "title": "Десять негритят",
                "author": "Агата Кристи",
                "genre": "Детектив",
                "year": 1939,
                "pages": 224,
                "media_type": MediaType.paperback,
                "wholesale_price": Decimal("190.00"),
                "retail_price": Decimal("390.00"),
                "stock": 18,
            },
        ]

        for bdata in books_data:
            book = Book(
                title=bdata["title"],
                author=authors[bdata["author"]],
                genre=genres[bdata["genre"]],
                year=bdata["year"],
                pages=bdata["pages"],
                media_type=bdata["media_type"],
                wholesale_price=bdata["wholesale_price"],
                retail_price=bdata["retail_price"],
                stock=bdata["stock"],
            )
            db.add(book)

        await db.flush()
        print(f"✅ Книги: {len(books_data)} шт.")

        await db.commit()
        print("\n🎉 База данных успешно заполнена!")
        print("   Логин: admin")
        print("   Пароль: admin123")


if __name__ == "__main__":
    asyncio.run(seed())
