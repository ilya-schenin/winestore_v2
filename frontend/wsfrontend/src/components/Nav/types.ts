export type RangeFilterType = {
    min_value: number,
    max_value: number
}


export type FiltersType = {
    price?: RangeFilterType,
    country?: string[]
    sugar?: boolean,
    colorWine?: boolean,
    colorBeer?: boolean,
    strength?: RangeFilterType

}