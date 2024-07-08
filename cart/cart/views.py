from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import EmailStr
from cart.db import get_db
from cart.models import CartItem
from fastapi import APIRouter, Depends, Form, HTTPException, status
from cart.producers import UserClient
from cart.utils.utils import add_to_cart, remove_to_cart, get_user_cart
from fastapi.responses import JSONResponse
from jwt.exceptions import InvalidTokenError
from sqlalchemy.ext.asyncio import AsyncSession


http_bearer = HTTPBearer(auto_error=False)
router = APIRouter(prefix='/cart', dependencies=[Depends(http_bearer)])


def get_current_user_id(token:  HTTPAuthorizationCredentials = Depends(http_bearer)):
    client = UserClient()
    try:
        user_id = client.get_user_id_by_jwt(token=token.credentials)

    except TimeoutError:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail='timeout error'
        )

    except TypeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='error with getting response'
        )

    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='invalid token'
        )

    # if not user_id:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail='invalid token'
    #     )

    return user_id


@router.post('/add-to-cart/{product_id}')
async def add_to_cart_view(
        product_id: str,
        user_id: int = Depends(get_current_user_id),
        async_session=Depends(get_db)
    ):
    await add_to_cart(
        product_id=product_id,
        user_id=user_id,
        async_session=async_session
    )

    return JSONResponse(status_code=status.HTTP_200_OK, content={"status": "ok"})


@router.post('/remove-to-cart/{product_id}')
async def remove_to_cart_view(
        product_id: str,
        user_id: int = Depends(get_current_user_id),
        async_session=Depends(get_db)
    ):
    await remove_to_cart(
        product_id=product_id,
        user_id=user_id,
        async_session=async_session
    )

    return JSONResponse(status_code=status.HTTP_200_OK, content={"status": "ok"})


@router.get('/user-cart/')
async def user_cart(
        user_id: int = Depends(get_current_user_id),
        async_session: AsyncSession = Depends(get_db)
):
    cart = await get_user_cart(user_id, async_session)
    return cart
