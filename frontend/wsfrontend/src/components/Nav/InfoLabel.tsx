"use client";

import React from "react";
import styles from './InfoLabel.module.css';
import cn from 'classnames';
import { useSelector } from "react-redux";
import { RootState } from "../../../redux-toolkit/store";
import { Category } from "@/api/interfaces";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import { InfoLabelSkeleton } from "./InfoLabelSkeleton";


type InfoLabelProps = {
    category: string
}

type SortByType = 'top' | 'bottom' | 'name';


export const InfoLabel: React.FC<InfoLabelProps> = ({ category }) => {

    const infoLabel = useSelector((state: RootState) => state.infoLabel);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const checkSortParam = (sortType: SortByType): boolean => {
        return searchParams.has('sort', sortType);
    };

    const findCategory = () => {
        const data: Category | undefined = infoLabel.categories?.find( 
            i => i.slug == category 
        );
        return data?.name || 'Главная';
    };
    
    const handleSort = (sortBy: SortByType) => {   
        console.log(`handleSort called with sortBy: ${sortBy}`);     
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('sort', sortBy);
        router.push(
            pathname + '?' + newSearchParams, {
                scroll: false
            }
        );        
    };

    if (infoLabel.categories && infoLabel.total) {
        return (
            <div className={styles.InfoLabel}>
                <div className={styles.InfoLabelBody}>
                    <div className={styles.subtitle}>
                        <Link href={'/'}>Главная</Link>
                    </div>
                    <div className={styles.title} >
                        Категория: {findCategory()} <span>найдено {infoLabel.total} товаров</span>
                    </div>
                    <div className={styles.sortArea}>
                        Сортировать по:
                        <div className={styles.sortBlocks}>
                            <button 
                                className={cn(styles.sortButton, {
                                    [styles.active]: checkSortParam('top')
                                })} 
                                onClick={() => handleSort('top')}
                            >Цене вверх</button>
                            <button 
                                className={cn(styles.sortButton, {
                                    [styles.active]: checkSortParam('bottom')
                                })} 
                                onClick={() => handleSort('bottom')}
                            >Цене вниз</button>
                            <button 
                                className={cn(styles.sortButton, {
                                    [styles.active]: checkSortParam('name')
                                })} 
                                onClick={() => handleSort('name')}
                            >Названию</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return <InfoLabelSkeleton />;
};