interface BaseCategory {
    name: string,
    slug: string
}

export interface Category extends BaseCategory {
    subcategories: BaseCategory[]
}

export interface User {
    email: string,
    first_name: string,
    last_name: string
}

export interface ResponseStatus {
    statusCode: number,
    message: string 
}

export interface TokenInfo {
    access_token: string,
    refresh_token: string,
    token_type: string
}


interface ProductRelation {
    name: string | null
}

interface Image {
    img: string,
    npp: number
}

export interface Product {
    id: string,
    category: ProductRelation,
    name: string,
    slug: string,
    country: ProductRelation,
    volume: string | number | null,
    color_vine: ProductRelation,
    color_beer: ProductRelation,
    sugar: ProductRelation,
    description: string,
    price: string | number,
    strenght: string | number,
    npp: number,
    images: Image[],
    min_price: string | number,
    min_old_price: string | number
}

export interface Cart {
    product_id: string,
    quantity: number
}