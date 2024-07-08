import React from "react";
import styles from './Products.module.css';
import Image from "next/image";
import { Cart, Product } from "@/api/interfaces";
import { AddToCartButton } from "./AddToCartButton";


interface ProductCardProps {
    product: Product,
    cart: Cart[] | null
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, cart }) => {
    return (
        <div className={styles.productCard}>
            <div className={styles.productCardBody}>
                <div className="productCardImage">
                    <Image alt={product.name} src={'/' + product.slug} width={200} height={200} />
                </div>
                <div className={styles.productTitle}>{product.name}</div>
                <div className={styles.productCategory}>{product.category.name}</div>
                <div className={styles.productPrice}>{product.price}</div>
                <AddToCartButton product={product} cart={cart}/>
            </div>
        </div>
    );
}; 