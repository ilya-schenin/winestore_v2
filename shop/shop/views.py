from typing import Optional, List

from fastapi.security import HTTPBearer
from pydantic import BaseModel, conlist, Field

from shop.db import get_db
from shop.models import Product
from shop.orm.orm import ProductORM, CategoryOrm
from fastapi import APIRouter, Depends, Query, HTTPException
from settings import get_cache
from sqlalchemy.ext.asyncio import AsyncSession
from shop.shemas import ProductModel, CategoryModel
from shop.utils.product_filter import ItemFilterManager
from shop.utils.utils import (
    get_or_cache_all_products,
    get_or_cache_category_detail,
    get_or_cache_all_categories,
    get_or_cache_products_by_category
)
from fastapi_pagination import Page, add_pagination, paginate


http_bearer = HTTPBearer(auto_error=False)
router = APIRouter(prefix='/shop', dependencies=[Depends(http_bearer)])

TIME_DAY = 86400


@router.get('/products_all/', response_model=Page[ProductModel])
async def all_products(async_session: AsyncSession = Depends(get_db)):
    cache = get_cache()
    products = await get_or_cache_all_products(
        cache=cache,
        async_session=async_session
    )
    return paginate(products)


# @router.get('/categories_detail/{category_slug}', response_model=list[CategoryModel])
# async def subcategories_by_category(
#         category_slug: str,
#         async_session: AsyncSession = Depends(get_db)
# ):
#     cache = get_cache()
#     categories_detail = await get_or_cache_category_detail(
#         cache=cache,
#         key='subcategories_by_' + category_slug,
#         async_session=async_session
#     )
#     return categories_detail


@router.get('/all_categories/', response_model=list[CategoryModel])
async def all_categories(async_session: AsyncSession = Depends(get_db)):
    cache = get_cache()
    categories_all = await get_or_cache_all_categories(
        cache,
        async_session=async_session
    )
    return categories_all


@router.get('/products_by_category/{category_slug}', response_model=list[ProductModel])
async def products_by_category(category_slug: str, async_session: AsyncSession = Depends(get_db)):
    cache = get_cache()
    categories = await get_or_cache_category_detail(
        cache=cache,
        category_slug=category_slug,
        async_session=async_session
    )
    products = await get_or_cache_products_by_category(
        cache=cache,
        category_slug=category_slug,
        async_session=async_session,
        categories=categories
    )
    return products


@router.get('/product_detail/{product_slug}', response_model=ProductModel)
async def product_detail(product_slug: str, async_session: AsyncSession = Depends(get_db)):
    product_orm = ProductORM(async_session)
    product = await product_orm.get(slug=product_slug)
    return product


class ProductFilter(BaseModel):
    category: Optional[str] = None
    price_min: Optional[float] = Query(None, description="Minimum price")
    price_max: Optional[float] = Query(None, description="Maximum price")
    country: Optional[List[str]] = None
    sugar: Optional[List[str]] = None
    color_vine: Optional[List[str]] = None
    color_beer: Optional[List[str]] = None
    strength: Optional[List[float]] = None


@router.post('/products_filter/', response_model=Page[ProductModel])
async def products_filter(
        filters: ProductFilter,
        async_session: AsyncSession = Depends(get_db)
):
    filter_manager = ItemFilterManager()
    filter_dict = filters.dict()
    result = await filter_manager.apply_filters(filter_dict, async_session)
    print([ProductModel.from_orm(row).dict() for row in result])
    return paginate([ProductModel.from_orm(row).dict() for row in result])


