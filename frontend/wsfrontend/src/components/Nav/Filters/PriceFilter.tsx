"use client";

import React, { useState } from "react";
import styles from '../Filter.module.css';
import { Slider } from "@mui/material";


export const PriceFilter: React.FC = () => {
    const [value, setValue] = useState<number[]>([0, 100]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
    };

    return (
        <div className={styles.filter}>
            <h2>Цена</h2>
            <Slider
                value={value}
                onChange={handleChange}
                min={0}
                max={100}
                sx={{
                    width: 'calc(100% - 20px)',
                    color: 'primary.main',
                    '& .MuiSlider-thumb': {
                      backgroundColor: 'var(--primary-dark)',
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: 'var(--primary)',
                      border: 'none',
                      height: '10px'
                    },
                    marginLeft: '10px'
                  }}
            />
            <div className={styles.detail}>
                От: {value[0]} руб до: {value[1]} руб
            </div>
        </div>
    );
};