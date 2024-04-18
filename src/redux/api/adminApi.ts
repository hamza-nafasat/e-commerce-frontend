import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    BarChartResponse,
    DashboardStatsResponse,
    LineChartResponse,
    PieChartResponse,
} from "../../types/api-types";

const backendServerUrl = import.meta.env.VITE_BACKEND_SERVER;

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${backendServerUrl}/api/v1/admin`,
    }),
    endpoints: (builder) => ({
        // 1. dashboard stats
        dashboardStats: builder.query<DashboardStatsResponse, string>({
            query: (id) => `dashboard/stats?id=${id}`,
            keepUnusedDataFor: 0,
        }),
        // 2. pie charts
        pieChartState: builder.query<PieChartResponse, string>({
            query: (id) => `charts/pie?id=${id}`,
            keepUnusedDataFor: 0,
        }),
        // 3. line charts
        lineChartState: builder.query<LineChartResponse, string>({
            query: (id) => `charts/line?id=${id}`,
            keepUnusedDataFor: 0,
        }),
        // 4. bar charts
        barChartState: builder.query<BarChartResponse, string>({
            query: (id) => `charts/bar?id=${id}`,
            keepUnusedDataFor: 0,
        }),
    }),
});

export const {
    useDashboardStatsQuery,
    usePieChartStateQuery,
    useLineChartStateQuery,
    useBarChartStateQuery,
} = adminApi;
