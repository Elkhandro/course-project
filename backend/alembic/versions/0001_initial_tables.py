"""Initial tables

Revision ID: 0001
Revises: 
Create Date: 2024-01-01 00:00:00
"""
from typing import Sequence, Union
import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- ENUM types (PostgreSQL) ---
    

    # --- users ---
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("username", sa.String(50), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.UniqueConstraint("username", name="uq_users_username"),
        sa.UniqueConstraint("email",    name="uq_users_email"),
    )
    op.create_index("ix_users_username", "users", ["username"])

    # --- authors ---
    op.create_table(
        "authors",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("first_name", sa.String(100), nullable=False),
        sa.Column("last_name",  sa.String(100), nullable=False),
    )

    # --- genres ---
    op.create_table(
        "genres",
        sa.Column("id",   sa.Integer,     primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.UniqueConstraint("name", name="uq_genres_name"),
    )
    op.create_index("ix_genres_name", "genres", ["name"])

    # --- books ---
    op.create_table(
        "books",
        sa.Column("id",              sa.Integer,       primary_key=True),
        sa.Column("title",           sa.String(255),   nullable=False),
        sa.Column("year",            sa.Integer,       nullable=False),
        sa.Column("pages",           sa.Integer,       nullable=False),
        sa.Column("media_type", sa.Enum("paperback", "hardcover", "ebook", "audio", name="media_type_enum"), nullable=False),
        sa.Column("wholesale_price", sa.Numeric(10, 2), nullable=False),
        sa.Column("retail_price",    sa.Numeric(10, 2), nullable=False),
        sa.Column("stock",           sa.Integer,        nullable=False, server_default="0"),
        sa.Column("author_id", sa.Integer, sa.ForeignKey("authors.id"), nullable=False),
        sa.Column("genre_id",  sa.Integer, sa.ForeignKey("genres.id"),  nullable=False),
        sa.CheckConstraint("wholesale_price > 0",              name="ck_book_wholesale_positive"),
        sa.CheckConstraint("retail_price > 0",                 name="ck_book_retail_positive"),
        sa.CheckConstraint("retail_price >= wholesale_price",  name="ck_book_retail_gte_wholesale"),
        sa.CheckConstraint("stock >= 0",                       name="ck_book_stock_non_negative"),
        sa.CheckConstraint("pages > 0",                        name="ck_book_pages_positive"),
    )
    op.create_index("ix_books_title",     "books", ["title"])
    op.create_index("ix_books_author_id", "books", ["author_id"])
    op.create_index("ix_books_genre_id",  "books", ["genre_id"])

    # --- catalog ---
    op.create_table(
        "catalog",
        sa.Column("id",           sa.Integer,        primary_key=True),
        sa.Column("cipher",       sa.String(50),     nullable=False),
        sa.Column("retail_price", sa.Numeric(10, 2), nullable=False),
        sa.Column("media_type",   sa.String(50),     nullable=False),
        sa.Column(
            "book_id", sa.Integer,
            sa.ForeignKey("books.id", ondelete="CASCADE"),
            nullable=False, unique=True,
        ),
        sa.UniqueConstraint("cipher", name="uq_catalog_cipher"),
    )
    op.create_index("ix_catalog_cipher", "catalog", ["cipher"])

    # --- sales ---
    op.create_table(
        "sales",
        sa.Column("id",          sa.Integer,        primary_key=True),
        sa.Column("quantity",    sa.Integer,        nullable=False),
        sa.Column("total_price", sa.Numeric(10, 2), nullable=False),
        sa.Column(
            "sold_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.Column(
            "book_id", sa.Integer,
            sa.ForeignKey("books.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.CheckConstraint("quantity > 0",    name="ck_sale_quantity_positive"),
        sa.CheckConstraint("total_price > 0", name="ck_sale_total_positive"),
    )
    op.create_index("ix_sales_sold_at", "sales", ["sold_at"])

    # --- orders ---
    op.create_table(
        "orders",
        sa.Column("id",       sa.Integer,          primary_key=True),
        sa.Column("quantity", sa.Integer,          nullable=False),
        sa.Column("status", sa.Enum("pending", "confirmed", "completed", "cancelled", name="order_status_enum"), nullable=False, server_default="pending"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
        sa.Column(
            "book_id", sa.Integer,
            sa.ForeignKey("books.id", ondelete="RESTRICT"),
            nullable=False,
        ),
        sa.CheckConstraint("quantity > 0", name="ck_order_quantity_positive"),
    )
    op.create_index("ix_orders_created_at", "orders", ["created_at"])


def downgrade() -> None:
    op.drop_table("orders")
    op.drop_table("sales")
    op.drop_table("catalog")
    op.drop_table("books")
    op.drop_table("genres")
    op.drop_table("authors")
    op.drop_table("users")
    sa.Enum(name="order_status_enum").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="media_type_enum").drop(op.get_bind(), checkfirst=True)
