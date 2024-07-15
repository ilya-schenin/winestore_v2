// redux/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import labelReducer from './slices/labelSlice';

const rootReducer = combineReducers({
  authModal: authReducer,
  userCart: cartReducer,
  infoLabel: labelReducer
});

export default rootReducer;
