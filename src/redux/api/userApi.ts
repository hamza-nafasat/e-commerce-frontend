import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { GetAllUserResponse, GetUserResponse, msgResponseTypes } from "../../types/api-types";
import { User } from "../../types/types";

const backendServerUrl = import.meta.env.VITE_BACKEND_SERVER;

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${backendServerUrl}/api/v1/users/` }),
    tagTypes: ["users"],
    endpoints: (builder) => ({
        // 1 login user
        login: builder.mutation<msgResponseTypes, User>({
            query: (user) => ({
                url: "new",
                method: "POST",
                body: user,
            }),
        }),
        // 2 all users
        allUsers: builder.query<GetAllUserResponse, string>({
            query: (id) => `all?id=${id}`,
            providesTags: ["users"],
        }),
        // 3 delete user
        deleteUser: builder.mutation<msgResponseTypes, { userId: string; myId: string }>({
            query: ({ myId, userId }) => ({
                url: `one/${userId}?id=${myId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["users"],
        }),
    }),
});

export const { useLoginMutation, useAllUsersQuery, useDeleteUserMutation } = userApi;

// getting user from data base which help us to check that user is login or not
export const getUserFromDb = async (id: string) => {
    try {
        const { data }: { data: GetUserResponse } = await axios.get(
            `${backendServerUrl}/api/v1/users/one/${id}`
        );
        return data;
    } catch (error) {
        throw error;
    }
};
