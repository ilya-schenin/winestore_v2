from typing import Type, TypeVar, Generic
from sqlalchemy.ext.asyncio import AsyncSession
from shop.models import DeclarativeBase
from sqlalchemy import select


T = TypeVar("T", bound=DeclarativeBase)


class BaseORM(Generic[T]):
    def __init__(self, async_session: AsyncSession, model: Type[T]):
        self.async_session = async_session
        self.model = model

    async def create(self, **kwargs):
        obj = self.model(**kwargs)
        self.async_session.add(obj)
        await self.async_session.commit()

    async def get(self, **kwargs):
        query = select(self.model).filter_by(**kwargs)
        result = await self.async_session.execute(query)
        return result.scalar()

    async def all(self):
        pass

    async def filter(self, *args, **kwargs):
        pass

    async def update(self, *args, **kwargs):
        pass

    async def delete(self, *args, **kwargs):
        pass
