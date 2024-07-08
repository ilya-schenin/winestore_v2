import uuid
from typing import Annotated
from sqlalchemy import BigInteger, Boolean, String
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped
from sqlalchemy.dialects.postgresql import UUID

short_string = Annotated[
    str, mapped_column(String(30))
]

bigintpk = Annotated[
    int, mapped_column(BigInteger(), primary_key=True, autoincrement=True, index=True)
]


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = 'auth_user'
    id: Mapped[bigintpk]
    is_superuser: Mapped[bool] = mapped_column(Boolean(), default=False)
    email: Mapped[short_string]
    first_name: Mapped[short_string]
    last_name: Mapped[short_string]
    password: Mapped[bytes]


class RevokedToken(Base):
    __tablename__ = 'revoked_token'
    id: Mapped[bytes] = mapped_column(UUID(as_uuid=True), primary_key=True)
