from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, UserRead
from app.schemas.auth import Token
from app.core.security import verify_password, create_access_token

router = APIRouter()


@router.post("/register", response_model=UserRead, status_code=201)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)

    if await repo.get_by_username(data.username):
        raise HTTPException(status_code=400, detail="Пользователь с таким именем уже существует")
    if await repo.get_by_email(data.email):
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

    user = await repo.create(data)
    return user


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    repo = UserRepository(db)
    user = await repo.get_by_username(form_data.username)

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Аккаунт заблокирован")

    token = create_access_token({"sub": str(user.id)})
    return Token(access_token=token)
