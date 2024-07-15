"use client";

import React, { useEffect, useState } from "react";
import styles from './Products.module.css';
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { Product, ProductResponse } from "@/api/interfaces";
import { ProductCard } from "./ProductCard";
import { getProducts } from "@/api/products";
import { Cart } from "@/api/interfaces";
import { getUserCart } from "@/api/cart";
import { useDispatch } from "react-redux";
import { setQuantity } from "../../../redux-toolkit/slices/cartSlice";
import { useSearchParams } from "next/navigation";
import { setTotalQuantity } from "../../../redux-toolkit/slices/labelSlice";
import { AnimatePresence, motion } from "framer-motion";
import  Pagination  from "../Pagination/Pagination";

type ProductsProps = {
    category: string
}

export const Products: React.FC<ProductsProps> = ({category}) => {

    const [products, setProducts] = useState<null | ProductResponse>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setErrors] = useState<string | null>(null);
    const [cart, setCart] = useState<Cart[] | null>([]);
    const searchParams = useSearchParams();

    const dispatch = useDispatch();
    
    useEffect(() => {
        searchParams.size >= 1 && getProducts({
            searchParams, setProducts, setErrors, setLoading
        });      
        category && searchParams.size == 0  && getProducts({ 
            category, setProducts, setErrors, setLoading 
        });
    }, [category, searchParams]);

    useEffect(() => {
        getUserCart(setCart);
        dispatch(
            setTotalQuantity({total: products?.total})
        );
    }, [products, dispatch]);

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

    if (products && products.items.length > 0) {
        return (
            <>
                <AnimatePresence>
                    <div className={styles.products}>
                        { products.items.map((item: Product) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ProductCard product={item} cart={cart} />
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
                <Pagination total={products.pages} />
            </>
        );
    }

    return (
        <div className={styles.products} >Ничего не найдено...</div>
    );

};