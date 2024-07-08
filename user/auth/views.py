import datetime
import uuid
from pydantic import EmailStr
from auth.db import get_db
from fastapi import APIRouter, Depends, Form, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from auth.utils.jwt_utils import hash_password
from auth.shemas import User, TokenInfo, ShowUser
from auth.utils import utils, jwt_utils
from auth.orm.orm import UserORM, TokenORM
from fastapi.responses import JSONResponse
from auth.utils.validation import validate_auth_user, validate_email, validate_token_refresh

router = APIRouter(prefix='/jwt', dependencies=[Depends(utils.http_bearer)])


@router.post('/register/')
async def register(
        email: EmailStr = Form(),
        first_name: str = Form(),
        last_name: str = Form(),
        password: str = Form(),
        async_session: AsyncSession = Depends(get_db)
):
    await validate_email(email=email, async_session=async_session)
    user_manager = UserORM(async_session)
    await user_manager.create(
        email=email,
        first_name=first_name,
        last_name=last_name,
        password=hash_password(password)
    )

    return JSONResponse(status_code=status.HTTP_200_OK, content={"status": "Вы успешно зарегестрировались"})


@router.post("/login/", response_model=TokenInfo)
def auth_user_issue_jwt(
        user: User = Depends(validate_auth_user),
):
    jti = str(uuid.uuid4())
    access_token = jwt_utils.create_access_token(user)
    refresh_token = jwt_utils.create_refresh_token(user, jti=jti)

    return TokenInfo(
        access_token=access_token,
        refresh_token=refresh_token
    )


@router.get('/current_user/', response_model=ShowUser)
def get_current_user(user: User = Depends(utils.get_current_auth_user)):
    return ShowUser(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name
    )


@router.post('/refresh/',  response_model=TokenInfo)
async def refresh_token(payload: dict = Depends(validate_token_refresh), async_session=Depends(get_db)):
    token_manager = TokenORM(async_session)
    user_manager = UserORM(async_session)
    expiration_time = datetime.datetime.utcfromtimestamp(payload['exp'])
    user = await user_manager.get(id=payload['sub'])
    new_access_token = jwt_utils.create_access_token(user)
    new_refresh_token = jwt_utils.create_refresh_token(
        user=user,
        expire_timedelta=expiration_time - datetime.datetime.utcnow(),
        jti=str(uuid.uuid4())
    )
    await token_manager.create(id=payload['jti'])
    return TokenInfo(
        access_token=new_access_token,
        refresh_token=new_refresh_token
    )

