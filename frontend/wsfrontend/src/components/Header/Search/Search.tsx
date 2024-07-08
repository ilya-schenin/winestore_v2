import React from "react";
import styles from './Search.module.css'
import { Input } from "@/components/Input/Input";


export const Search: React.FC = () => {
    return (
       <form action="." className={styles.searchForm}>
            <Input type="text" placeholder="Найти товар" name="search" />
            <button type="submit">Поиск</button>
       </form>
    )
}