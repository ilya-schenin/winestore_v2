import React from "react";
import styles from './Products.module.css';
import cn from 'classnames';

export const ProductCardSkeleton: React.FC = () => {
    return (
        <div className={styles.productCard} style={{border: 'none'}}>
            <div className={styles.productCardBody}>
                <div className={cn(styles.skeletonImage, styles.skeletonItem)} />
                <div className={cn(styles.skeletonTitle, styles.skeletonItem)} />
                <div className={cn(styles.skeletonSubTitle, styles.skeletonItem)} />
                <div className={cn(styles.skeletonPrice, styles.skeletonItem)} />
                <div className={cn(styles.skeletonButton, styles.skeletonItem)} />
            </div>
        </div>
    );
};