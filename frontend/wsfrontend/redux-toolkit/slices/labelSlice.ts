import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '@/api/interfaces';

interface LabelInitial {
    categories?: Category[] | null,
    total?: number | null
}

const initialState: LabelInitial = {
    total: null,
    categories: null
};

const labelSlice = createSlice({
    name: 'infoLabel',
    initialState,
    reducers: {
        setTotalQuantity: (state, action: PayloadAction<LabelInitial>) => {
            state.total = action.payload.total;
        },
        setLabelCategories: (state, action: PayloadAction<LabelInitial>) => {
            state.categories = action.payload.categories;
        }
    }
});

export const { setTotalQuantity, setLabelCategories } = labelSlice.actions;
export default labelSlice.reducer;