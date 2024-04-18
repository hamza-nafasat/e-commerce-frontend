import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllOrdersResponseTypes, OrderDetailsResponseTypes, msgResponseTypes } from "../../types/api-types";
import { NewOrderDateTypes } from "../../types/types";

const backendServerUrl = import.meta.env.VITE_BACKEND_SERVER;

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${backendServerUrl}/api/v1/orders/`,
    }),
    tagTypes: ["orders"],
    endpoints: (builder) => ({
        // 1. create order
        createOrder: builder.mutation<msgResponseTypes, NewOrderDateTypes>({
            query: (order) => ({
                url: "new",
                method: "POST",
                body: order,
            }),
            invalidatesTags: ["orders"],
        }),
        // 2. get my orders
        myAllOrders: builder.query<AllOrdersResponseTypes, string>({
            query: (id) => `my?id=${id}`,
            providesTags: ["orders"],
        }),
        // 3. get all Orders
        allOrders: builder.query<AllOrdersResponseTypes, string>({
            query: (id) => `all?id=${id}`,
            providesTags: ["orders"],
        }),
        // 4. get single order
        singleOrder: builder.query<OrderDetailsResponseTypes, string>({
            query: (id) => `single/${id}`,
            providesTags: ["orders"],
        }),
        // 5. delete order
        deleteOrder: builder.mutation<msgResponseTypes, { orderId: string; userId: string }>({
            query: ({ orderId, userId }) => ({
                url: `single/${orderId}?id=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["orders"],
        }),
        // 6. Process Order
        processOrder: builder.mutation<msgResponseTypes, { orderId: string; userId: string }>({
            query: ({ orderId, userId }) => ({
                url: `single/${orderId}?id=${userId}`,
                method: "PUT",
            }),
            invalidatesTags: ["orders"],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useMyAllOrdersQuery,
    useAllOrdersQuery,
    useSingleOrderQuery,
    useDeleteOrderMutation,
    useProcessOrderMutation,
} = orderApi;
