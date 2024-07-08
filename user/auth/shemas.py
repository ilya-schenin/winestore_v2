from pydantic import BaseModel, EmailStr, ConfigDict


class TokenInfo(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = 'Bearer'


class CreateUser(BaseModel):
    model_config = ConfigDict(strict=True)
    email: EmailStr
    first_name: str
    last_name: str
    password: str


class User(BaseModel):
    model_config = ConfigDict(strict=True)
    email: EmailStr
    first_name: str
    last_name: str
    password: bytes


class ShowUser(BaseModel):
    model_config = ConfigDict(strict=True)
    email: EmailStr | str
    first_name: str
    last_name: str
