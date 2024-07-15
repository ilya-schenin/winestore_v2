import axios, { AxiosError, AxiosResponse } from "axios";
import { FiltersEnum } from "@/components/Nav/Nav";
import { FiltersType } from "@/components/Nav/types";

// export const getAllowedFilters = async (category: string) => {
//     await axios.get('http://localhost:8003//')
// }


export const getPriceFilter = async (category: string) => {
    return await axios.get('http://localhost:8003/shop/price_filter/' + category)
        .then((r: AxiosResponse) => r.data);
};

export const getCountryFilter = async (category: string) => {
    return await axios.get('http://localhost:8003/shop/country_filter/' + category)
        .then((r: AxiosResponse) => r.data);
};

export const getStrengthFilter = async (category: string) => {
    return await axios.get('http://localhost:8003/shop/strength_filter/' + category)
        .then((r: AxiosResponse) => r.data);
};


type SetFiltersType = React.Dispatch<React.SetStateAction<FiltersType>>


export const getFilters = async (allowedFilters: string[], category: string,  setFilters: SetFiltersType) => {
    const filters: FiltersType = {};

    allowedFilters.includes('Цена') && await getPriceFilter(category).then(
        response => filters.price = response
    );

    allowedFilters.includes('Страна') && await getCountryFilter(category).then(
        response => filters.country = response
    );

    allowedFilters.includes('Крепость') && await getStrengthFilter(category).then(
        response => filters.strength = response
    );

    allowedFilters.includes('Сахар') && (filters.sugar = true);
    allowedFilters.includes('ЦветВино') && (filters.colorWine = true);
    allowedFilters.includes('ЦветПиво') && (filters.colorBeer = true);

    setFilters(filters);
};