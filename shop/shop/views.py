import re
from typing import Optional, List

from fastapi.security import HTTPBearer
from pydantic import BaseModel, conlist, Field, field_validator

from shop.db import get_db
from shop.models import Product
from shop.orm.orm import ProductORM, CategoryOrm
from fastapi import APIRouter, Depends, Query, HTTPException
from settings import get_cache
from sqlalchemy.ext.asyncio import AsyncSession
from shop.shemas import ProductModel, CategoryModel, RangeFilter, CountryModel
from shop.utils.product_filter import ItemFilterManager
from shop.utils.utils import (
    get_or_cache_all_products,
    get_or_cache_category_detail,
    get_or_cache_all_categories,
    get_or_cache_products_by_category,
    get_or_cache_product_minmax,
    get_or_cache_countries
)
from fastapi_pagination import Page, add_pagination, paginate


http_bearer = HTTPBearer(auto_error=False)
router = APIRouter(prefix='/shop', dependencies=[Depends(http_bearer)])

TIME_DAY = 86400


@router.get('/products_all/', response_model=Page[ProductModel])
async def all_products(async_session: AsyncSession = Depends(get_db)):
    # cache = get_cache()
    p_orm = ProductORM(async_session)
    p = await p_orm.all()
    # products = await get_or_cache_all_products(
    #     cache=cache,
    #     async_session=async_session
    # )
    return paginate(p)


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


@router.get('/products_by_category/{category_slug}', response_model=Page[ProductModel])
async def products_by_category(category_slug: str, async_session: AsyncSession = Depends(get_db)):
    cache = get_cache()
    categories = await get_or_cache_category_detail(
        cache=cache,
        category_slug=category_slug,
        async_session=async_session
    )
    # products = await get_or_cache_products_by_category(
    #     cache=cache,
    #     category_slug=category_slug,
    #     async_session=async_session,
    #     categories=categories
    # )
    porm = ProductORM(async_session=async_session)
    products = await porm.filter_in_category(categories)
    return paginate(products)


@router.get('/product_detail/{product_slug}', response_model=ProductModel)
async def product_detail(product_slug: str, async_session: AsyncSession = Depends(get_db)):
    product_orm = ProductORM(async_session)
    product = await product_orm.get(slug=product_slug)
    return product


class ProductFilter(BaseModel):
    price: Optional[list[float | int]] = None
    strength: Optional[list[float | int]] = None
    category: Optional[str] = None
    country: Optional[list[str]] = None
    sugar: Optional[list[str]] = None
    color_vine: Optional[list[str]] = None
    color_beer: Optional[list[str]] = None
    sort: Optional[str] = None


def parse_query_param(param: Optional[str]) -> Optional[List[str]]:
    if param is None:
        return None
    return re.split(r'\s*,\s*', param.strip('"'))


@router.get('/products_filter/', response_model=Page[ProductModel])
async def products_filter(
        price: Optional[str] = Query(None),
        strength: Optional[str] = Query(None),
        category: Optional[str] = Query(None),
        country: Optional[str] = Query(None),
        sugar: Optional[str] = Query(None),
        color_vine: Optional[str] = Query(None),
        color_beer: Optional[str] = Query(None),
        sort: Optional[str] = Query('npp'),
        async_session: AsyncSession = Depends(get_db)
):
    filters = ProductFilter(
        price=parse_query_param(price),
        strength=parse_query_param(strength),
        category=category,
        country=parse_query_param(country),
        sugar=parse_query_param(sugar),
        sort=sort,
        color_vine=parse_query_param(color_vine),
        color_beer=parse_query_param(color_beer)
    )
    filter_manager = ItemFilterManager()
    filter_dict = filters.dict(exclude_unset=True)
    result = await filter_manager.apply_filters(filter_dict, async_session)
    return paginate(result)


@router.get('/price_filter/{category_slug}', response_model=RangeFilter)
async def price_filter(category_slug: str, async_session=Depends(get_db)):
    prices = await get_or_cache_product_minmax(category_slug, async_session, Product.price)
    return {
        'min_value': prices[0],
        'max_value': prices[1]
    }


@router.get('/strength_filter/{category_slug}', response_model=RangeFilter)
async def price_filter(category_slug: str, async_session=Depends(get_db)):
    strenght = await get_or_cache_product_minmax(category_slug, async_session, Product.strenght)
    return {
        'min_value': strenght[0],
        'max_value': strenght[1]
    }


@router.get('/country_filter/{category_slug}', response_model=list[str])
async def country_filter(category_slug: str, async_session=Depends(get_db)):
    countries = await get_or_cache_countries(category_slug, async_session)
    return [item for item in countries]


