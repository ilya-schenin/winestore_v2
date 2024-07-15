"use client";

import React, { useRef } from "react";
import styles from '../Filter.module.css';

type ListFilterProps = {
    items: string[],
    title: string,
    filterKey: string,
    handleSelected: (key: string, value: string[] | number[]) => void
}
export const ListFilter: React.FC<ListFilterProps> = ({ items, title, filterKey, handleSelected}) => {
    const selectedItems = useRef<string[]>([]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;

        checked ? (selectedItems.current = [...selectedItems.current, value]) : (
            selectedItems.current = selectedItems.current.filter(i => i !== value)
        );
        
        handleSelected(filterKey, selectedItems.current);

    };
    
    return (
        <div className={styles.filter}>
            <h2>{title}</h2>
            <form action="." className={styles.formFilter}>
                {items.map((item: string) => (
                    <label key={item} style={{display:'block', alignItems:'center'}}>
                        <input type="checkbox" value={item} onChange={handleCheckboxChange} /> {item}
                    </label>
                ))}
            </form>
        </div>
    );
};