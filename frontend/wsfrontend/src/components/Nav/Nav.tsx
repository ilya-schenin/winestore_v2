import React from "react";
import styles from './Nav.module.css';
import { FilterSkeleton } from "./FilterSkeleton";
import { PriceFilter } from "./Filters/PriceFilter";
import { CountryFilter } from "./Filters/CountryFilter";

export const Nav: React.FC = () => {
    return (
        <div className={styles.nav}>
            <div className={styles.navBody}>
                <PriceFilter />
                <CountryFilter />
                {/* <FilterSkeleton size={'s'} />
                <FilterSkeleton size={'m'} />
                <FilterSkeleton size={'l'} /> */}
            </div>
        </div>
    );
};