from abc import ABC, abstractmethod
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from shop.orm.orm import CategoryOrm, ProductOptionsORM, ProductORM
from shop.models import Product, Country, Sugar, ColorVine, ColorBeer


class BaseFilter(ABC):
    @abstractmethod
    def apply(self, query, value, async_session):
        raise NotImplementedError


class CategoryFilter(BaseFilter):
    async def apply(self, query, value: str, async_session: AsyncSession):
        category_orm = CategoryOrm(async_session=async_session)
        categories = await category_orm.filter(slug=value)
        categories_id = list(map(lambda item: item['id'], categories))
        if not categories_id:
            return query.filter(False)
        return query.filter(Product.category_id.in_(categories_id))


class PriceMinFilter(BaseFilter):
    async def apply(self, query, value: float, async_session):
        return query.filter(Product.price >= value)


class PriceMaxFilter(BaseFilter):
    async def apply(self, query, value: float, async_session):
        return query.filter(Product.price <= value)


class CountryFilter(BaseFilter):
    async def apply(self, query, value: list[str], async_session):
        country_option_orm = ProductOptionsORM(
            async_session=async_session,
            model=Country
        )

        countries_id = await country_option_orm.get_ids_by_list(value)
        return query.filter(Product.country_id.in_(countries_id))


class SugarFilter(BaseFilter):
    async def apply(self, query, value: list[str], async_session):
        sugar_option_orm = ProductOptionsORM(
            async_session=async_session,
            model=Sugar
        )
        sugars_id = await sugar_option_orm.get_ids_by_list(value)
        return query.filter(Product.sugar_id.in_(sugars_id))


class ColorVineFilter(BaseFilter):
    async def apply(self, query, value: list[str], async_session):
        color_vine_option_orm = ProductOptionsORM(
            async_session=async_session,
            model=ColorVine
        )
        color_vines_id = await color_vine_option_orm.get_ids_by_list(value)
        return query.filter(Product.color_vine_id.in_(color_vines_id))


class ColorBeerFilter(BaseFilter):
    async def apply(self, query, value: list[str], async_session):
        color_beer_option_orm = ProductOptionsORM(
            async_session=async_session,
            model=ColorBeer
        )
        color_beers_id = await color_beer_option_orm.get_ids_by_list(value)
        return query.filter(Product.color_beer_id.in_(color_beers_id))


class StrengthFilter(BaseFilter):
    async def apply(self, query, value: list[float], async_session):
        return query.filter(Product.strenght.in_(value))


class ItemFilterManager:
    def __init__(self):
        self.__filters = {
            'category': CategoryFilter(),
            'price_min': PriceMinFilter(),
            'price_max': PriceMaxFilter(),
            'country': CountryFilter(),
            'sugar': SugarFilter(),
            'color_vine': ColorVineFilter(),
            'color_beer': ColorBeerFilter(),
            'strength': StrengthFilter(),
        }
        self.__value_black_list = ['', 0, None, []]

    def extend_filters(self, key, value: BaseFilter):
        self.__filters[key] = value

    @property
    def value_black_list(self):
        return self.__value_black_list

    @value_black_list.setter
    def value_black_list(self, value):
        if type(value) != list:
            raise TypeError('value must be a list')
        self.__filters = value

    def validate(self, value):
        return True if value not in self.__value_black_list else False

    async def apply_filters(self, filters: dict, async_session):
        query = select(Product.id)
        for key, value in filters.items():
            if self.validate(value) and key in self.__filters:
                filter_instance = self.__filters[key]
                query = await filter_instance.apply(
                    query,
                    value,
                    async_session
                )
        result = await async_session.execute(query)
        product_orm = ProductORM(
            async_session=async_session
        )
        products = await product_orm.products__in(
            result.scalars().all()
        )
        return products


