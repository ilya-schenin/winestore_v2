from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from auth.db import get_db
from auth.utils import jwt_utils
from auth.shemas import User
from jwt.exceptions import InvalidTokenError
from auth.orm.orm import UserORM
from sqlalchemy.ext.asyncio import AsyncSession

http_bearer = HTTPBearer(auto_error=False)


def get_current_token_payload(
        credentials: HTTPAuthorizationCredentials = Depends(http_bearer)
) -> dict:
    try:
        token = credentials.credentials
    except AttributeError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='token is None')
    try:
        payload = jwt_utils.decode_jwt(token=token)

    except InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='invalid token')

    return payload


async def get_current_auth_user(
        payload: dict = Depends(get_current_token_payload),
        async_session: AsyncSession = Depends(get_db)
) -> User:
    email = payload.get("email")
    if payload.get('type') != 'access':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='invalid token type')
    user_manager = UserORM(async_session)
    if user := await user_manager.get(email=email):
        return user
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="token invalid (user not found)",
    )

