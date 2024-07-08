import { Category } from "./interfaces";
import axios from "axios";


export async function getCategoriesAll(
    setState: React.Dispatch<React.SetStateAction<Category[]>>
): Promise<void> {
    try {
        const response = await axios.get('http://localhost:8003/shop/all_categories/');
        const categories: Category[] = response.data;
        setState(categories);
    } catch (error) {
        console.error(error);
        setState([]);
    }
}