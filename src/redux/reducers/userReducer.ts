import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { userReducerInitState } from "../../types/reducer-types";
import { User } from "../../types/types";

const initialState: userReducerInitState = {
    user: null,
    loading: true,
};
const userReducer = createSlice({
    name: "userReducer",
    initialState: initialState,
    reducers: {
        userExist: (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload;
        },
        userNotExist: (state) => {
            state.loading = false;
            state.user = null;
        },
    },
});
export const { userExist, userNotExist } = userReducer.actions;
export default userReducer;
