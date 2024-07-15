"use client";

import React, { useEffect, useState } from "react";
import styles from '../Filter.module.css';
import { RangeFilterType } from "../types";
import { RangeSlider } from "../RangeSlider";


type RangeFilterProps = {
    range: RangeFilterType,
    title: string,
    unit: string
}

export const RangeFilter: React.FC<RangeFilterProps> = ({range, title, unit}) => {
    const [value, setValue] = useState<number[]>([0, 100]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
    };

    useEffect(() => {
        setValue([range.min_value, range.max_value]);
    }, [range]);

    return (
        <div className={styles.filter}>
            <h2>{title}</h2>
            <RangeSlider value={value} min={range.min_value} max={range.max_value} onChange={handleChange} />
            <div className={styles.detail}>
                От: {value[0]} {unit} до: {value[1]} {unit}
            </div>
        </div>
    );
};