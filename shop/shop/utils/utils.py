from fastapi.security import HTTPBearer
from starlette import status

from shop.db import get_db
from shop.models import Product, Category, Country
from shop.orm.orm import ProductORM, CategoryOrm
from fastapi import APIRouter, Depends
from settings import get_cache
from sqlalchemy.ext.asyncio import AsyncSession
from shop.shemas import ProductModel, CategoryModel
from sqlalchemy import select, func
from fastapi import HTTPException

TIME_DAY = 86400


async def get_or_cache_all_products(cache, async_session: AsyncSession):
    cached_products = await cache.get("all_products")
    if cached_products is None:
        product_orm = ProductORM(async_session)
        products = await product_orm.all()
        serialized = [
            ProductModel.from_orm(product).dict() for product in products
        ]
        await cache.set('all_products', serialized, ttl=TIME_DAY)
        return products
    return cached_products


async def get_or_cache_category_detail(cache, category_slug: str, async_session: AsyncSession):
    cached_category_detail = await cache.get(
        'categories_detail' + category_slug
    )
    if cached_category_detail is None:
        category_orm = CategoryOrm(
            async_session=async_session
        )
        categories = await category_orm.filter(slug=category_slug)
        await cache.set(
            'categories_detail' + category_slug,
            categories,
            ttl=TIME_DAY
        )
        return categories
    return cached_category_detail


async def get_or_cache_all_categories(cache, async_session: AsyncSession):
    categories_all = await cache.get('categories_all')
    if categories_all is None:
        category_orm = CategoryOrm(
            async_session=async_session
        )
        categories = await category_orm.all()
        await cache.set(
            'categories_all',
            categories,
            ttl=TIME_DAY
        )
        return categories
    return categories_all


async def get_or_cache_products_by_category(
        cache,
        category_slug: str,
        async_session: AsyncSession,
        categories: list[CategoryModel]
):
    cached_products_category = await cache.get(
        'cached_products_by' + category_slug
    )
    if cached_products_category is None:
        product_orm = ProductORM(async_session)
        products = await product_orm.filter_in_category(
            categories
        )
        await cache.set(
            'cached_products_by' + category_slug,
            products,
            ttl=TIME_DAY
        )
        return products
    return cached_products_category


async def _get_categories_id(async_session, category_slug):
    category_orm = CategoryOrm(async_session=async_session)
    categories_data = await category_orm.filter(
        slug=category_slug
    )
    categories_id = [
        item['id'] for item in categories_data
    ]
    return categories_id


async def get_or_cache_product_minmax(category_slug: str, async_session: AsyncSession, field: Product):
    categories_id = await _get_categories_id(async_session, category_slug)
    if len(categories_id) != 0:
        query = select(
            func.min(field), func.max(field)
        ).filter(
            Product.category_id.in_(categories_id)
        )
        result = await async_session.execute(query)
        return result.one()
    if category_slug == '/':
        query = select(
            func.min(field), func.max(field)
        )
        result = await async_session.execute(query)
        return result.one()

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail='invalid category'
    )


async def get_or_cache_countries(category_slug: str, async_session: AsyncSession):
    categories_id = await _get_categories_id(
        async_session, category_slug
    )
    query = (
        select(Country.name)
        .join(Product, Product.country_id == Country.id)
        .where(Product.category_id.in_(categories_id)).distinct()
    )
    result = await async_session.execute(query)
    return result.scalars().all()

