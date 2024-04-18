import { CartItemType, ShippingInfoTypes, User } from "./types";

export interface userReducerInitState {
    user: User | null;
    loading: boolean;
}

export interface CartReducerInitState {
    cartItem: CartItemType[];
    isLoading: boolean;
    shippingInfo: ShippingInfoTypes;
    shippingCharges: number;
    total: number;
    subtotal: number;
    tax: number;
    discount: number;
}
