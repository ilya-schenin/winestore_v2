import axios, { AxiosError, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { Cart } from "./interfaces";
import { AppDispatch } from "../../redux-toolkit/store";
import { add, remove } from "../../redux-toolkit/slices/cartSlice";


interface AddToCartProps {
    product_id: string,
    quantity: number,
    action: 'add' | 'remove',
    dispatch: AppDispatch ,
    setErrors: React.Dispatch<React.SetStateAction<null | string>>,
    setQuantity: React.Dispatch<React.SetStateAction<number>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const getStorageCart = (): Cart[] => {
    const cartString = localStorage.getItem('cart');
    if (cartString) {
        try {
            return JSON.parse(cartString);
        } catch (error) {
            return [];
        }
    }
    return [];
};

export const getUserCart = async ( setCart: React.Dispatch<React.SetStateAction<Cart[] | null>>) => {
    const access_token = Cookies.get('access_token');
    if (!access_token) {
        setCart(getStorageCart());
        return;
    }
    await axios.get('http://localhost:8002/cart/user-cart/', {
        withCredentials: true,
        headers: {
            'Authorization': Cookies.get('access_token')
        }
    })
        .then((r: AxiosResponse<Cart[]>) => setCart(r.data)
        
        )
        .catch( () => {

        });
};


const updateServerCart = async (
    url: string,
    access_token: string,
    newQuantity: number,
    action: 'add' | 'remove',
    dispatch: AppDispatch,
    setQuantity: React.Dispatch<React.SetStateAction<number>>,
    setErrors: React.Dispatch<React.SetStateAction<null | string>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    await axios.post(url, {}, {
        withCredentials: true,
        headers: { 'Authorization': access_token }
    })
    .then(() => {
        setQuantity(newQuantity);
        dispatch(action === 'add' ? add() : remove());
    })
    .catch((e: AxiosError) => {
        setErrors(e.message);
    })
    .finally(() => {
        setLoading(false);
    });
};

const updateLocalStorageCart = (
    product_id: string,
    newQuantity: number, 
    action: 'add' | 'remove', 
    dispatch: AppDispatch
) => {
    const cart: Cart[] = getStorageCart();
    const index: number = cart.findIndex((i: Cart) => i.product_id === product_id);

    if (index !== -1) {
        cart[index].quantity = newQuantity;
    } else {
        cart.push({ product_id, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    dispatch(action === 'add' ? add() : remove());
};

export const updateCart = async ({
    product_id,
    quantity,
    action,
    dispatch,
    setErrors,
    setQuantity,
    setLoading
}: AddToCartProps) => {
    
    if (action === 'remove' && quantity === 0) return;

    setLoading(true);
    
    const newQuantity = action === 'add' ? quantity + 1 : quantity - 1;
    const access_token = Cookies.get('access_token');

    if (!access_token) {
        updateLocalStorageCart(product_id, newQuantity, action, dispatch);
        setQuantity(newQuantity);
        setLoading(false);
        return;
    }

    const url = action === 'add'
        ? `http://localhost:8002/cart/add-to-cart/${product_id}`
        : `http://localhost:8002/cart/remove-to-cart/${product_id};`;

    await updateServerCart(
        url, 
        access_token, 
        newQuantity, 
        action, 
        dispatch, 
        setQuantity, 
        setErrors, 
        setLoading
    );
};