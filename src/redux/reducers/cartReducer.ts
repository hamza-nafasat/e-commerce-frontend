import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CartReducerInitState } from "../../types/reducer-types";
import { CartItemType } from "../../types/types";

const initialState: CartReducerInitState = {
    isLoading: false,
    cartItem: [],
    tax: 0,
    total: 0,
    subtotal: 0,
    discount: 0,
    shippingCharges: 0,
    shippingInfo: {
        address: "",
        city: "",
        country: "",
        state: "",
        pinCode: 0,
    },
};

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItemType>) => {
            state.isLoading = true;
            const index = state.cartItem.findIndex((item) => item.productId === action.payload.productId);
            if (index !== -1) {
                throw Error("Product Already In Cart");
            } else {
                state.cartItem = [...state.cartItem, action.payload];
            }
            state.isLoading = false;
        },
        updateCart: (state, action: PayloadAction<CartItemType>) => {
            state.isLoading = true;
            const index = state.cartItem.findIndex((item) => item.productId === action.payload.productId);
            if (index !== -1) {
                state.cartItem[index].quantity = action.payload.quantity;
            }
            state.isLoading = false;
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.isLoading = true;
            state.cartItem = state.cartItem.filter((item) => item.productId !== action.payload);
            state.isLoading = false;
        },
        calculatePrise: (state) => {
            state.isLoading = true;
            state.subtotal = state.cartItem.reduce((acc, item) => acc + item.price * item.quantity, 0);
            state.shippingCharges = state.subtotal > 5000 || state.subtotal <= 0 ? 0 : 200;
            state.tax = Math.round(state.subtotal * 0.18);
            state.total = state.subtotal + state.tax + state.shippingCharges - state.discount;
            state.isLoading = false;
        },
        discountApplied: (state, action: PayloadAction<number>) => {
            state.isLoading = true;
            state.discount = action.payload;
            state.total = state.subtotal + state.tax + state.shippingCharges - state.discount;
            state.isLoading = false;
        },
        saveShippingInfo: (state, action: PayloadAction<CartReducerInitState["shippingInfo"]>) => {
            state.isLoading = true;
            state.shippingInfo = action.payload;
            state.isLoading = false;
        },
        resetCart: () => initialState,
    },
});

export const {
    addToCart,
    updateCart,
    removeFromCart,
    calculatePrise,
    discountApplied,
    saveShippingInfo,
    resetCart,
} = cartReducer.actions;
