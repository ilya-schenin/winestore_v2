"use client";

import React, { useState } from "react";
import styles from '../Filter.module.css';

const countries = [
    "Испания",
    "Италия",
    "Россия",
    "Австрия",
    "Германия",
    "Новая Зеландия",
    "Франция",
    "Армения",
    "Китай",
    "Южная Африка",
    "Венгрия",
    "Грузия",
    "Португалия",
    "Чили",
    "Азербайджан",
    "Австралия",
    "Соединенные Штаты",
    "Аргентина",
    "Абхазия"
  ];
  
export const CountryFilter: React.FC = () => {
    return (
        <div className={styles.filter}>
            <h2>Регион</h2>
            <form action=".">
                {countries.map(item => (
                    <input key={item} type="checkbox" />
            
                ))}
            </form>
        </div>
    );
};