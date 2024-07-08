"use client";

import React, { useEffect, useState } from "react";
import styles from './Header.module.css';
import Image from "next/image";
import logo from '../../../public/media/logo.svg';
import { Search } from "./Search/Search";
import { HeaderButton, HeaderButtonCart } from "./HeaderButtons/HeaderButtons";
import account from '../../../public/media/account.svg';
import location from '../../../public/media/location.svg';
import login from '../../../public/media/login.svg';
import logout from '../../../public/media/logout.svg';
import { Category, User } from "@/api/interfaces";
import { getCategoriesAll } from "@/api/categories";
import Link from "next/link";
import { useAppDispatch } from '../../../redux-toolkit/hooks';
import { toggleModal } from "../../../redux-toolkit/slices/authSlice";
import { getCurrentUser, logoutUser } from "@/api/auth";
import cn from 'classnames';

const orderCats = {
    'Безалкогольные напитки': '4',
    'Вино': '0',
    'Крепкие напитки': '1',
    'Пиво': '2',
    'Продукты': '3',
    'Промтовары': '5'
};

interface CategoryLinkProps {
    category: Category
}

interface SubmenuProps {
    categories: Category[],
    toggleDropdown: boolean
}

const CategoryLink: React.FC<CategoryLinkProps> = ({ category }) => (
    <div key={category.slug} className={styles.categoryLink}>
        <Link href={'/categories/' + category.slug}>{category.name}</Link>
    </div>
);

const Submenu: React.FC<SubmenuProps> = ({ categories, toggleDropdown }) => (
    <div className={cn(styles.submenu, {
        [styles.submenuActive]: toggleDropdown
    })}>
        {categories.map((category, key) => (
            <div className={styles.column} key={key} style={{ order: orderCats[category.name] }}>
                <h3>{category.name}</h3>
                <ul>
                    {category?.subcategories?.map((subcategory, key) => (
                        <li key={key}>
                            <Link href={'/categories/' + subcategory.slug}>{subcategory.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        ))}
    </div>
);


export const Header: React.FC =  () => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const handleClick = () => {
        if (!user) {
            dispatch(toggleModal());
        }
    };

    useEffect(() => {
        getCategoriesAll(setCategories);
        getCurrentUser(setUser);
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.topSection}>
                <div className={styles.Logo}>
                    <Image alt='logo' src={logo}/>
                </div>
                <div className={styles.Search}>
                    <Search />
                </div>
                <div className={styles.HeaderButtons}>
                    <HeaderButton image={location} title="Магазины"/>
                    {user &&
                        <HeaderButton 
                            image={logout}
                            title={'Выйти'}
                            onClick={logoutUser}
                        />
                    }
                    {user ?                     
                        <HeaderButton 
                            image={account} 
                            title={user.first_name} 
                            link={'/account'}
                        /> :
                        <HeaderButton 
                            image={login} 
                            title={'Вход'} 
                            onClick={handleClick}
                        />
                    }
                    <HeaderButtonCart />
                </div>
            </div>
            <div className={styles.bottomSection}>
                <div 
                    className={cn(styles.dropdownButton, {
                        [styles.bottomButtonActive]: toggleDropdown
                    })} 
                    onClick={() => setToggleDropdown(!toggleDropdown)}
                >
                    <div className={styles.burgerIcon}>
                        <div className={styles.line}></div>
                        <div className={styles.line}></div>
                        <div className={styles.line}></div>
                    </div>
                    <div className={styles.dropdownTitle}>Каталог</div>
                </div>
                <div className={cn(styles.dropdownLabel, {
                    [styles.bottomRightActive]: toggleDropdown
                })}>
                    {categories.map(item => (
                        <CategoryLink key={item.slug} category={item} />
                    ))}
                </div>
            </div>
            <Submenu categories={categories} toggleDropdown={toggleDropdown} />
        </header>
    );
};