import React from "react";
import { Slider } from "@mui/material";

type RangeSliderProps = {
    value: number[],
    onChange: (event: Event, value: number | number[]) => void,
    min: number,
    max: number
}
export const RangeSlider: React.FC<RangeSliderProps> = ({ value, min, max, onChange}) => (
    <Slider
        value={value}
        onChange={onChange}
        min={min}
        max={max}
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
);