from typing import Optional, List

from pydantic import BaseModel


class Category(BaseModel):
    id: str
    parent_id: Optional[str]
    name: str
    slug: str
    npp: int

    class Config:
        from_attributes = True


class CategoryModel(Category):
    subcategories: list[Category] = []


class BaseOption(BaseModel):
    name: str

    class Config:
        from_attributes = True


class ColorVineModel(BaseOption):
    pass


class ColorBeerModel(BaseOption):
    pass


class SugarModel(BaseOption):
    pass


class CountryModel(BaseOption):
    pass


class ProductModel(BaseModel):
    id: str
    volume: float
    price: float
    npp: int
    name: str
    slug: str
    description: str
    strenght: float
    color_vine: Optional[ColorVineModel] | str
    color_beer: Optional[ColorBeerModel] | str
    category: Optional[CountryModel] | str
    sugar: Optional[SugarModel] | str
    country: Optional[CountryModel] | str

    class Config:
        from_attributes = True


class ItemFilter(BaseModel):
    category: Optional[str] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    country: Optional[List[str]] = None
    sugar: Optional[List[str]] = None
    color_vine: Optional[List[str]] = None
    color_beer: Optional[List[str]] = None
    strength: Optional[List[float]] = None
