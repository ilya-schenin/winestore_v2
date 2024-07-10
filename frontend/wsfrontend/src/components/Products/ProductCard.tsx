import React, { useState } from "react";
import styles from './Products.module.css';
import Image from "next/image";
import { Cart, Product } from "@/api/interfaces";
import { AddToCartButton } from "./AddToCartButton";


interface ProductCardProps {
    product: Product,
    cart: Cart[] | null
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, cart }) => {
    
    const [imageSrc, setImageSrc] = useState(
        product.images.length > 0 ? '/' + product.images[0].img : '/images/default.png'
    );

    const handleImageError = () => {
        setImageSrc('/images/default.png');
    };

    return (
        <div className={styles.productCard}>
            <div className={styles.productCardBody}>
                <div className="productCardImage">
                    <Image 
                        alt={product.name} 
                        src={imageSrc} 
                        width={300} 
                        height={300} 
                        onError={handleImageError} 
                    />
                </div>
                <div className={styles.productTitle}>{product.name}</div>
                <div className={styles.productCategory}>{product.category.name}</div>
                <div className={styles.productPrice}>
                    от {!product.min_old_price ?
                            <><del>{199.90}</del> {product.price} руб</> :
                            <>{product.price} руб</>
                        }
                </div>
                <AddToCartButton product={product} cart={cart} />
            </div>
        </div>
    );
}; 