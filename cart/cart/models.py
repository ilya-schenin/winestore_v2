from typing import Annotated
from sqlalchemy import BigInteger, String
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped


bigintpk = Annotated[
    int, mapped_column(BigInteger(), primary_key=True, autoincrement=True, index=True)
]


class Base(DeclarativeBase):
    pass


class CartItem(Base):
    __tablename__ = 'cart_cart-item'
    id: Mapped[bigintpk]
    user_id: Mapped[int]
    product_id: Mapped[str] = mapped_column(String(255), unique=True)
    quantity: Mapped[int]

