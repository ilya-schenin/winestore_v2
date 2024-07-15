import axios, { AxiosError, AxiosResponse } from "axios";
import { ProductResponse } from "./interfaces";


interface GetProductsProps {
    category?: string;
    searchParams?: URLSearchParams;
    setProducts: React.Dispatch<React.SetStateAction<ProductResponse | null>>;
    setErrors: React.Dispatch<React.SetStateAction<string | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


export const getProducts = async ({
    category,
    searchParams,
    setProducts,
    setErrors,
    setLoading
}: GetProductsProps): Promise<void> => {

    let params;
    let url: string = '';
    setLoading(true);
    
    if (searchParams) {
        params = new URLSearchParams(searchParams.toString())
        params.set('size', '21')
    } else {
        params = new URLSearchParams()
        params.set('size', '21')
    }
    category && (
        url = `http://localhost:8003/shop/products_by_category/${category}?${params.toString()}`
    );
    searchParams && (
        url = `http://localhost:8003/shop/products_filter/?${params.toString()}`
    );

    await axios.get(url)
        .then((r: AxiosResponse<ProductResponse>) => {
            setProducts(r.data);
            setLoading(false);
        })
        .catch((e: AxiosError) => {
            setErrors(e.message);
            setLoading(false);
        });
};
