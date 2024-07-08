// redux/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

const rootReducer = combineReducers({
  authModal: authReducer,
  userCart: cartReducer
});

export default rootReducer;
