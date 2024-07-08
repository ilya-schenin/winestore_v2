import React, { ButtonHTMLAttributes } from "react";
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    title: string,
    typeOf: 'primary' | 'ghost'
}

export const Button: React.FC<ButtonProps> = ({title, typeOf, ...props}) => {
    switch (typeOf) {
        case 'primary':
            return (
                <button className={styles.Primary} {...props}>{title}</button>
            )            
        case "ghost":
            return (
                <button className={styles.Ghost} {...props}>{title}</button>
            )           
    
        default:
            return (
                <button className={styles.Primary} {...props}>{title}</button>
            ) 
    }
}