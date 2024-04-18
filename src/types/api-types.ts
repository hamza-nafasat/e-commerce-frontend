import {
    BarCharts,
    DashboardStats,
    LineCharts,
    MyAllOrdersDataTypes,
    PieCharts,
    ProductTypes,
    User,
} from "./types";

export interface CustomErrorType {
    status: number;
    data: {
        message: string;
        success: boolean;
    };
}

export interface msgResponseTypes {
    success: boolean;
    message: string;
}

export interface GetUserResponse {
    success: boolean;
    data: User;
}
export interface GetAllUserResponse {
    success: boolean;
    data: User[];
}

export interface ProductsResponseTypes {
    success: boolean;
    data: ProductTypes[];
}
export interface HighestPriceResponse {
    success: boolean;
    data: [
        {
            _id: string;
            price: number;
        }
    ];
}
export interface CategoriesResponseTypes {
    success: boolean;
    data: string[];
}
export interface SearchProductsTypes {
    success: boolean;
    data: {
        totalPages: number;
        filteredProducts: ProductTypes[];
    };
}
export interface SearchProductsQueryTypes {
    page: number;
    price: number;
    search: string;
    sort: string;
    category: string;
}
export interface NewProductFormData {}
export interface NewProductDataTypes {
    id: string;
    formData: NewProductFormData;
}
export interface SingleProductResponse {
    success: true;
    data: ProductTypes;
}
export interface UpdateSingleProductData {
    userId: string;
    productId: string;
    formData: FormData;
}
export interface DeleteSingleProductData {
    userId: string;
    productId: string;
}
export interface AllOrdersResponseTypes {
    success: boolean;
    data: MyAllOrdersDataTypes[];
}
export interface OrderDetailsResponseTypes {
    success: boolean;
    data: MyAllOrdersDataTypes;
}
export interface DashboardStatsResponse {
    success: boolean;
    data: DashboardStats;
}
export interface LineChartResponse {
    success: boolean;
    data: LineCharts;
}
export interface PieChartResponse {
    success: boolean;
    data: PieCharts;
}
export interface BarChartResponse {
    success: boolean;
    data: BarCharts;
}
