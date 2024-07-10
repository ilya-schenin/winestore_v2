from typing import Annotated
from sqlalchemy import BigInteger, String, ForeignKey, Float, DECIMAL, DateTime, Integer
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship, declared_attr
import datetime


short_string = Annotated[
    str, mapped_column(String(55))
]

bigintpk = Annotated[
    int, mapped_column(BigInteger(), primary_key=True, autoincrement=True, index=True)
]

strpk = Annotated[
    str, mapped_column(String(), primary_key=True, index=True)
]


class Base(DeclarativeBase):
    pass


class Country(Base):
    __tablename__ = 'shop_country'
    id: Mapped[strpk]
    name: Mapped[short_string]


class Category(Base):
    __tablename__ = 'shop_category'
    id: Mapped[strpk] = mapped_column()
    name: Mapped[short_string]
    slug: Mapped[str] = mapped_column(
        String(255),
        unique=True
    )
    parent_id: Mapped[int] = mapped_column(
        ForeignKey('shop_category.id'),
        nullable=True
    )
    parent: Mapped["Category"] = relationship(
        back_populates='children',
        remote_side=[id]
    )
    children: Mapped["Category"] = relationship(back_populates='parent')
    npp: Mapped[int]


class Shop(Base):
    __tablename__ = 'shop_shop'
    id: Mapped[strpk]
    shop: Mapped[str] = mapped_column(String(255))
    city: Mapped[short_string]
    work_date: Mapped[str] = mapped_column(String(255))
    geo_coords: Mapped[str] = mapped_column(String(255))
    npp: Mapped[int]


class Image(Base):
    __tablename__ = 'shop_image'
    id: Mapped[bigintpk]
    owner: Mapped[str]
    code_owner: Mapped[strpk] = mapped_column(ForeignKey('shop_product.id'))
    img: Mapped[str]
    img_name: Mapped[str]
    npp: Mapped[int]
    product: Mapped["Product"] = relationship("Product", back_populates="images")

    def __str__(self):
        return self.id

    def __repr__(self):
        return self.img_name


class BaseProductOptions:
    id: Mapped[strpk]
    name: Mapped[short_string]


class ColorVine(Base, BaseProductOptions):
    __tablename__ = 'shop_color_vine'


class ColorBeer(Base, BaseProductOptions):
    __tablename__ = 'shop_color_beer'


class Sugar(Base, BaseProductOptions):
    __tablename__ = 'shop_sugar'


class CategoryProductRelation:
    @declared_attr
    def category_id(cls):
        return mapped_column(ForeignKey('shop_category.id'), nullable=True)

    @declared_attr
    def category(cls):
        return relationship('Category')


class CountryProductRelation:
    @declared_attr
    def country_id(cls):
        return mapped_column(ForeignKey('shop_country.id'), nullable=True)

    @declared_attr
    def country(cls):
        return relationship('Country')


class ColorVineProductRelation:
    @declared_attr
    def color_vine_id(cls):
        return mapped_column(ForeignKey('shop_color_vine.id'), nullable=True)

    @declared_attr
    def color_vine(cls):
        return relationship('ColorVine')


class ColorBeerProductRelation:
    @declared_attr
    def color_beer_id(cls):
        return mapped_column(ForeignKey('shop_color_beer.id'), nullable=True)

    @declared_attr
    def color_beer(cls):
        return relationship('ColorBeer')


class SugarProductRelation:
    @declared_attr
    def sugar_id(cls):
        return mapped_column(ForeignKey('shop_sugar.id'), nullable=True)

    @declared_attr
    def sugar(cls):
        return relationship('Sugar')


class Product(
    Base,
    CategoryProductRelation,
    CountryProductRelation,
    ColorVineProductRelation,
    ColorBeerProductRelation,
    SugarProductRelation
):
    __tablename__ = 'shop_product'
    id: Mapped[strpk]
    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(
        String(255),
        unique=True
    )
    volume: Mapped[float] = mapped_column(
        Float(),
        nullable=True
    )

    description: Mapped[str] = mapped_column(
        String(2500),
        nullable=True
    )
    images: Mapped[list["Image"]] = relationship(
        "Image",
        back_populates="product"
    )
    price: Mapped[float] = mapped_column(Float(), nullable=True)
    strenght: Mapped[float] = mapped_column(Float(), nullable=True)
    npp: Mapped[int] = mapped_column(Integer(), nullable=True)


class ShopProduct(Base):
    __tablename__ = 'shop_shop_product'
    id: Mapped[strpk]
    shop_id: Mapped[str] = mapped_column(ForeignKey('shop_shop.id'))
    shop: Mapped['Shop'] = relationship('Shop')
    product_id: Mapped[int] = mapped_column(ForeignKey('shop_product.id'))
    product: Mapped['Product'] = relationship('Product')
    stock: Mapped[str]
    quantity_thershold: Mapped[int]
    price: Mapped[float] = mapped_column(DECIMAL(scale=3))
    price_time: Mapped[datetime] = mapped_column(DateTime())
    price_old: Mapped[float] = mapped_column(DECIMAL(scale=3))
    price_from: Mapped[float] = mapped_column(DECIMAL(scale=3))
    stock_qty: Mapped[int]
    npp: Mapped[int]

