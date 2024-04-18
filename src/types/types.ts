export type User = {
    name: string;
    email: string;
    gender: string;
    _id: string;
    dob: string;
    photo: string;
    role?: string;
};

export type ProductTypes = {
    _id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    photo: {
        publicId: string;
        url: string;
    };
    createdAt: string;
    updatedAt: string;
};

export type ShippingInfoTypes = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
};

export type CartItemType = {
    name: string;
    price: number;
    quantity: number;
    productId: string;
    stock: number;
    photo: {
        publicId: string;
        url: string;
    };
};

export type NewOrderDateTypes = {
    userId: string;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    shippingInfo: ShippingInfoTypes;
    cartItem: CartItemType[];
};
export type MyAllOrdersDataTypes = {
    shippingInfo: ShippingInfoTypes;
    _id: string;
    cartItem: {
        name: string;
        price: number;
        quantity: number;
        productId: string;
        stock: number;
        photo: {
            publicId: string;
            url: string;
        };
        _id: string;
    }[];
    userId: {
        _id: string;
        name: string;
    };
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    shippingCharges: number;
    status: string;
    createdAt: string;
    updatedAt: string;
};
// admin dashboard page stats types
type CountInStats = {
    products: number;
    users: number;
    orders: number;
    revenue: number;
};
export type TransactionItem = {
    _id: string;
    discount: number;
    price: number;
    items: string;
    status: string;
};
export type DashboardStats = {
    thisToLastMonthPercentage: CountInStats;
    totalCounts: CountInStats;
    TransactionAndRevenueChartData: { transactionCountData: number[]; totalRevenueData: number[] };
    inventoryProductsCategoryPercentage: Record<string, number>;
    userChartData: {
        female: number;
        male: number;
    };
    latestTransactionsData: TransactionItem[];
};

// Pie chart data
export type PieCharts = {
    orderFulfillment: {
        processing: number;
        shipped: number;
        delivered: number;
    };
    productsCategoriesRatio: Record<string, number>;
    stockAvailability: {
        outOfStock: number;
        inStock: number;
    };
    revenueDistribution: {
        netMargin: number;
        discount: number;
        productionCost: number;
        burnt: number;
        totalEarning: number;
    };
    usersAgeRatio: {
        teen: number;
        adult: number;
        old: number;
    };
    adminCustomerRatio: {
        admin: number;
        customers: number;
    };
};

// bar chart data
export type BarCharts = {
    sixMonthProductsAndCustomers: {
        products: number[];
        Customers: number[];
    };
    lastYearOrdersArr: number[];
};

// line chart data

export type LineCharts = {
    oneYearUserArr: number[];
    oneYearProductsArr: number[];
    oneYearRevenueArr: number[];
    oneYearDiscountsArr: number[];
};
