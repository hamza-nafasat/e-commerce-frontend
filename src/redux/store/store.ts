import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";
import userReducer from "../reducers/userReducer";
import productApi from "../api/productApi";
import { cartReducer } from "../reducers/cartReducer";
import { orderApi } from "../api/orderApi";
import { adminApi } from "../api/adminApi";

export const backendServerUrl = import.meta.env.VITE_BACKEND_SERVER;

export const store = configureStore({
    reducer: {
        [userReducer.name]: userReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(userApi.middleware)
            .concat(productApi.middleware)
            .concat(orderApi.middleware)
            .concat(adminApi.middleware),
});

export type StoreRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
