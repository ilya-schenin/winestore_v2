import React, { useEffect, useState } from "react";
import { Cart, Product } from "@/api/interfaces";
import styles from './Products.module.css';
import { updateCart } from "@/api/cart";
import { useDispatch } from "react-redux";

interface AddToCartButtonProps {
    product: Product,
    cart: Cart[] | null
}


export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, cart }) => {

    const [quantity, setQuantity] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<null | string>(null);
    const dispatch = useDispatch();

    const handleQuantity = (product: Product, cart: Cart[]) => {                
        const item: Cart | undefined = cart.find((i: Cart) => i.product_id === product.id);        
        item?.quantity && setQuantity(item.quantity); 
    };

    useEffect (() => {
        product && cart && handleQuantity(product, cart);
    }, [product, cart]);

    if (quantity > 0) {
        return (
            <div className={styles.AddToCartStick}>
                <div className={styles.remove} onClick={() => {
                    const product_id = product.id;
                    const action = 'remove';
                    updateCart({
                        product_id,
                        quantity,
                        action,
                        dispatch,
                        setErrors,
                        setLoading,
                        setQuantity
                    });
                }}>-</div>
                <div className={styles.quantity}>{quantity}</div>
                <div className={styles.add} onClick={() => {
                    const product_id = product.id;
                    const action = 'add';
                    updateCart({
                        product_id,
                        quantity,
                        action,
                        dispatch,
                        setErrors, 
                        setLoading, 
                        setQuantity
                    });
                }}>+</div>
            </div>
        );
    }

    return (
        <button onClick={() => {
            const product_id = product.id;
            const action = 'add';
            updateCart({
                product_id, 
                quantity, 
                action,
                dispatch, 
                setErrors, 
                setLoading, 
                setQuantity
            });
        }}>Добавить в корзину</button>
    );
};