from fastapi import Depends

from cart.models import CartItem
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from cart.db import get_db


async def add_to_cart(
        user_id: int,
        product_id: str,
        async_session: AsyncSession,
        quantity: int = 1
        ):
    query = select(CartItem).filter_by(user_id=user_id, product_id=product_id)
    result = await async_session.execute(query)
    obj: CartItem = result.scalar()

    if obj is None:
        cart_item = CartItem(
            user_id=user_id,
            product_id=product_id,
            quantity=1
        )
        async_session.add(cart_item)
        await async_session.commit()
        return None
    new_quantity = obj.quantity + quantity
    statement = update(CartItem).values(quantity=new_quantity)\
        .filter_by(user_id=user_id, product_id=product_id)
    await async_session.execute(statement)
    await async_session.commit()


async def remove_to_cart(
    user_id: int,
    product_id: str,
    async_session: AsyncSession,
    quantity: int = 1
        ):
    print(user_id, product_id)
    query = select(CartItem).filter_by(user_id=user_id, product_id=product_id)
    result = await async_session.execute(query)
    obj: CartItem = result.scalar()
    print(obj)
    if obj is None:
        print('ttt')

        return None

    if obj.quantity == 1:
        stmt = delete(CartItem).filter_by(user_id=user_id, product_id=product_id)
        await async_session.execute(stmt)
        await async_session.commit()
        print('ssss')
        return None
    new_quantity = int(obj.quantity) - quantity
    statement = update(CartItem).values(quantity=new_quantity)\
        .filter_by(user_id=user_id, product_id=product_id)
    await async_session.execute(statement)
    print('uuuuu')
    await async_session.commit()


async def clear_cart(): ...


async def get_user_cart(user_id: int, async_session: AsyncSession):
    query = select(CartItem).filter_by(user_id=user_id)
    result = await async_session.execute(query)
    return result.scalars().all()


