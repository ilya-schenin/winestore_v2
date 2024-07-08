import React from "react";
import styles from './Nav.module.css';
import { FilterSkeleton } from "./FilterSkeleton";


export const Nav: React.FC = () => {
    return (
        <div className={styles.nav}>
            <div className={styles.navBody}>
                <FilterSkeleton size={'s'} />
                <FilterSkeleton size={'m'} />
                <FilterSkeleton size={'l'} />
            </div>
        </div>
    );
};