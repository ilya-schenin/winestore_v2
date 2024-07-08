import axios, { AxiosError, AxiosResponse } from "axios";
import { Product } from "./interfaces";


type getProductsByCategoryProps = {
    category: string,
    setProducts: React.Dispatch<React.SetStateAction<Product[] | null>>,
    setErrors: React.Dispatch<React.SetStateAction<string | null>>,
    setLoading:  React.Dispatch<React.SetStateAction<boolean>>
}

export const getProductsByCategory = async ({
    category,
    setErrors,
    setProducts,
    setLoading
}: getProductsByCategoryProps): Promise<void> => {
    await axios.get('http://localhost:8003/shop/products_by_category/' + category)
        .then((r: AxiosResponse<Product[]>) => {
            setProducts(r.data);
            setLoading(false);
        })
        .catch((e: AxiosError) => {
            setErrors(e.message);
            setLoading(false);
        });
};