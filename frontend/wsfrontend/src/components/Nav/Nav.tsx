"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from './Nav.module.css';
import { FilterSkeleton } from "./FilterSkeleton";
import { RangeFilter } from "./Filters/RangeFilter";
import { ListFilter } from "./Filters/ListFilter";
import { getFilters } from "@/api/filters";
import { FiltersType } from "./types";
import { Button } from "../Button/Button";
import { colorWine, colorBeer, sugar } from "./Filters/consts";
import { usePathname, useRouter } from "next/navigation";

export enum FiltersEnum {
    'Цена',
    'Страна',
    'Сахар',
    'ЦветВино',
    'Крепость'
}

export type AllowedFiltersType = keyof typeof FiltersEnum;

export type SelectedFilters = {
    category: string,
    price: number[],
    country: string[],
    sugar: string[],
    color_vine: string[],
    color_beer: string[],
    strength: number[],
}

type NavProps = {
    category: string,
}

const defaultSelected = {
    price: [0, 0],
    country: [],
    sugar: [],
    color_vine: [],
    color_beer: [],
    strength: [0, 0],
};

export const Nav: React.FC<NavProps> = ({ category }) => {

    const [allowedFilters, setAllowedFilters] = useState<AllowedFiltersType[]>([]);
    const [filters, setFilters] = useState<FiltersType>({});
    const selected = useRef<SelectedFilters>({...defaultSelected, category: category});
    const pathname = usePathname();
    const router = useRouter();

    const handleSelected = (key: string, value: string[] | number[]) => {
        selected.current = {...selected.current, [key]: value};        
    };

    const filterProducts = () => {
        const serialized = serializeSelected(selected.current);        
        router.push(pathname + '?' + serialized, {scroll: false});
    };

    const serializeSelected = (filters: SelectedFilters) => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            const value = filters[key as keyof SelectedFilters];
            const jsonString = JSON.stringify(value);
            if ((jsonString !== JSON.stringify([0, 0]) && jsonString !== JSON.stringify([]))) {
                params.append(key, value.toString());                
            }
        });
        return params.toString();
    };

    useEffect(() => {
        setAllowedFilters(['Цена', 'Страна', 'Сахар', 'ЦветВино', 'Крепость']);
    }, []);

    useEffect(() => {
        getFilters(allowedFilters, category, setFilters);
    }, [allowedFilters, category]);
 
    return (
        <div className={styles.nav}>
            <div className={styles.navBody}>
                {filters.price && <RangeFilter range={filters.price} title="Цена" unit="руб"/>}
                {filters.country && <ListFilter 
                    items={filters.country}
                    title="Регион"
                    filterKey="country"
                    handleSelected={handleSelected} 
                />}
                {filters.sugar && <ListFilter
                    items={sugar} 
                    title="Сахар" 
                    filterKey="sugar"
                    handleSelected={handleSelected}
                />}
                {filters.colorWine && <ListFilter 
                    items={colorWine} 
                    title="Цвет"
                    filterKey="color_vine"
                    handleSelected={handleSelected}
                />}
                {filters.colorBeer && <ListFilter 
                    items={colorBeer} 
                    title="Цвет"
                    filterKey='color_beer'
                    handleSelected={handleSelected} 
                />}
                {filters.strength && <RangeFilter range={filters.strength} title="Крепость" unit="%"/>}
                {Object.keys(filters).length == 0 &&
                    <>
                        <FilterSkeleton size={'s'} />
                        <FilterSkeleton size={'m'} />
                        <FilterSkeleton size={'l'} />
                    </>
                }
            </div>
            <Button typeOf="primary" title="Применить" onClick={filterProducts} />
        </div>
    );
};