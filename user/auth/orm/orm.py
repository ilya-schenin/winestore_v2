from auth.orm.base import BaseORM
from auth.models import User, RevokedToken
from sqlalchemy.ext.asyncio import AsyncSession


class UserORM(BaseORM[User]):
    def __init__(self, async_session: AsyncSession):
        super().__init__(async_session=async_session, model=User)


class TokenORM(BaseORM[RevokedToken]):
    def __init__(self, async_session: AsyncSession):
        super().__init__(async_session=async_session, model=RevokedToken)

