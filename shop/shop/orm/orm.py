from shop.orm.base import BaseORM
from shop.models import Product, Category, BaseProductOptions
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload, aliased
from shop.shemas import CategoryModel, ProductModel


class ProductORM(BaseORM[Product]):
    def __init__(self, async_session: AsyncSession):
        super().__init__(async_session=async_session, model=Product)

    @staticmethod
    def product_options():
        return [
            selectinload(Product.category),
            selectinload(Product.country),
            selectinload(Product.color_vine),
            selectinload(Product.color_beer),
            selectinload(Product.sugar)
        ]

    async def all(self):
        query = (
            select(Product)
            .options(
                *self.product_options()
            )
        )
        result = await self.async_session.execute(query)
        return result.scalars().all()

    async def products__in(self, array: list):
        query = (
            select(Product)
            .filter(Product.id.in_(array))
            .options(
                *self.product_options()
            )
        )
        result = await self.async_session.execute(query)
        return result.scalars().all()

    async def get(self, **kwargs):
        query = (
            select(Product).filter_by(**kwargs)
            .options(
                *self.product_options()
            )
        )
        result = await self.async_session.execute(query)
        return result.scalar()

    async def filter_in_category(self, category_list: list[CategoryModel]):
        categories_id = []
        for category in category_list:
            categories_id.append(category['id'])
        query = select(Product).where(
            Product.category_id.in_(categories_id)
        ).options(
            *self.product_options()
        )
        result = await self.async_session.execute(query)
        data = result.scalars().all()
        return [ProductModel.from_orm(row).dict() for row in data]


class CategoryOrm(BaseORM[Category]):
    def __init__(self, async_session: AsyncSession):
        super().__init__(async_session=async_session, model=Category)

    async def filter(self, **kwargs):
        category_alias = aliased(Category)
        subcategories_cte = (
            select(Category).filter_by(**kwargs)
            .cte(name="subcategories", recursive=True)
        )
        subcategories_cte = subcategories_cte.union_all(
            select(category_alias)
            .where(category_alias.parent_id == subcategories_cte.c.id)
        )
        result = await self.async_session.execute(
            select(subcategories_cte)
        )
        subcategories = result.fetchall()
        columns = result.keys()
        subcategories_data = [
            dict(zip(columns, row)) for row in subcategories
        ]
        return subcategories_data

    async def all(self):
        categories_list = []
        query = await self.async_session.execute(
            select(Category).filter_by(parent_id=None)
        )
        categories = query.scalars().all()
        for category in categories:
            category_alias = aliased(Category)
            subcategories_cte = (
                select(Category).filter_by(id=category.id)
                .cte(name="subcategories", recursive=True)
            )
            subcategories_cte = subcategories_cte.union(
                select(category_alias)
                .where(category_alias.parent_id == subcategories_cte.c.id)
            )
            result = await self.async_session.execute(
                select(subcategories_cte)
            )
            subcategories = result.fetchall()
            columns = result.keys()
            subcategories_data = [
                dict(zip(columns, row)) for row in subcategories
            ]
            categories_list.append(
                {
                    **CategoryModel.from_orm(category).dict(),
                    'subcategories': subcategories_data
                }
            )

        return categories_list


class ProductOptionsORM(BaseORM[BaseProductOptions]):
    def __init__(self, async_session: AsyncSession, model):
        super().__init__(async_session=async_session, model=model)

    async def get_ids_by_list(self, param: list):
        result = await self.async_session.execute(
            select(self.model.id).filter(self.model.name.in_(param))
        )
        return result.scalars().all()
