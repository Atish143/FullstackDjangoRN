import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { cartService } from '../services/cartService';

const CartContext = createContext();

const initialState = { cart: null, loading: false, error: null };

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_CART':    return { ...state, cart: action.payload, loading: false, error: null };
    case 'SET_ERROR':   return { ...state, error: action.payload, loading: false };
    default:            return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const fetchCart = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await cartService.getCart();
      dispatch({ type: 'SET_CART', payload: data });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
    }
  }, []);

  const addToCart = useCallback(async (product_id, quantity = 1) => {
    try {
      const { data } = await cartService.addToCart(product_id, quantity);
      dispatch({ type: 'SET_CART', payload: data });
      return true;
    } catch { return false; }
  }, []);

  const updateItem = useCallback(async (item_id, quantity) => {
    try {
      const { data } = await cartService.updateItem(item_id, quantity);
      dispatch({ type: 'SET_CART', payload: data });
    } catch (e) { console.error(e); }
  }, []);

  const removeItem = useCallback(async (item_id) => {
    try {
      const { data } = await cartService.removeItem(item_id);
      dispatch({ type: 'SET_CART', payload: data });
    } catch (e) { console.error(e); }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
      dispatch({ type: 'SET_CART', payload: { items: [], total: '0.00', item_count: 0 } });
    } catch (e) { console.error(e); }
  }, []);

  return (
    <CartContext.Provider value={{ ...state, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);