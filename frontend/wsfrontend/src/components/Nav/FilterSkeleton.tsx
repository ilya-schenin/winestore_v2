import React from "react";
import styles from './Filter.module.css';
import cn from 'classnames';

type NavProps = {
    size: 's' | 'm' | 'l'
}

const matrixS = ['m', 's', 'm', 'm', 'l'];
const matrixM = ['m', 's', 'm', 'l', 'l', 'm', 's', 'l'];
const matrixL = ['m', 'm', 'm', 'l', 'l', 's', 'm', 's', 'l', 'l', 'm'];


export const FilterSkeleton: React.FC<NavProps> = ({ size }) => {
    switch (size) {
        case 's':
            return (
                <div className={styles.FilterSkeleton}>
                    <div className={styles.skeletoTitle} />
                        {matrixS.map((size, key) => (
                            <div key={key} className={cn(styles.skeletonTitle, styles[size])} />
                        ))}
                </div>
            );
        case "m":
            return (
                <div className={styles.FilterSkeleton}>
                    <div className={styles.skeletoTitle} />
                    {matrixM.map((size, key) => (
                        <div key={key} className={cn(styles.skeletonTitle, styles[size])} />
                    ))}
                </div>
            );
        case "l":
            return (
                <div className={styles.FilterSkeleton}>
                    <div className={styles.skeletoTitle} />
                    {matrixL.map((size, key) => (
                        <div key={key} className={cn(styles.skeletonTitle, styles[size])} />
                    ))}
                </div>
            );
    }
};