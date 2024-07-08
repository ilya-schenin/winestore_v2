import datetime
from pydantic import EmailStr
from auth.db import get_db
from fastapi import Depends, Form, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from auth.utils import utils, jwt_utils
from auth.orm.orm import UserORM, TokenORM


async def validate_email(email: str, async_session: AsyncSession):
    user_manager = UserORM(async_session=async_session)
    if await user_manager.get(email=email):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='this user already exists'
        )
    return True


async def validate_auth_user(
        email: EmailStr = Form(),
        password: str = Form(),
        async_session: AsyncSession = Depends(get_db)
):
    unauthed_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Неверный email или пароль",
    )
    user_manager = UserORM(async_session)
    if not (user := await user_manager.get(email=email)):
        raise unauthed_exc
    if not jwt_utils.validate_password(
            password=password,
            hashed_password=user.password,
    ):
        raise unauthed_exc

    return user


async def validate_token_refresh(
        payload: dict = Depends(utils.get_current_token_payload),
        async_session: AsyncSession = Depends(get_db)
):
    token_manager = TokenORM(async_session)
    if await token_manager.get(id=payload['jti']):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='token already used'
        )
    if payload.get('type') != 'refresh':
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='invalid token type'
        )
    expiration_time = datetime.datetime.utcfromtimestamp(payload['exp'])
    if datetime.datetime.utcnow() > expiration_time:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='invalid token'
        )
    return payload
