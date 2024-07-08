"use client";

import React, { useEffect, useState } from "react";
import styles from './Products.module.css';
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { Product } from "@/api/interfaces";
import { ProductCard } from "./ProductCard";
import { getProductsByCategory } from "@/api/products";
import { Cart } from "@/api/interfaces";
import { getUserCart } from "@/api/cart";
import { useDispatch } from "react-redux";
import { setQuantity } from "../../../redux-toolkit/slices/cartSlice";


type ProductsProps = {
    category: string
}

export const Products: React.FC<ProductsProps> = ({category}) => {

    const [products, setProducts] = useState<null | Product[]>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setErrors] = useState<string | null>(null);
    const [cart, setCart] = useState<Cart[] | null>([]);

    const dispatch = useDispatch();
    
    useEffect(() => {
        getProductsByCategory({ category, setProducts, setErrors, setLoading });                
    }, [category]);

    useEffect(() => {
        getUserCart(setCart);
    }, [products]);

    useEffect(() => {        
        cart?.length && dispatch(setQuantity(cart.reduce(
            (previousValue: number, currentValue: Cart) => previousValue + currentValue.quantity, 0)
        ));
    }, [cart, dispatch]);

    if (loading) {
        return (
            <div className={styles.products}>
                {new Array(20).fill(null).map((i, key) => (
                    <ProductCardSkeleton key={key} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.products}>{error}</div>
        );
    }

    if (products && products.length > 0) {
        return (
            <div className={styles.products}>
                { products.map((item: Product, index) => (
                    <ProductCard product={item} key={index} cart={cart} />
                ))}
            </div>
        );
    }

    return (
        <div className={styles.products} >Ничего не найдено...</div>
    );

};