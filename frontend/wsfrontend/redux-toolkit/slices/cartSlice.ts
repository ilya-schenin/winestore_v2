import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: number = 0;

const cartSlice = createSlice({
  name: 'userCart',
  initialState,
  reducers: {
    add: (state) => state += 1,
    remove: state => state -= 1,
    setQuantity: (state, action: PayloadAction<number>) => {
        state = action.payload;
        return state;
      },
  },
});

export const { add, remove, setQuantity } = cartSlice.actions;
export default cartSlice.reducer;