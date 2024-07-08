import { createSlice } from '@reduxjs/toolkit';

type AuthState = boolean;

const initialState: AuthState = false;

const authSlice = createSlice({
  name: 'authModal',
  initialState,
  reducers: {
    toggleModal: (state) => {
      return !state;
    },
  },
});

export const { toggleModal } = authSlice.actions;
export default authSlice.reducer;
