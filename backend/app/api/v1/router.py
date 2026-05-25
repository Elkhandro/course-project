from fastapi import APIRouter

from app.api.v1.endpoints import books, authors, genres, catalog, sales, orders, auth

api_router = APIRouter()

api_router.include_router(auth.router,    prefix="/auth",    tags=["Auth"])
api_router.include_router(books.router,   prefix="/books",   tags=["Books"])
api_router.include_router(authors.router, prefix="/authors", tags=["Authors"])
api_router.include_router(genres.router,  prefix="/genres",  tags=["Genres"])
api_router.include_router(catalog.router, prefix="/catalog", tags=["Catalog"])
api_router.include_router(sales.router,   prefix="/sales",   tags=["Sales"])
api_router.include_router(orders.router,  prefix="/orders",  tags=["Orders"])
