from fastapi.security import HTTPBearer
from shop.db import get_db
from shop.orm.orm import ProductORM, CategoryOrm
from fastapi import APIRouter, Depends
from settings import get_cache
from sqlalchemy.ext.asyncio import AsyncSession
from shop.shemas import ProductModel, CategoryModel


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

