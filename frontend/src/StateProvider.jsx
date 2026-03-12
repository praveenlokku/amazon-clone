import React, { createContext, useContext, useReducer, useEffect } from 'react';

const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);

const safeParse = (key, fallback) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.error(`Error parsing localStorage key "${key}":`, e);
        return fallback;
    }
};

export const initialState = {
    cart: safeParse('cart', []),
    user: safeParse('user', null),
    location: safeParse('location', { city: '', pincode: '' }),
    language: safeParse('language', { code: 'EN', name: 'English' }),
};

export const getCartTotal = (cart) =>
    (cart || []).reduce((amount, item) => (Number(item.price || 0) * Number(item.qty || 1)) + amount, 0);

export const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItem = state.cart.find((item) => item.product === action.item.product);
            let newCart;
            if (existingItem) {
                newCart = state.cart.map((item) =>
                    item.product === action.item.product ? { ...item, qty: item.qty + action.item.qty } : item
                );
            } else {
                newCart = [...state.cart, action.item];
            }
            localStorage.setItem('cart', JSON.stringify(newCart));
            return {
                ...state,
                cart: newCart,
            };

        case 'REMOVE_FROM_CART':
            const updatedCart = state.cart.filter((item) => item.product !== action.product);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return {
                ...state,
                cart: updatedCart,
            };

        case 'UPDATE_QTY':
            const qtyCart = state.cart.map((item) =>
                item.product === action.product ? { ...item, qty: action.qty } : item
            );
            localStorage.setItem('cart', JSON.stringify(qtyCart));
            return {
                ...state,
                cart: qtyCart
            };

        case 'EMPTY_CART':
            localStorage.removeItem('cart');
            return {
                ...state,
                cart: [],
            };

        case 'SET_USER':
            if (action.user) {
                localStorage.setItem('user', JSON.stringify(action.user));
            } else {
                localStorage.removeItem('user');
            }
            return {
                ...state,
                user: action.user,
            };

        case 'USER_LOGOUT':
            localStorage.removeItem('user');
            localStorage.removeItem('cart');
            return {
                ...state,
                user: null,
                cart: [],
            };

        case 'SET_LOCATION':
            localStorage.setItem('location', JSON.stringify(action.location));
            return {
                ...state,
                location: action.location,
            };

        case 'SET_LANGUAGE':
            localStorage.setItem('language', JSON.stringify(action.language));
            return {
                ...state,
                language: action.language,
            };

        default:
            return state;
    }
};
